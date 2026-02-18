# Diary Routing Procedures

**Smart routing based on context:** Route diary entries to entity logs or journal based on the type of entry.

## Location Decision Tree

### Entity-Specific Entries

**Write to entity file's `# Log` section via `skills/coach/scripts/log-manager.mjs`:**
- Updates about existing Goals, Projects, or Interests
- Progress, breakthroughs, blockers related to specific entities
- Format: `- [[YYYY-MM-DD]] HH:MM: entry text` (chronological, oldest first)
- Example: User says "I finished chapter 4 of the Rust book" → write to `Coach/Goals/Learn Rust.md` `# Log` via log-manager

### General/Meta Entries

**Write to journal's `# Coach` section via `skills/coach/scripts/log-manager.mjs`:**
- Daily journal page: `{vault}/{journals}/YYYY-MM-DD.md`
- Entries not tied to specific entities
- Cross-cutting thoughts, decisions, or observations
- Format: `- HH:MM: entry text`
- Ordering: chronological (oldest first), enforced by log-manager

### Dual Logging

**Both entity log + journal reference:**
- When entity update is also chronologically significant
- Entity log: Full detailed entry
- Journal: Brief reference with entity link
- Example: Major milestone completion, pivot decisions

## Log Writing Mechanism (Deterministic)

For all timestamped timeline/log sections, use `skills/coach/scripts/log-manager.mjs` instead of manual append/prepend.

**Applies to:**
- Journal timeline: `# Coach`
- Entity timelines: `# Log`

**Does not apply to append-only knowledge files:**
- `Coach/Ideas.md`
- `Coach/Thoughts.md`

**Command patterns:**
```bash
# Journal timeline
node skills/coach/scripts/log-manager.mjs \
  --file {vault}/{journals}/YYYY-MM-DD.md \
  --section "# Coach" \
  --entry "HH:MM: entry text" \
  --apply

# Entity timeline
node skills/coach/scripts/log-manager.mjs \
  --file {vault}/Coach/Projects/Project.md \
  --section "# Log" \
  --entry "[[YYYY-MM-DD]] HH:MM: entry text" \
  --apply
```

This guarantees merge safety, dedupe behavior, and oldest-first ordering.

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
   - **General topics:** Diary entry goes to journal's `# Coach` section

**Decision tree:**
- Known entity + routine update → Entity `# Log` only
- Known entity + significant milestone → Entity `# Log` + Journal reference
- New entity mention → Check for existing entities FIRST, then create if no match
- General reflection/thought → Journal `# Coach` section

## Temporal Event Routing (Past, Present, Future)

When users mention events anchored to time, route each event to the correct journal date and write it as a **separate timeline entry**.

**Critical rule:** Never collapse multiple timed events into one narrative coach line.

- ✅ `- 10:00: Dentist appointment`
- ✅ `- 18:00: Dinner at restaurant X`
- ❌ `- 00:40: User mentioned dentist at 10 and dinner at 6`

### Date + Time Resolution

For each mentioned event, resolve:
1. **Target date** (which journal page)
2. **Event time** (`HH:MM`, 24-hour)
3. **Event description** (concise action/outcome)

Then write one line: `- HH:MM: event text`

### How to Calculate Target Date

1. **Past-relative references:**
   - Yesterday: `date -d "yesterday" +"%Y-%m-%d"`
   - Last Monday: `date -d "last Monday" +"%Y-%m-%d"`
   - N days ago: `date -d "3 days ago" +"%Y-%m-%d"`
   - Last week: `date -d "last week" +"%Y-%m-%d"`

2. **Future-relative references:**
   - Tomorrow: `date -d "tomorrow" +"%Y-%m-%d"`
   - Next Monday: `date -d "next Monday" +"%Y-%m-%d"`
   - In N days: `date -d "in 3 days" +"%Y-%m-%d"`

3. **Absolute dates:** Parse and format to `YYYY-MM-DD`
   - "January 10th" → infer year (current year unless that would be future for a past-tense statement)

4. **No explicit date:** default to today: `date +"%Y-%m-%d"`

**Target file pattern:** `{vault}/{journals}/[CALCULATED-DATE].md`

### Event Time Handling

- If user gives explicit time ("10am", "2:30 pm"), convert to `HH:MM`
- If user gives a rough time ("around 11", "after lunch"), normalize to best available concrete time
- If no time is given, use current time for that entry

### Example Workflows

- User: "Yesterday at 2pm I met with X"
  1. Date → yesterday journal page
  2. Time → `14:00`
  3. Write: `- 14:00: Met with X`

- User: "Dentist tomorrow at 10am and dinner at 6pm"
  1. Date → tomorrow journal page
  2. Create two entries:
     - `- 10:00: Dentist appointment`
     - `- 18:00: Dinner`

- User: "I just finished a call with John"
  1. Date → today
  2. Time → current `date +"%H:%M"` (unless explicit time given)
  3. Write: `- HH:MM: Finished call with John`

**CRITICAL:** Timeline entries can include past and future timestamps on the same day; keep whole-day chronology (oldest first).

## Routing Examples

### Example 1: Entity-specific (route to entity log)

- User: "Made progress on the CLI tool - got authentication working"
- Action: Write to `Coach/Projects/CLI Tool.md` `# Log` via log-manager
- No journal entry needed (routine project update)

### Example 2: Significant milestone (dual logging)

- User: "Shipped the CLI tool to production!"
- Action 1: Write to `Coach/Projects/CLI Tool.md` `# Log` via log-manager: `- [[YYYY-MM-DD]] 18:00: Shipped to production - first v1.0 release after 3 months work`
- Action 2: Journal reference via log-manager: `- 18:00: Shipped [[Coach/Projects/CLI Tool]] to production - first public release`

### Example 3: General reflection (journal only)

- User: "I've been thinking about work-life balance lately"
- Action: Write to journal `# Coach` via log-manager: `- 14:30: Reflecting on work-life balance - need to set better boundaries`

### Example 4: Multiple entities (route to each)

- User: "Realized my Rust learning goal will help with the CLI project"
- Action 1: Write to `Coach/Goals/Learn Rust.md` `# Log` via log-manager
- Action 2: Write to `Coach/Projects/CLI Tool.md` `# Log` via log-manager
- Action 3: Optional journal reference linking both
