# Beads Integration

**CRITICAL RULE - Beads-First Workflow:**

When user mentions project tasks or status:
1. **FIRST**: Read the project file and check for `location` field
2. **THEN**: If location exists, check if `.beads` directory exists: `cd <location> && [ -d .beads ]`
3. **IF .beads EXISTS**: Run `bd list` to get actual task status
   - **All tasks live in beads ONLY**
   - Do NOT use `## Tasks` section in the markdown file
   - Do NOT create inline journal tasks for this project
   - Use beads commands exclusively for task tracking
4. **IF .beads DOES NOT EXIST**: Only then use markdown `## Tasks` section

**Never assume markdown tasks - always check beads first.**

## Detection

Check if a project is beads-managed:

```bash
cd <location> && [ -d .beads ] && echo "BEADS" || echo "MARKDOWN"
```

If output is "BEADS", use beads commands. Otherwise, use markdown `## Tasks` section.

## Loading Tasks (Session Start)

For projects with `location` field and `.beads` directory, load task context:

```bash
cd <location> && bd ready --json              # Actionable tasks (not blocked)
cd <location> && bd list --status in_progress --json  # Currently active tasks
cd <location> && bd list --status done --json | head -20  # Recent completions
```

Parse JSON and use this context when:
- Prioritizing work
- Coaching on next steps
- Referencing specific tasks by ID

See [procedures/session-start.md](../procedures/session-start.md) for details on loading beads tasks.

## Beads Commands

### Create

```bash
bd create "<title>" [-t type] [-p 0-4] [-l labels] [-d "description"]
```

**Types:** task (default), feature, bug, epic, chore

**Labels for Coach:** idea, thought (used instead of type for non-task items)

### Query

```bash
bd ready --json              # What's actionable now
bd list --status open --json # All open items
bd show <id> --json          # Single item details
```

### Update

```bash
bd update <id> --status in_progress
bd close <id> --reason "<text>"
```

## Workflow

1. **Detect project context** from conversation
2. **Check if beads-managed:** `cd <location> && [ -d .beads ] && echo "BEADS" || echo "MARKDOWN"`
3. **If BEADS:**
   - Create items: `bd create "<title>" -t task|feature|bug` or `-l idea|thought`
   - Query state: `bd ready --json` or `bd list --status open --json`
   - Log to diary: Reference beads item ID (e.g., "Started work on ac-8jj")
4. **If MARKDOWN:**
   - Use `## Tasks` section in entity file
   - Or append inline tasks to journal with `#task` tag

## Prioritization Adjustments

For beads-managed projects, adjust priority scores:

- Has in-progress tasks: +3 (active work happening)
- Has ready tasks: +2 (work available to start)
- Recent completions (last 24h): +2 (momentum building)
- Many blocked tasks: +2 (needs attention to unblock)

See [behavior/prioritization.md](../behavior/prioritization.md) for base prioritization algorithm.

## Diary Logging

When referencing beads tasks in diary entries, include task IDs:

**Good examples:**
- `- 14:30: Started work on ac-8jj (implement auth module)`
- `- 16:45: Completed ac-7d0 - all tests passing`
- `- 09:15: Created new task ac-9kl for refactoring`

**Why include IDs:**
- Enables cross-referencing between diary and beads
- User can look up the task later
- Creates audit trail
