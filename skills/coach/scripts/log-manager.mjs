#!/usr/bin/env node
import fs from "node:fs";

function parseArgs(argv) {
  const args = {
    file: "",
    section: "# Coach",
    entries: [],
    entriesFile: "",
    apply: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--file") args.file = argv[++i];
    else if (token === "--section") args.section = argv[++i];
    else if (token === "--entry") args.entries.push(argv[++i]);
    else if (token === "--entries-file") args.entriesFile = argv[++i];
    else if (token === "--apply") args.apply = true;
    else if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!args.file) throw new Error("Missing required argument: --file");
  return args;
}

function printHelp() {
  console.log(`log-manager.mjs

Usage:
  node skills/coach/scripts/log-manager.mjs --file <path> [options]

Options:
  --section <selector>    Header chain to target (default: "# Coach")
                         Entries in this section are merged and sorted oldest-first
  --entry <line>          Entry line to add (repeatable), with or without leading '- '
  --entries-file <path>   JSON file containing array of entry lines
  --apply                 Write changes (default: dry-run)
  -h, --help              Show help

Examples:
  node skills/coach/scripts/log-manager.mjs --file /vault/_journals/2026-02-17.md --entry "01:40: Did thing" --apply
  node skills/coach/scripts/log-manager.mjs --file /vault/Coach/Projects/Pi.md --section "# Log" --entry "[[2026-02-17]] 01:40: Did thing" --apply
`);
}

function normalizeEntryLine(raw) {
  const line = raw.trim();
  if (!line) return "";
  return line.startsWith("- ") ? line : `- ${line}`;
}

function parseEntriesFile(entriesFile) {
  if (!entriesFile) return [];
  const raw = fs.readFileSync(entriesFile, "utf8");
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error("entries file must contain a JSON array of strings");
  return parsed.map((entry) => String(entry));
}

function parseSelector(selector) {
  return selector
    .split(">")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const match = part.match(/^(#+)\s+(.+)$/);
      if (!match) throw new Error(`Invalid selector part: ${part}`);
      return { level: match[1].length, title: match[2].trim() };
    });
}

function parseHeadings(text) {
  const headings = [];
  const re = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = re.exec(text)) !== null) {
    const lineStart = match.index;
    const lineEnd = text.indexOf("\n", lineStart);
    headings.push({
      level: match[1].length,
      title: match[2].trim(),
      lineStart,
      contentStart: lineEnd === -1 ? text.length : lineEnd + 1,
    });
  }
  return headings;
}

function findHeadingAfter(headings, part, minIndex) {
  return headings.find((h) => h.lineStart >= minIndex && h.level === part.level && h.title === part.title);
}

function ensureSection(text, selectorParts) {
  let currentText = text;
  let cursor = 0;

  for (let i = 0; i < selectorParts.length; i += 1) {
    const headings = parseHeadings(currentText);
    const found = findHeadingAfter(headings, selectorParts[i], cursor);
    if (found) {
      cursor = found.contentStart;
      continue;
    }

    const headingLine = `${"#".repeat(selectorParts[i].level)} ${selectorParts[i].title}`;
    if (!currentText.endsWith("\n")) currentText += "\n";
    if (!currentText.endsWith("\n\n")) currentText += "\n";
    const insertAt = currentText.length;
    currentText += `${headingLine}\n`;
    cursor = insertAt + headingLine.length + 1;
  }

  return currentText;
}

function findSectionRange(text, selectorParts) {
  const headings = parseHeadings(text);
  let target = null;
  let cursor = 0;

  for (const part of selectorParts) {
    const found = findHeadingAfter(headings, part, cursor);
    if (!found) return null;
    target = found;
    cursor = found.contentStart;
  }

  if (!target) return null;

  const boundary = headings
    .filter((h) => h.lineStart > target.lineStart && h.level <= target.level)
    .map((h) => h.lineStart)
    .sort((a, b) => a - b)[0];

  return {
    start: target.contentStart,
    end: boundary ?? text.length,
  };
}

function sortKeyForEntry(line) {
  const body = line.replace(/^-\s*/, "").trim();
  const priority = body.includes("(project-intro:") ? "0" : "1";

  const entity = body.match(/^\[\[(\d{4}-\d{2}-\d{2})\]\]\s+(\d{2}:\d{2})/);
  if (entity) return `${entity[1]}T${entity[2]}|${priority}|${body}`;

  const daily = body.match(/^(\d{2}:\d{2})/);
  if (daily) return `0000-00-00T${daily[1]}|${priority}|${body}`;

  return `9999-99-99T99:99|${priority}|${body}`;
}

function isBullet(line) {
  return /^-\s+/.test(line);
}

function upsertEntriesInSection(content, selector, incomingEntries) {
  const selectorParts = parseSelector(selector);
  const ensured = ensureSection(content, selectorParts);
  const range = findSectionRange(ensured, selectorParts);
  if (!range) throw new Error(`Could not locate section: ${selector}`);

  const sectionBody = ensured.slice(range.start, range.end);
  const lines = sectionBody.split("\n");

  const firstBulletIdx = lines.findIndex(isBullet);
  const existingBullets = lines.filter(isBullet).map((line) => line.trim());

  const merged = [...existingBullets];
  for (const raw of incomingEntries) {
    const normalized = normalizeEntryLine(raw);
    if (!normalized) continue;
    if (!merged.includes(normalized)) merged.push(normalized);
  }

  merged.sort((a, b) => sortKeyForEntry(a).localeCompare(sortKeyForEntry(b)));

  let nextSectionBody;
  if (firstBulletIdx === -1) {
    const suffix = lines.join("\n");
    const prefix = suffix.trimEnd();
    const lead = prefix.length > 0 ? `${prefix}\n` : "";
    nextSectionBody = `${lead}${merged.join("\n")}\n`;
  } else {
    const prefix = lines.slice(0, firstBulletIdx).join("\n");
    const suffix = lines.slice(firstBulletIdx).filter((line) => !isBullet(line)).join("\n");

    const prefixPart = prefix.length > 0 ? `${prefix}${prefix.endsWith("\n") ? "" : "\n"}` : "";
    const suffixPart = suffix.length > 0 ? `${suffix.startsWith("\n") ? "" : "\n"}${suffix}` : "";

    nextSectionBody = `${prefixPart}${merged.join("\n")}${suffixPart}`;
    if (!nextSectionBody.endsWith("\n")) nextSectionBody += "\n";
  }

  const updated = `${ensured.slice(0, range.start)}${nextSectionBody}${ensured.slice(range.end)}`;
  return {
    updated,
    existingCount: existingBullets.length,
    finalCount: merged.length,
    addedCount: merged.length - existingBullets.length,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const fileExists = fs.existsSync(args.file);
  const original = fileExists ? fs.readFileSync(args.file, "utf8") : "";
  const fileEntries = parseEntriesFile(args.entriesFile);
  const incomingEntries = [...args.entries, ...fileEntries];

  const result = upsertEntriesInSection(original, args.section, incomingEntries);
  const changed = result.updated !== original;

  const report = {
    mode: args.apply ? "apply" : "dry-run",
    file: args.file,
    section: args.section,
    fileExisted: fileExists,
    incomingEntries: incomingEntries.length,
    existingEntries: result.existingCount,
    addedEntries: result.addedCount,
    finalEntries: result.finalCount,
    changed,
  };

  console.log(JSON.stringify(report, null, 2));

  if (args.apply && changed) {
    fs.writeFileSync(args.file, result.updated, "utf8");
  }
}

try {
  main();
} catch (error) {
  console.error(`log-manager error: ${error.message}`);
  process.exit(1);
}
