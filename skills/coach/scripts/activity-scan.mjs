#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import os from "node:os";

function parseArgs(argv) {
  const args = {
    vault: "/mnt/d/data/obsidian-vault",
    journals: "_journals",
    since: "3 days ago",
    maxCommits: 40,
    apply: false,
    includeMerges: false,
    roots: [],
    state: undefined,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--vault") args.vault = argv[++i];
    else if (token === "--journals") args.journals = argv[++i];
    else if (token === "--since") args.since = argv[++i];
    else if (token === "--max-commits") args.maxCommits = Number(argv[++i]);
    else if (token === "--apply") args.apply = true;
    else if (token === "--include-merges") args.includeMerges = true;
    else if (token === "--state") args.state = argv[++i];
    else if (token === "--roots") args.roots.push(argv[++i]);
    else if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`activity-scan.mjs

Usage:
  node skills/coach/scripts/activity-scan.mjs [options]

Options:
  --vault <path>          Obsidian vault root (default: /mnt/d/data/obsidian-vault)
  --journals <name>       Journal directory name (default: _journals)
  --state <path>          Explicit State.md path (default: <vault>/Coach/State.md)
  --roots <value>         Override scan roots (repeatable or comma-separated)
  --since <expr>          Git window (default: "3 days ago")
  --max-commits <n>       Max commits to process (default: 40)
  --include-merges        Include merge commits (default: false)
  --apply                 Write journal files (default: dry-run)
  -h, --help              Show help
`);
}

function parseStateRoots(statePath) {
  if (!fs.existsSync(statePath)) return [];
  const text = fs.readFileSync(statePath, "utf8");
  const match = text.match(/^\s*-\s*activity-scan-roots:\s*(.+)$/m);
  if (!match) return [];
  return splitRoots(match[1]);
}

function splitRoots(raw) {
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function expandEnvVars(value) {
  return value.replace(/\$([A-Z_][A-Z0-9_]*)/g, (_, name) => process.env[name] ?? "");
}

function expandPath(raw) {
  let result = raw.trim();
  result = expandEnvVars(result);
  if (result.startsWith("~")) {
    result = path.join(os.homedir(), result.slice(1));
  }
  return path.resolve(result);
}

function resolveRoots(cliRoots, statePath) {
  const rootsFromCli = cliRoots.flatMap(splitRoots);
  const rootsRaw = rootsFromCli.length > 0 ? rootsFromCli : parseStateRoots(statePath);
  const fallback = rootsRaw.length > 0 ? rootsRaw : ["$CODE"];

  const resolved = [];
  const skipped = [];
  const seen = new Set();

  for (const token of fallback) {
    const full = expandPath(token);
    if (!full || seen.has(full)) continue;
    if (!fs.existsSync(full) || !fs.statSync(full).isDirectory()) {
      skipped.push({ token, resolved: full });
      continue;
    }
    seen.add(full);
    resolved.push(full);
  }

  return { resolved, skipped, source: rootsFromCli.length > 0 ? "cli" : "state" };
}

function discoverRepos(roots) {
  const repos = [];
  for (const root of roots) {
    if (isGitRepo(root)) repos.push(root);
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith(".")) continue;
      const candidate = path.join(root, entry.name);
      if (isGitRepo(candidate)) repos.push(candidate);
    }
  }

  const unique = [...new Set(repos)];
  return unique
    .map((repoPath) => ({
      path: repoPath,
      mtimeMs: fs.statSync(repoPath).mtimeMs,
      name: path.basename(repoPath),
    }))
    .sort((a, b) => {
      if (b.mtimeMs !== a.mtimeMs) return b.mtimeMs - a.mtimeMs;
      return a.path.localeCompare(b.path);
    });
}

function isGitRepo(dir) {
  return fs.existsSync(path.join(dir, ".git"));
}

function summarizeMessage(message) {
  const cleaned = message
    .replace(/^(feat|fix|refactor|docs|chore)(\([^)]*\))?:\s*/i, "")
    .trim();

  return cleaned.length > 140 ? `${cleaned.slice(0, 137)}...` : cleaned;
}

function readCommits(repo, since, includeMerges) {
  const args = [
    "-C",
    repo.path,
    "log",
    `--since=${since}`,
    "--pretty=format:%h%x1f%ad%x1f%s",
    "--date=iso-local",
  ];
  if (!includeMerges) args.push("--no-merges");

  const stdout = execFileSync("git", args, { encoding: "utf8" });
  if (!stdout.trim()) return [];

  return stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [hash, authoredAt, subject] = line.split("\x1f");
      const parsed = parseGitDate(authoredAt);
      return {
        repo: repo.name,
        repoPath: repo.path,
        hash,
        date: parsed.date,
        time: parsed.time,
        sortKey: `${parsed.date}T${parsed.time}|${repo.name}|${hash}`,
        summary: summarizeMessage(subject),
      };
    });
}

function parseGitDate(authoredAt) {
  const match = authoredAt.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}):\d{2}\s+[+-]\d{4}$/);
  if (!match) throw new Error(`Unexpected git date format: ${authoredAt}`);
  return { date: match[1], time: match[2] };
}

function ensureJournalTemplate(filePath, date) {
  if (fs.existsSync(filePath)) return;
  const weekday = new Date(`${date}T12:00:00`).toLocaleDateString("en-US", { weekday: "long" });
  const content = `---\nWeekday:\n  - "${weekday}"\n---\n# Tasks\n![[tasks-default.base#Today]]\n\n# Accomplishments\n![[tasks-default.base#Done Today]]\n\n# Coach\n`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function readProjectDescription(repoPath, fallbackSummary) {
  const packageJsonPath = path.join(repoPath, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      if (typeof parsed.description === "string" && parsed.description.trim().length > 0) {
        return parsed.description.trim();
      }
    } catch {
      // ignore malformed package.json
    }
  }

  return fallbackSummary || "Active development project tracked via git activity scanner.";
}

