# Entity Operations

## Entity Detection and Creation

**CRITICAL:** The coach's primary job is to capture structured data by detecting and creating entities FIRST, then routing diary entries to the appropriate location.

**The goal is NOT just full-text journaling - it's capturing structured, queryable, linkable data.**

## Entity Matching (Prevent Duplicates)

**CRITICAL:** Before creating a new entity, always check for existing entities with case-insensitive, normalized matching.

### Matching Algorithm

When user mentions a potential entity (e.g., "playing arc raiders", "learning typescript"):

1. **Determine entity type** (Goal, Project, or Interest) from context
2. **Read existing files** in the appropriate directory:
   ```bash
   ls -1 {vault}/Coach/Goals/ 2>/dev/null || true
   ls -1 {vault}/Coach/Projects/ 2>/dev/null || true
   ls -1 {vault}/Coach/Interests/ 2>/dev/null || true
   ```
3. **Normalize for comparison:**
   - User mention: `"playing arc raiders"` → normalize to `"arcraiders"`
   - Existing files: `"ARC Raiders.md"` → normalize to `"arcraiders"`
   - Normalization: lowercase, remove spaces/hyphens/underscores/punctuation, strip `.md`

4. **Compare normalized strings:**
   - Exact match → Use existing file
   - Multiple matches → Ask user which they mean (show list)
   - No match → Safe to create new entity

### Normalization Examples

| User Says | Normalized | Existing File | Normalized | Match? |
|-----------|------------|---------------|------------|--------|
| "arc raiders" | `arcraiders` | `ARC Raiders.md` | `arcraiders` | ✓ YES |
| "type script" | `typescript` | `TypeScript.md` | `typescript` | ✓ YES |
| "rust-cli-tool" | `rsclitool` | `Rust CLI Tool.md` | `rustclitool` | ✗ NO (different) |
| "meditation" | `meditation` | `Daily Meditation.md` | `dailymeditation` | ✗ NO (partial) |

### Handling Ambiguity

**Multiple matches found:**
```markdown
I found multiple existing entities that might match:
1. ARC Raiders.md (Interest)
2. Arc Raiders Progress.md (Project)

Which one did you mean, or should I create a new entity?
```

**Partial matches (optional warning):**
```markdown
I didn't find an exact match, but these existing entities are similar:
- Daily Meditation.md

Did you mean one of these, or should I create "Meditation.md"?
```

### Implementation Workflow

