# Workflow Reference

## Entity Detection and Creation

**CRITICAL:** The coach's primary job is to capture structured data by detecting and creating entities FIRST, then linking them in daily notes.

**The goal is NOT just full-text journaling - it's capturing structured, queryable, linkable data.**

**When the user expresses any of these, create the entity file immediately:**

| User Says | Entity Type | Action |
|-----------|-------------|--------|
| "I want to learn X", "become Y", "improve at Z" | **Goal** | Create `Coach/Goals/filename.md` |
| "I'm building X", "shipping Y", "working on Z" | **Project** | Create `Coach/Projects/filename.md` |
| "What if I...", "Maybe I should...", "Idea: X" | **Idea** | Append `#idea:` to today's journal |
| "I think...", "I noticed...", "Feeling..." | **Thought** | Append `#thought:` to today's journal |
| "I need to...", "TODO: X", "reminder to Y" | **Task** | Append `- [ ] X #task` to today's journal |

**Workflow for Goals and Projects:**
1. **Detect** the entity type from user's statement
2. **Create file** in `Coach/Goals/` or `Coach/Projects/` with proper frontmatter and structure (see [goals.md](goals.md) and [projects.md](projects.md))
3. **Link in diary** under `# Coach` header with format: `- HH:MM: Created [[Coach/Goals/Goal Title]]`

**Workflow for Ideas, Thoughts, and Tasks:**
1. **Detect** the entity type from user's statement
2. **Append to journal** in format: `#idea:`, `#thought:`, or `- [ ] #task`
3. **Link in diary** under `# Coach` header with format: `- HH:MM: Captured idea about X`

## Date Detection for Past Events

When users mention events from the past, write those diary entries to the **correct historical journal page**, NOT today's page.

**Common date references to detect:**
- **Relative:** "yesterday", "last Monday", "last week", "3 days ago", "2 weeks ago"
- **Absolute:** "on January 10th", "January 10", "2026-01-10", "Jan 10"
- **Contextual:** "this morning" (if it's now evening), "earlier today"

**How to calculate the date:**

1. **Relative dates using `date` command:**
   - Yesterday: `date -d "yesterday" +"%Y-%m-%d"` (Linux) or `date -v-1d +"%Y-%m-%d"` (macOS)
   - Last Monday: `date -d "last Monday" +"%Y-%m-%d"` (Linux) or calculate day offset
   - N days ago: `date -d "3 days ago" +"%Y-%m-%d"` (Linux) or `date -v-3d +"%Y-%m-%d"`
   - Last week: `date -d "last week" +"%Y-%m-%d"` or `date -v-7d +"%Y-%m-%d"`

2. **Absolute dates:** Parse the date and format to YYYY-MM-DD
   - "January 10th" → determine year (current year, or previous if date would be in future) → "2026-01-10"
   - Use current year unless the resulting date would be in the future (then use previous year)

3. **Default:** If no past date mentioned, use today: `date +"%Y-%m-%d"`

**Target journal file:** `{vault}/{journals}/[CALCULATED-DATE].md`

**Example workflows:**

- User: "Yesterday I met with the team and decided to pivot"
  1. Detect "Yesterday" → run `date -d "yesterday" +"%Y-%m-%d"` → "2026-01-23"
  2. Write to `{vault}/{journals}/2026-01-23.md` under `# Coach`
  3. Entry: `- 14:30: Met with team and decided to pivot project`

- User: "Last Monday I started learning Rust"
  1. Detect "Last Monday" → run `date -d "last Monday" +"%Y-%m-%d"` → "2026-01-20"
  2. Write to `{vault}/{journals}/2026-01-20.md` under `# Coach`
  3. Entry: `- 09:00: Started learning Rust`

- User: "On January 10th I had a breakthrough"
  1. Parse "January 10th" → check if 2026-01-10 is in future → if yes, use 2025-01-10
  2. Write to `{vault}/{journals}/2025-01-10.md` or `{vault}/{journals}/2026-01-10.md`
  3. Entry: `- 15:00: Had a breakthrough`

**CRITICAL:** Always calculate and use the correct historical date for the journal file path.

## Timestamp Generation

- **ALWAYS use 24-hour format** (00:00 to 23:59, NOT 12-hour with AM/PM)
- **When user specifies a time:** Use that exact time. E.g., "I woke up at 11:30" → `- 11:30: I woke up`
- **When no time specified:** Generate current time with `date +"%H:%M"`
- **Timezone:** Run `date +"%Z"` for current timezone (e.g., EST, PST)
- **Deterministic:** Use same timestamp for all entries in one interaction
- **Never hardcode examples** like `14:30` - always generate current time or use user's specified time

## Diary Entry Patterns

**Daily notes file:**
- **Path:** `{vault}/{journals}/YYYY-MM-DD.md` (e.g., `{vault}/{journals}/2026-01-17.md`)
- **Generate date:** Use the calculated date from "Date detection" section. For current events, use `date +"%Y-%m-%d"` for today's filename.
- **Timezone:** Run `date +"%Z"` for timezone
- **Create if missing:** If the target journal doesn't exist, create it
- **Append location:** Always under `# Coach` header at bottom of file

**Good diary entries:**
- `09:30: Decided to pivot Project X to focus on Y after realizing Z blocker can't be resolved`
- `14:15: Made breakthrough on [[Coach/Goals/Learn Rust]] - finally understood ownership after working through Chapter 4`
- `22:47: Deprioritized Project Y until Q2 - blocked on external dependency`
- `11:30: I woke up today at 11:30 - slept in after late night coding session`

**Poor diary entries:**
- "Had a good coaching session"
- "Discussed various topics"
- "Made some progress"

See [diary.md](diary.md) for detailed examples.

## Promoting Ideas

When an Idea becomes a Goal or Project:
1. Create the new file in `{vault}/Coach/Goals/` or `{vault}/Coach/Projects/`
2. Edit the original `#idea` line in the journal:

```markdown
#idea: Learn Rust lifetimes and understand ownership [→ [[Coach/Goals/Learn Rust]] goal created]
```