function hasProjectIntroMarker(journalsDir, repoName) {
  if (!fs.existsSync(journalsDir)) return false;
  const marker = `(project-intro:${repoName})`;

  for (const entry of fs.readdirSync(journalsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const content = fs.readFileSync(path.join(journalsDir, entry.name), "utf8");
    if (content.includes(marker)) return true;
  }

  return false;
}

function runLogManager({ file, section, entries, apply }) {
  if (entries.length === 0) {
    return { changed: false, addedEntries: 0, finalEntries: 0, existingEntries: 0 };
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "coach-log-manager-"));
  const entriesFile = path.join(tmpDir, "entries.json");
  fs.writeFileSync(entriesFile, JSON.stringify(entries), "utf8");

  const scriptPath = path.resolve(path.dirname(new URL(import.meta.url).pathname), "log-manager.mjs");
  const args = [scriptPath, "--file", file, "--section", section, "--entries-file", entriesFile];
  if (apply) args.push("--apply");

  try {
    const output = execFileSync("node", args, { encoding: "utf8" }).trim();
    return JSON.parse(output);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const statePath = args.state ?? path.join(args.vault, "Coach", "State.md");
  const journalsDir = path.join(args.vault, args.journals);
  const { resolved: roots, skipped, source } = resolveRoots(args.roots, statePath);

  if (roots.length === 0) {
    throw new Error("No valid scan roots found. Set activity-scan-roots in State.md or pass --roots.");
  }

  const repos = discoverRepos(roots);
  const allCommits = repos.flatMap((repo) => readCommits(repo, args.since, args.includeMerges));

  const selectedDesc = allCommits
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
    .slice(0, args.maxCommits);

  const selectedCommits = selectedDesc.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const commitsByDate = new Map();
  for (const commit of selectedCommits) {
    if (!commitsByDate.has(commit.date)) commitsByDate.set(commit.date, []);
    commitsByDate.get(commit.date).push(commit);
  }

  const introEntriesByDate = new Map();
  const firstCommitByRepo = new Map();
  for (const commit of selectedCommits) {
    if (!firstCommitByRepo.has(commit.repo)) {
      firstCommitByRepo.set(commit.repo, commit);
    }
  }

  for (const [repoName, firstCommit] of firstCommitByRepo.entries()) {
    if (hasProjectIntroMarker(journalsDir, repoName)) continue;

    const description = readProjectDescription(firstCommit.repoPath, firstCommit.summary);
    const intro = `- ${firstCommit.time}: [${repoName}] Project overview: ${description} (project-intro:${repoName})`;

    if (!introEntriesByDate.has(firstCommit.date)) introEntriesByDate.set(firstCommit.date, []);
    introEntriesByDate.get(firstCommit.date).push(intro);
  }

  const filesToUpdate = [];
  let loggedEntries = 0;

  for (const [date, commits] of [...commitsByDate.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const journalPath = path.join(journalsDir, `${date}.md`);
    if (args.apply) ensureJournalTemplate(journalPath, date);

    const introEntries = introEntriesByDate.get(date) ?? [];
    const commitEntries = commits.map((c) => `- ${c.time}: [${c.repo}] ${c.summary} (git:${c.hash})`);
    const entries = [...introEntries, ...commitEntries];
    const report = runLogManager({
      file: journalPath,
      section: "# Coach",
      entries,
      apply: args.apply,
    });

    loggedEntries += report.addedEntries;
    if (report.changed) {
      filesToUpdate.push({ path: journalPath, added: report.addedEntries });
    }
  }

  const activeRepos = new Set(selectedCommits.map((c) => c.repo));
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const nowTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const todayPath = path.join(journalsDir, `${today}.md`);
  if (args.apply) ensureJournalTemplate(todayPath, today);

  const rollup = `- ${nowTime}: Activity scan run (${source} roots) scanned ${repos.length} repos across ${roots.length} roots, ${activeRepos.size} repos had activity, logged ${loggedEntries} entries (project intros + commits) for since=\"${args.since}\".`;
  const rollupReport = runLogManager({
    file: todayPath,
    section: "# Coach",
    entries: [rollup],
    apply: args.apply,
  });

  if (rollupReport.changed && !filesToUpdate.some((f) => f.path === todayPath)) {
    filesToUpdate.push({ path: todayPath, added: 0 });
  }

  const report = {
    mode: args.apply ? "apply" : "dry-run",
    statePath,
    rootSource: source,
    roots,
    skippedRoots: skipped,
    reposScanned: repos.length,
    reposWithActivity: activeRepos.size,
    commitsConsidered: allCommits.length,
    commitsSelected: selectedCommits.length,
    entriesLogged: loggedEntries,
    filesToUpdate,
  };

  console.log(JSON.stringify(report, null, 2));

  if (!args.apply) {
    const preview = selectedCommits
      .slice(0, 20)
      .map((c) => `- ${c.date} ${c.time} [${c.repo}] ${c.summary} (git:${c.hash})`);
    if (preview.length > 0) {
      console.log("\nPreview (first 20 selected commits, oldest-first):");
      console.log(preview.join("\n"));
    }
  }
}

try {
  main();
} catch (error) {
  console.error(`activity-scan error: ${error.message}`);
  process.exit(1);
}