**Before creating a new Goal/Project/Interest:**
1. List existing files in target directory
2. Normalize user's mention and all filenames
3. Check for exact normalized match
4. If match found: Use that file, update its log
5. If no match: Create new file with proper casing (preserve user's casing or ask)

## Entity Context Detection (Smart Routing)

**When user mentions existing entities, route diary entries to entity logs:**

1. **Explicit references:**
   - Direct mentions: "my Rust project", "the meditation goal", "learning TypeScript"
   - Match against existing entity titles using normalized comparison (see Entity Matching above)

2. **Implicit references:**
   - Pronouns with context: "I'm stuck on it" (after discussing a project)
   - Topic continuation: "Made more progress" (continuing previous topic)
   - Keywords: Technical terms, project names, domain vocabulary

3. **Ambiguity handling:**
   - **Multiple matches:** Ask which entity they mean, or use most recently discussed
   - **No match:** This is likely a new entity (create) or general entry (journal)
   - **General topics:** Diary entry goes to journal's `# Coach` section

**Decision tree:**
- Known entity + routine update → Entity `## Log` only
- Known entity + significant milestone → Entity `## Log` + Journal reference
- New entity mention → Check for existing entities FIRST, then create if no match
- General reflection/thought → Journal `# Coach` section

## Entity Type Classification

| User Says | Entity Type | Location |
|-----------|-------------|----------|
| "I want to learn X", "become Y", "improve at Z" | **Goal** | `Coach/Goals/*.md` |
| "I'm building X", "shipping Y", "working on Z" | **Project** | `Coach/Projects/*.md` |
| "I'm curious about X", "learning about Y", "getting into Z" | **Interest** | `Coach/Interests/*.md` |
| "What if I...", "Maybe I should...", "Idea: X" | **Idea** | Prepend to `Coach/Ideas.md` |
| "I think...", "I noticed...", "Feeling..." | **Thought** | Prepend to `Coach/Thoughts.md` |
| "I need to...", "TODO: X", "reminder to Y" | **Task** | Append to journal with `#task` |
| "I finished...", "Made progress on..." | **Update** | Edit existing entity file |
| "I'm stuck on...", "Blocked by..." | **Blocker** | Add to entity's Blockers section |

## Entity Formats

**Unified structure for all entity types:**

```markdown
---
type: goal|project|interest
status: active|paused|done|archived
created-at: YYYY-MM-DD
updated-at: YYYY-MM-DD
location: # optional for projects
---

# [Title]

## Status
Current state narrative. What's happening now.

## Tasks
- [ ] Task to do
- [x] Completed task

**CRITICAL - Projects with beads:** If project has `location` field AND `.beads` directory exists in that location, tasks live in beads ONLY. Omit this section and use beads commands instead.

## Blockers
- List obstacles (when applicable)

## Notes
Freeform observations, learnings, thoughts.

## Resources
Links, materials, references (when applicable).

## Related
Links to other entities (when applicable).

## Log
- [[YYYY-MM-DD]] HH:MM: What changed (newest first)
```

**Section rules:**
- `## Status` - Required, always first section after title
- `## Tasks` - Optional, skip for beads-managed projects
- `## Log` - Recommended, always last section when present
- Other sections - Optional, include when relevant
- Order - Always maintain the same order when sections are present

**Entity-specific notes:**

**Goals:** Fleeting/aspirational - "learn X", "become Y", "try to improve in Z"
- Can have `done` status when achieved
- Tasks track progress toward the goal

**Projects:** Concrete things to build - "build X app", "create Y system", "ship Z feature"
- Can have `location` field pointing to project directory
- If `location` + `.beads` exists → use beads for all task tracking
- Can have `done` status when shipped/completed

**Interests:** Domains of curiosity and ongoing knowledge accumulation
- No `done` status (open-ended by nature)
- Usually don't need `## Tasks` section (knowledge accumulation, not deliverables)
- Focus on `## Notes` and `## Resources`

### Ideas

**Nature:** Actionable seeds that could become Goals, Projects, or Interests

**File:** Single append-only file at `Coach/Ideas.md`

**Format:** One line per idea, date-descending (newest at top)
```markdown
# Ideas

- [[YYYY-MM-DD]]: Brief description of actionable seed
- [[YYYY-MM-DD]]: Another idea
```

**Promotion:** When an idea grows, create a Goal/Project/Interest file. Original entry stays in Ideas.md as historical context.

### Thoughts

**Nature:** Observations, insights, or reflections - anything on your mind

**File:** Single append-only file at `Coach/Thoughts.md`

**Format:** One line per thought, date-descending (newest at top)
```markdown
# Thoughts

- [[YYYY-MM-DD]]: Observation or reflection
- [[YYYY-MM-DD]]: Another thought
```

**Difference from Ideas:**
- Ideas: Actionable seeds ("What if I built X?")
- Thoughts: Observations and reflections ("I noticed X", "Feeling Y")

## Entity Lifecycle

### Create

**CRITICAL:** Always check for existing entities before creating new ones to prevent duplicates.

1. **Detect** entity type from user's statement
2. **Check for existing entities:** Use Entity Matching algorithm (see above)
   - List files in target directory (`Coach/Goals/`, `Coach/Projects/`, or `Coach/Interests/`)
   - Normalize user mention and existing filenames
   - Compare for matches
3. **If match found:** Update existing entity instead (see Update section)
4. **If no match:** Create new entity
   - **For Goals/Projects/Interests:** Create file with proper frontmatter and structure
   - **For Ideas/Thoughts:** Prepend to respective file with `[[YYYY-MM-DD]]: description`
5. **Route diary entry:** Use smart logging to entity log or journal (see Smart Routing)

### Update
1. **Edit existing file:** Update frontmatter `updated-at`, modify content
2. **Append to entity's `## Log` section:** Add entry with format `- [[YYYY-MM-DD]] HH:MM: entry text` (newest first)
3. **For Goals/Projects:** Update status, progress, milestones, blockers, next actions as needed
4. **For Interests:** Add notes, resources, related links as needed
5. **Optional journal reference** if chronologically significant: `- HH:MM: Updated [[Coach/EntityType/Title]] - [brief summary]`

**Smart routing examples:**
- "Made progress on Rust project" → Entity log only (routine update)
- "Major breakthrough on Rust ownership" → Entity log (detailed) + Journal (brief reference)
- "Decided to pivot entire approach" → Entity log (decision context) + Journal (timeline marker)

### Promote
When Ideas grow into Goals/Projects/Interests:
1. Create new file in appropriate directory
2. Note in diary: `- HH:MM: Promoted idea about X to [[Coach/Goals/X]]`
3. Original idea stays in Ideas.md as historical context

## Compact Examples

### Example 0: Entity Matching (Prevent Duplicates)

**Scenario:** User casually mentions an interest, but uses different casing

**Existing entities:**
- `Coach/Interests/ARC Raiders.md`
- `Coach/Interests/TypeScript.md`

**User:** "I was playing arc raiders today, really fun game"

**Entity matching process:**
1. Detect potential Interest: "arc raiders"
2. List files: `ls -1 ~/vault/Coach/Interests/`
3. Normalize mention: `"arc raiders"` → `"arcraiders"`
4. Normalize existing: `"ARC Raiders.md"` → `"arcraiders"`
5. Match found! Use existing file

**Actions:**
1. Read `Coach/Interests/ARC Raiders.md` (matched entity)
2. Update frontmatter: `updated-at: YYYY-MM-DD`
3. Append to `## Log`: `- [[YYYY-MM-DD]] 15:30: Played today - really fun game`
4. No journal entry needed (routine update)

**What would have happened without matching:**
- ❌ Created duplicate: `Coach/Interests/arc-raiders.md`
- ❌ Two separate files for same entity
- ❌ Context fragmentation

## Compact Examples

### Example 1: Multi-Entity Detection

**User:** "I want to learn Rust and build a CLI tool with it"

**Detects:**
- Goal: "Learn Rust"
- Project: "Build CLI tool with Rust"

**Actions:**
1. Create `Coach/Goals/Learn Rust.md` with milestones: Complete basics, Build CLI tool, Understand ownership
2. Create `Coach/Projects/Rust CLI Tool.md` with milestone: Design requirements, Implement, Test, Publish
3. Diary: `- HH:MM: Created [[Coach/Goals/Learn Rust]] and [[Coach/Projects/Rust CLI Tool]] - learning systems programming`

### Example 2: Three-Way Classification

**User:** "I've been thinking about meditation. Maybe 10 minutes daily? Also had an idea for a habit tracker app. I noticed I'm more productive in mornings."

**Detects:**
- Goal: "Daily meditation practice" (specific target behavior)
- Idea: "Build habit tracker app" (actionable seed)
- Thought: "More productive in mornings" (observation)

**Actions:**
1. Create `Coach/Goals/Daily Meditation Practice.md` with 7/30/90 day milestones
2. Prepend to `Coach/Ideas.md`: `- [[YYYY-MM-DD]]: Build habit tracker app`
3. Prepend to `Coach/Thoughts.md`: `- [[YYYY-MM-DD]]: More productive in mornings - schedule important work then`
4. Diary: Three entries capturing each entity creation

### Example 3: Update vs Create (Smart Logging)

**User:** "I finished chapter 4 of the Rust book and finally understand ownership!"

**Detects:** Update to existing Goal (not new entity)

**Actions:**
1. Edit `Coach/Goals/Learn Rust.md`:
   - Update frontmatter: `updated-at: YYYY-MM-DD`
   - Mark milestone complete in `## Tasks` if applicable
   - Append to `## Log`: `- [[YYYY-MM-DD]] 14:30: Completed Chapter 4 - breakthrough on ownership concept, finally clicked after working through examples`
2. Journal reference (optional, since this is significant): `- 14:30: Breakthrough on [[Coach/Goals/Learn Rust]] - ownership finally clicked`

**Note:** Routine progress updates only go to entity log. Breakthroughs/milestones can optionally get journal references.

### Example 4: Blocker Detection (Smart Logging)

**User:** "I'm stuck on my Rust project. Maybe I should try a simpler example first."

**Detects:**
- Blocker on existing Project
- Idea: "Try simpler example"

**Actions:**
1. Edit `Coach/Projects/Rust CLI Tool.md`:
   - Update frontmatter: `updated-at: YYYY-MM-DD`
   - Add to `## Blockers` section: "Too complex for current skill level"
   - Append to `## Log`: `- [[YYYY-MM-DD]] 16:20: Hit blocker - project too complex for current level, will try simpler example first to build fundamentals`
2. Prepend to `Coach/Ideas.md`: `- [[YYYY-MM-DD]]: Try simpler Rust example before CLI tool`
3. Journal: No entry needed (entity log captures context, not chronologically significant)
