# Entity Operations

## Entity Detection and Creation

**CRITICAL:** The coach's primary job is to capture structured data by detecting and creating entities FIRST, then linking them in daily notes.

**The goal is NOT just full-text journaling - it's capturing structured, queryable, linkable data.**

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

### Goals

**Nature:** Fleeting/aspirational - "learn X", "become Y", "try to improve in Z"

**File structure:**
```markdown
---
type: goal
status: active  # active, paused, done, archived
created-at: YYYY-MM-DD
updated-at: YYYY-MM-DD
---

# [Goal Title]

## Milestones
- [ ] First milestone (target date)
- [ ] Second milestone (target date)

## Current Status
Brief description of current state.

**Blockers:**
- List any obstacles

## Next Actions
- [ ] Specific next step
- [ ] Another action
```

### Projects

**Nature:** Concrete things to build - "build X app", "create Y system", "ship Z feature"

**File structure:**
```markdown
---
type: project
status: active  # active, paused, done, archived
location: # optional directory path
created-at: YYYY-MM-DD
updated-at: YYYY-MM-DD
---

# [Project Title]

## Milestones
- [ ] First milestone (target date)
- [ ] Second milestone (target date)

## Current Status
Brief description of current state.

**Blockers:**
- List any obstacles

## Next Actions
- [ ] Specific next step
- [ ] Another action
```

### Interests

**Nature:** Domains of curiosity and ongoing knowledge accumulation

**Characteristics:**
- Open-ended: No specific deliverable or end state
- Knowledge accumulation: Learning, exploring, researching
- May spawn projects: Interests can lead to concrete projects
- No tasks required: Unlike projects, interests don't need actionable tasks

**File structure:**
```markdown
---
type: interest
status: active  # active, paused, archived
created-at: YYYY-MM-DD
updated-at: YYYY-MM-DD
---

# [Interest Title]

Brief description of the domain of interest.

## Notes

- Key learning or insight
- Resource discovered
- Observation or thought

## Resources

- Links to useful content
- Books, videos, websites

## Related

- Links to related entities (Goals, Projects, other Interests)
```

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
1. **Detect** entity type from user's statement
2. **For Goals/Projects/Interests:** Create file with proper frontmatter and structure
3. **For Ideas/Thoughts:** Prepend to respective file with `[[YYYY-MM-DD]]: description`
4. **Link in diary** under `# Coach` header with format: `- HH:MM: Created [[Coach/EntityType/Title]]`

### Update
1. **Edit existing file:** Update frontmatter `updated-at`, modify content
2. **For Goals/Projects:** Update status, progress, milestones, blockers, next actions
3. **For Interests:** Add notes, resources, related links
4. **Link in diary** if noteworthy: `- HH:MM: Updated [[Coach/EntityType/Title]] - [what changed and why]`

### Promote
When Ideas grow into Goals/Projects/Interests:
1. Create new file in appropriate directory
2. Note in diary: `- HH:MM: Promoted idea about X to [[Coach/Goals/X]]`
3. Original idea stays in Ideas.md as historical context

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

### Example 3: Update vs Create

**User:** "I finished chapter 4 of the Rust book and finally understand ownership!"

**Detects:** Update to existing Goal (not new entity)

**Actions:**
1. Edit `Coach/Goals/Learn Rust.md`: Mark milestone complete, update status with breakthrough note
2. Update frontmatter: `updated-at: YYYY-MM-DD`
3. Diary: `- HH:MM: Updated [[Coach/Goals/Learn Rust]] - breakthrough on ownership in Chapter 4, core concept clicked`

### Example 4: Blocker Detection

**User:** "I'm stuck on my Rust project. Maybe I should try a simpler example first."

**Detects:**
- Blocker on existing Project
- Idea: "Try simpler example"

**Actions:**
1. Edit `Coach/Projects/Rust CLI Tool.md`: Add to Blockers section, update Next Actions
2. Prepend to `Coach/Ideas.md`: `- [[YYYY-MM-DD]]: Try simpler Rust example before CLI tool`
3. Diary: `- HH:MM: Updated [[Coach/Projects/Rust CLI Tool]] - too complex for current level, will try simpler example first`
