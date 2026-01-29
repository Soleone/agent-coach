# Diary Entry Format

## Purpose: Enabling Better Coaching

Diary entries serve **two equally important purposes:**

1. **For the user:** Help them remember past actions, decisions, and learnings
   - Memory loss test: Would they be happy to find this if they lost their memory?
   - Future gratitude: Will they be glad this was logged when they review it later?

2. **For you (the coach):** Build context for better coaching
   - Know what to chat about in future sessions
   - Remind them of past items they could pick up or continue pursuing
   - Notice correlations between current moment and past moments
   - Identify patterns in their thinking, behavior, and progress

**Test before writing:**
- "Would this help the user reconstruct their life if they had amnesia?"
- "Does this give me context to coach better next time?"

Write entries as if the user WILL lose their memory AND you will need this context to coach them effectively in the future.

## Location

**Smart routing based on context:**

**Entity-specific entries** (append to entity file's `## Log` section):
- Updates about existing Goals, Projects, or Interests
- Progress, breakthroughs, blockers related to specific entities
- Format: `- [[YYYY-MM-DD]] HH:MM: entry text` (newest first)
- Example: User says "I finished chapter 4 of the Rust book" → append to `Coach/Goals/Learn Rust.md`

**General/meta entries** (append to journal's `## Coach` section):
- Daily journal page: `{vault}/{journals}/YYYY-MM-DD.md`
- Entries not tied to specific entities
- Cross-cutting thoughts, decisions, or observations
- Format: `- HH:MM: entry text`

**Dual logging** (both entity log + journal reference):
- When entity update is also chronologically significant
- Entity log: Full detailed entry
- Journal: Brief reference with entity link
- Example: Major milestone completion, pivot decisions

**For past events:** When users mention events from the past (e.g., "yesterday I met with X", "last Monday I decided Y"), write the entry to the **correct historical date's journal page** or entity log, not today's page.

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

## Routing Decision Examples

**Example 1: Entity-specific (route to entity log)**
- User: "Made progress on the CLI tool - got authentication working"
- Action: Append to `Coach/Projects/CLI Tool.md` `## Log` section
- No journal entry needed (routine project update)

**Example 2: Significant milestone (dual logging)**
- User: "Shipped the CLI tool to production!"
- Action 1: Append to `Coach/Projects/CLI Tool.md` `## Log`: `- [[YYYY-MM-DD]] 18:00: Shipped to production - first v1.0 release after 3 months work`
- Action 2: Journal reference: `- 18:00: Shipped [[Coach/Projects/CLI Tool]] to production - first public release`

**Example 3: General reflection (journal only)**
- User: "I've been thinking about work-life balance lately"
- Action: Append to journal's `## Coach`: `- 14:30: Reflecting on work-life balance - need to set better boundaries`

**Example 4: Multiple entities (route to each)**
- User: "Realized my Rust learning goal will help with the CLI project"
- Action 1: Append to `Coach/Goals/Learn Rust.md` `## Log`
- Action 2: Append to `Coach/Projects/CLI Tool.md` `## Log`
- Action 3: Optional journal reference linking both

## Format

**Structure:** Bullet points with timestamps under the `## Coach` header

**Format:** `- HH:MM: entry text`

**Timestamps:**
- **When user specifies a time:** Use that exact time. E.g., "I woke up at 11:30" → `- 11:30: I woke up`
- **When no time specified:** Generate current time with `date +"%H:%M"`
- **Always use 24-hour format** (00:00 to 23:59, NOT 12-hour with AM/PM)
- **Timezone:** Run `date +"%Z"` for current timezone (e.g., EST, PST)
- **Deterministic:** Use same timestamp for all entries in one interaction
- **Never hardcode examples** - always generate current time or use user's specified time

**Style:** Concise, specific, context-rich

**Mandatory questions to answer:**
- What happened?
- Why does it matter?
- What changed?
- What's the context?

**Validation:** Does this entry pass the memory loss test?

## Examples

### Good Examples

```markdown
## Coach

- 09:30: Decided to pivot Build Personal Website project to use Astro instead of Next.js after discovering better Obsidian integration. This unblocks the publishing workflow.
- 09:45: Breakthrough on [[Coach/Goals/Learn Rust]] - finally understood lifetime annotations by working through Chapter 10 examples. Key insight: lifetimes are about references, not values.
- 11:30: Woke up today - slept in after late night coding session
- 14:15: Created new goal [[Coach/Goals/Master TypeScript Generics]] after struggling with type inference in current project. Target: 2 weeks.
- 16:20: Realized that chasing perfection on side projects has been blocking me from shipping. New approach: "good enough" iterations with 2-week cycles. This shifts my entire project philosophy.
- 21:00: Had conversation about work-life balance. Recognized pattern: I overcommit when anxious about progress. Going to try time-boxing commitments for next month.
- 22:34: Created [[Coach/Goals/Jump Roping]] goal to try to get more fit
```

### Poor Examples

```markdown
## Coach

- Had a good coaching session today
- Discussed various topics
- Made some progress on projects
- Feeling productive
- Talked about goals
- 22:34: Created new goal to start jump roping (missing link to goal file)
```

## Creating the Header

If the `## Coach` header doesn't exist in today's journal page, append it at the bottom:

```markdown
## Coach

- 09:30: [First diary entry]
```

If it already exists, append new entries below existing ones using timestamp format: `- HH:MM: entry text`
