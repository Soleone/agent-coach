# Diary Routing Procedures

**Smart routing based on context:** Route diary entries to entity logs or journal based on the type of entry.

## Location Decision Tree

### Entity-Specific Entries

**Append to entity file's `## Log` section:**
- Updates about existing Goals, Projects, or Interests
- Progress, breakthroughs, blockers related to specific entities
- Format: `- [[YYYY-MM-DD]] HH:MM: entry text` (newest first)
- Example: User says "I finished chapter 4 of the Rust book" → append to `Coach/Goals/Learn Rust.md`

### General/Meta Entries

**Append to journal's `## Coach` section:**
- Daily journal page: `{vault}/{journals}/YYYY-MM-DD.md`
- Entries not tied to specific entities
- Cross-cutting thoughts, decisions, or observations
- Format: `- HH:MM: entry text`

### Dual Logging

**Both entity log + journal reference:**
- When entity update is also chronologically significant
- Entity log: Full detailed entry
- Journal: Brief reference with entity link
- Example: Major milestone completion, pivot decisions

## When to Capture

**Always capture diary entries for:**
- Significant decisions made
- Progress milestones reached
- Insights or breakthroughs
- Changes in direction or priorities
- Blockers identified or resolved
- Goals/Projects created, completed, or abandoned
- Key learnings or realizations
- Philosophical thoughts or perspectives
- Meaningful experiences

**Don't capture:**
- Generic summaries ("had a coaching session")
- Routine check-ins without notable outcomes
- Repetitive information already logged

## Entity Context Detection (Smart Routing)

**When user mentions existing entities, route diary entries to entity logs:**

1. **Explicit references:**
   - Direct mentions: "my Rust project", "the meditation goal", "learning TypeScript"
   - Match against existing entity titles using normalized comparison (see [entity-lifecycle.md](entity-lifecycle.md) for matching algorithm)

2. **Implicit references:**
   - Pronouns with context: "I'm stuck on it" (after discussing a project)
   - Topic continuation: "Made more progress" (continuing previous topic)
   - Keywords: Technical terms, project names, domain vocabulary

3. **Ambiguity handling:**
   - **Multiple matches:** Ask which entity they mean, or use most recently discussed
   - **No match:** This is likely a new entity (create) or general entry (journal)
   - **General topics:** Diary entry goes to journal's `## Coach` section

**Decision tree:**
- Known entity + routine update → Entity `## Log` only
- Known entity + significant milestone → Entity `## Log` + Journal reference
- New entity mention → Check for existing entities FIRST, then create if no match
- General reflection/thought → Journal `## Coach` section

## Date Detection for Past Events

When users mention events from the past, write those diary entries to the **correct historical journal page**, NOT today's page.

**Common date references to detect:**
- **Relative:** "yesterday", "last Monday", "last week", "3 days ago", "2 weeks ago"
- **Absolute:** "on January 10th", "January 10", "2026-01-10", "Jan 10"
- **Contextual:** "this morning" (if it's now evening), "earlier today"

### How to Calculate the Date

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

### Example Workflows

- User: "Yesterday I met with the team and decided to pivot"
  1. Detect "Yesterday" → run `date -d "yesterday" +"%Y-%m-%d"` → "2026-01-23"
  2. Write to `{vault}/{journals}/2026-01-23.md` under `## Coach`
  3. Entry: `- 14:30: Met with team and decided to pivot project`

- User: "Last Monday I started learning Rust"
  1. Detect "Last Monday" → run `date -d "last Monday" +"%Y-%m-%d"` → "2026-01-20"
  2. Write to `{vault}/{journals}/2026-01-20.md` under `## Coach`
  3. Entry: `- 09:00: Started learning Rust`

- User: "On January 10th I had a breakthrough"
  1. Parse "January 10th" → check if 2026-01-10 is in future → if yes, use 2025-01-10
  2. Write to `{vault}/{journals}/2025-01-10.md` or `{vault}/{journals}/2026-01-10.md`
  3. Entry: `- 15:00: Had a breakthrough`

**CRITICAL:** Always calculate and use the correct historical date for the journal file path.

## Routing Examples

### Example 1: Entity-specific (route to entity log)

- User: "Made progress on the CLI tool - got authentication working"
- Action: Append to `Coach/Projects/CLI Tool.md` `## Log` section
- No journal entry needed (routine project update)

### Example 2: Significant milestone (dual logging)

- User: "Shipped the CLI tool to production!"
- Action 1: Append to `Coach/Projects/CLI Tool.md` `## Log`: `- [[YYYY-MM-DD]] 18:00: Shipped to production - first v1.0 release after 3 months work`
- Action 2: Journal reference: `- 18:00: Shipped [[Coach/Projects/CLI Tool]] to production - first public release`

### Example 3: General reflection (journal only)

- User: "I've been thinking about work-life balance lately"
- Action: Append to journal's `## Coach`: `- 14:30: Reflecting on work-life balance - need to set better boundaries`

### Example 4: Multiple entities (route to each)

- User: "Realized my Rust learning goal will help with the CLI project"
- Action 1: Append to `Coach/Goals/Learn Rust.md` `## Log`
- Action 2: Append to `Coach/Projects/CLI Tool.md` `## Log`
- Action 3: Optional journal reference linking both
