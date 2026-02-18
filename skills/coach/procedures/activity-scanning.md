# Activity Scanning Procedure

Purpose: standardize how Coach scans `$CODE` repositories, extracts recent git activity, and logs concise, timestamp-accurate diary entries.

Use this when user asks for:
- recent code changes
- what they worked on in repos
- auto-journaling from git history
- `$CODE` activity summaries

## Inputs

- Scan roots from `{vault}/Coach/State.md`:
  - `- activity-scan-roots: $CODE, $TRIES, ~/workspace/other`
- Optional CLI root overrides (`--roots`) for one-off scans
- `{vault}` and `{journals}` for diary output
- Optional window (default: last 3 days)

## Output Contract

### 0) New-project intro entry (required)

When a repo is seen for the first time in activity logs, add one intro line before its commit lines.

- Target file: journal page of that repo's first scanned commit date
- Entry format:
  - `- HH:MM: [repo] Project overview: <what it is about> (project-intro:<repo>)`
- Timestamp:
  - Default to same timestamp as first commit for that repo
  - If needed, can be 1 minute earlier, but same time is acceptable

### 1) Commit-level diary entries (required)

Write one entry per commit using the commit's local timestamp.

- Target file: `{vault}/{journals}/YYYY-MM-DD.md` (commit date)
- Entry format:
  - `- HH:MM: [repo] <concise commit summary> (git:<short-hash>)`
- Example:
  - `- 23:53: [pi-mp] Added runtime host/join commands and topology docs (git:d4a57df)`

**Rules:**
- Use commit timestamp, not current time
- Keep summary concise and human-readable
- Include `git:<hash>` marker for dedupe
- Include `project-intro:<repo>` marker for one-time project intro dedupe
- Skip merge commits unless user explicitly asks to include them
- Journal ordering is **oldest first**; new entries are appended in chronological order
- Preserve existing entries/content; ordering is maintained chronologically (oldest first) via log-manager

### 2) Scan rollup entry (required)

Add one rollup entry to today's `# Coach` section with scan metadata:
- repos scanned
- repos with activity
- commit count logged
- time window used

## Deterministic Workflow

### Step 0: Use the scanner script

Run:

```bash
node skills/coach/scripts/activity-scan.mjs --apply
```

The scanner must write via `skills/coach/scripts/log-manager.mjs` semantics:
- section selector default: `# Coach`
- merge without overwriting existing entries
- sort resulting list oldest-first

Dry-run preview:

```bash
node skills/coach/scripts/activity-scan.mjs
```

Override roots for one run (CLI overrides State.md):

```bash
node skills/coach/scripts/activity-scan.mjs --roots "$CODE,$TRIES" --apply
```

### Step 1: Identify candidate repos in scan roots

The script resolves roots from State.md by default, with CLI overrides when provided.

Root resolution rules:
- Accept both env vars (`$CODE`, `$TRIES`) and explicit paths (`~/workspace/js`)
- Expand env vars and `~`
- Skip missing roots (report in output)

Repo discovery rules:
- Root itself if it contains `.git`
- Immediate child directories containing `.git`
- Sort repos by folder `mtime` desc for deterministic scan order

### Step 2: Extract recent git history

For each candidate repo, run git log within time window using:

```bash
git -C <repo> log \
  --since="<window>" \
  --pretty=format:%h%x1f%ad%x1f%s \
  --date=iso-local \
  --no-merges
```

### Step 3: Normalize entries

For each commit:
1. Parse date/time in local timezone
2. Convert message to concise summary (keep intent, remove noise)
3. Produce journal line in output contract format
4. Skip if journal already contains `git:<short-hash>`

### Step 4: Route to correct historical journal page

Use commit date to choose file:
- `2026-02-14 01:48:44 -0500` → `{journals}/2026-02-14.md`

If journal file does not exist, create it with standard template and `# Coach` section.
Write entries via log-manager into `# Coach` so merge + chronology are deterministic.
Never replace existing log content while inserting new commit entries.

### Step 5: Add scan rollup entry for traceability

On today's journal page, append one line describing:
- scan scope (`$CODE`, window)
- repos and commit totals
- notable momentum/stall pattern

## Quality Bar

A good scan is:
- **Timestamp-accurate** (commit time reflected in entry)
- **Deduplicated** (`git:<hash>` marker check)
- **Entity-aware** (repo names preserved)
- **Concise** (single-line summaries)
- **Repeatable** (same input window → same output)

## Default Heuristics

- Time window: last 3 days
- Max commits logged per run: 40
- Skip merge commits
- Prioritize repos by both:
  - recent folder `mtime`
  - commit count in window

## Optional Coaching Layer

After logging commits, provide a short conversational readout:
- Where momentum is strongest (repo + pattern)
- Where activity dropped/stalled
- 1 suggested next focus
