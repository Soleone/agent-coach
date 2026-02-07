---
description: Sync Claude Code session logs with coach diary. Reads session metadata from .claude/projects and creates diary entries for completed work sessions.
allowed-tools: "Read,Glob,Write,Edit,Bash"
---

## Configuration

- **Obsidian vault ({vault} variable):** /mnt/d/data/obsidian-vault
- **Daily notes directory name ({journals} variable):** _journals
- **Claude projects directory:** ~/.claude/projects/

## What This Command Does

Syncs your Claude Code work sessions to your coach diary by:
1. Reading session metadata from `~/.claude/projects/<project-dir>/sessions-index.json`
2. Extracting session summaries, timestamps, and work details
3. Creating diary entries on the appropriate date's journal page
4. Handling timezone conversion (UTC → local)
5. Avoiding duplicates by checking for existing session entries

## Process

**Step 1: Get current project path and session index**

```bash
# Get current working directory
pwd

# Build the project path key (replace / with -)
# Example: /home/user/project → -home-user-project

# Read sessions index
cat ~/.claude/projects/<project-path-key>/sessions-index.json
```

**Step 2: Parse session metadata**

From `sessions-index.json`, extract for each session:
- `sessionId` - Unique identifier
- `created` - ISO timestamp (UTC): "2026-01-17T19:32:44.740Z"
- `modified` - ISO timestamp (UTC): "2026-01-18T07:26:13.734Z"
- `summary` - One-line session summary
- `firstPrompt` - What user initially requested
- `messageCount` - Number of messages in session
- `gitBranch` - Branch worked on

**Step 3: Convert timestamps to local timezone**

```bash
# Convert UTC timestamp to local date
date -d "2026-01-17T19:32:44.740Z" +"%Y-%m-%d"  # → 2026-01-17

# Convert to local time
date -d "2026-01-17T19:32:44.740Z" +"%H:%M"     # → 14:32 (example)

# Get local timezone
date +"%Z"  # → EST, PST, etc.
```

**Step 4: Check for existing entries**

Before writing, check if the session ID already exists in the target journal page:

```bash
# Check if sessionId is already in the journal
grep -q "session:${sessionId}" {vault}/{journals}/YYYY-MM-DD.md
```

Skip sessions that are already logged.

**Step 5: Create diary entries**

For each session, append to `{vault}/{journals}/YYYY-MM-DD.md` under `# Coach` header:

**Format:**
```markdown
- HH:MM: [Session summary] (session:[sessionId], branch:[gitBranch], messages:[messageCount])
```

**Example entries:**
```markdown
# Coach

- 14:32: Coach skill entity-first approach with timezone fixes (session:e46a08f9, branch:main, messages:13)
- 19:24: Beads setup and symlink configuration (session:c34033e0, branch:main, messages:21)
```

**Step 6: Handle edge cases**

- **No sessions-index.json:** Inform user that no sessions found for this project
- **Empty sessions list:** No sessions to sync
- **Missing journal page:** Create the journal page with `# Coach` header
- **Timezone errors:** Fall back to UTC timestamps if conversion fails

## User Interaction

**When sync completes:**
- Report how many sessions were synced
- Report which dates were updated
- Note any sessions skipped (already synced)

**Example output:**
```
Synced 5 sessions to your diary:
- 2026-01-24: 3 sessions
- 2026-01-25: 2 sessions

Skipped 2 sessions (already in diary)
```

## Implementation Notes

**Session ID tracking:** Include `session:[sessionId]` in diary entries to enable duplicate detection on subsequent syncs.

**Timezone handling:** Always convert from UTC (session logs) to local timezone (diary entries) using `date -d` command.

**Incremental sync:** Running the command multiple times is safe - it only adds new sessions.

**Performance:** For projects with many sessions (>50), consider:
- Only syncing sessions from last N days
- Asking user for date range to sync
- Showing progress for large syncs

## Future Enhancements

Consider adding:
- `--since` flag: Sync only sessions after a date
- `--dry-run` flag: Preview what would be synced
- Auto-sync hook: Automatically sync at session end
- Project filtering: Sync specific project only
