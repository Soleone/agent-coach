# Entity Lifecycle Procedures

**CRITICAL:** The coach's primary job is to capture structured data by detecting and creating entities FIRST, then routing diary entries to the appropriate location.

**The goal is NOT just full-text journaling - it's capturing structured, queryable, linkable data.**

## Entity Type Classification

Listen for these patterns to determine entity type:

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

## Create

**CRITICAL:** Always check for existing entities before creating new ones to prevent duplicates.

1. **Detect** entity type from user's statement
2. **Check for existing entities:** Use Entity Matching algorithm (see above)
   - List files in target directory (`Coach/Goals/`, `Coach/Projects/`, or `Coach/Interests/`)
   - Normalize user mention and existing filenames
   - Compare for matches
3. **If match found:** Update existing entity instead (see Update section)
4. **If no match:** Create new entity
   - **For Goals/Projects/Interests:** Create file with proper frontmatter and structure
   - **For Projects specifically:** Auto-discover and populate location field
     - **When to attempt discovery (only if location field is unset):**
       - At initial project entity creation
       - When user mentions code creation in updates (e.g., "started coding the auth module")
       - When organically inferred that code exists (e.g., actively working on project setup in session)
     - **Discovery process:**
       - Read `{vault}/Coach/State.md` to get `project-roots` value (comma-separated list)
       - If set, extract key terms from project name (e.g., "agent coach project" → ["agent", "coach", "project"])
       - Scan each root directory (two levels deep) for matches:
         - Level 1: `{root}/*` - list all directories
         - Level 2: `{root}/*/*` - list all subdirectories one level deep
       - Match using flexible patterns:
         - Direct variations: `agent-coach`, `agent_coach`, `agentcoach`, `coach`, `agent-coach-project`
         - Pattern matching: directories containing key terms (case-insensitive)
       - **If single match:** Set `location: ~/path/to/directory` in frontmatter (prefer `~` for home paths)
       - **If multiple matches:** Ask user which one, or use best guess based on similarity
       - **If not found:** Leave `location` empty (will retry on next relevant update)
       - This enables immediate beads integration if `.beads` exists in that location
   - **For Ideas/Thoughts:** Prepend to respective file with `[[YYYY-MM-DD]]: description`
5. **Route diary entry:** Use smart logging to entity log or journal (see [diary-routing.md](diary-routing.md))

See [schema/entities.md](../schema/entities.md) for entity file formats.

## Update

1. **Edit existing file:** Update frontmatter `updated-at`, modify content
2. **Write to entity's `# Log` via `skills/coach/scripts/log-manager.mjs`:** Add entry with format `- [[YYYY-MM-DD]] HH:MM: entry text` (chronological, oldest first)
3. **For Goals/Projects:** Update status, progress, milestones, blockers, next actions as needed
4. **For Interests:** Add notes, resources, related links as needed
5. **Optional journal reference** if chronologically significant: write to journal `# Coach` via log-manager with `- HH:MM: Updated [[Coach/EntityType/Title]] - [brief summary]`

**Smart routing examples:**
- "Made progress on Rust project" → Entity log only (routine update)
- "Major breakthrough on Rust ownership" → Entity log (detailed) + Journal (brief reference)
- "Decided to pivot entire approach" → Entity log (decision context) + Journal (timeline marker)

## Promote

When Ideas grow into Goals/Projects/Interests:
1. Create new file in appropriate directory
2. Note in diary: `- HH:MM: Promoted idea about X to [[Coach/Goals/X]]`
3. Original idea stays in Ideas.md as historical context

## Worked Examples

### Example 1: Entity Matching (Prevent Duplicates)

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
3. Write to `# Log` via log-manager: `- [[YYYY-MM-DD]] 15:30: Played today - really fun game`
4. No journal entry needed (routine update)

**What would have happened without matching:**
- ❌ Created duplicate: `Coach/Interests/arc-raiders.md`
- ❌ Two separate files for same entity
- ❌ Context fragmentation

### Example 2: Multi-Entity Detection

**User:** "I want to learn Rust and build a CLI tool with it"

**Detects:**
- Goal: "Learn Rust"
- Project: "Build CLI tool with Rust"

**Actions:**
1. Create `Coach/Goals/Learn Rust.md` with milestones: Complete basics, Build CLI tool, Understand ownership
2. Create `Coach/Projects/Rust CLI Tool.md` with milestone: Design requirements, Implement, Test, Publish
3. Diary: `- HH:MM: Created [[Coach/Goals/Learn Rust]] and [[Coach/Projects/Rust CLI Tool]] - learning systems programming`

### Example 3: Three-Way Classification

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

### Example 4: Update vs Create (Smart Logging)

**User:** "I finished chapter 4 of the Rust book and finally understand ownership!"

**Detects:** Update to existing Goal (not new entity)

**Actions:**
1. Edit `Coach/Goals/Learn Rust.md`:
   - Update frontmatter: `updated-at: YYYY-MM-DD`
   - Mark milestone complete in `# Tasks` if applicable
   - Write to `# Log` via log-manager: `- [[YYYY-MM-DD]] 14:30: Completed Chapter 4 - breakthrough on ownership concept, finally clicked after working through examples`
2. Journal reference (optional, since this is significant): `- 14:30: Breakthrough on [[Coach/Goals/Learn Rust]] - ownership finally clicked`

**Note:** Routine progress updates only go to entity log. Breakthroughs/milestones can optionally get journal references.

### Example 5: Blocker Detection (Smart Logging)

**User:** "I'm stuck on my Rust project. Maybe I should try a simpler example first."

**Detects:**
- Blocker on existing Project
- Idea: "Try simpler example"

**Actions:**
1. Edit `Coach/Projects/Rust CLI Tool.md`:
   - Update frontmatter: `updated-at: YYYY-MM-DD`
   - Add to `# Blockers` section: "Too complex for current skill level"
   - Write to `# Log` via log-manager: `- [[YYYY-MM-DD]] 16:20: Hit blocker - project too complex for current level, will try simpler example first to build fundamentals`
2. Prepend to `Coach/Ideas.md`: `- [[YYYY-MM-DD]]: Try simpler Rust example before CLI tool`
3. Journal: No entry needed (entity log captures context, not chronologically significant)
