# Entity Formats

**Unified structure for all entity types (Goals, Projects, Interests):**

```markdown
---
type: goal|project|interest
status: active|paused|done|archived
created-at: YYYY-MM-DD
updated-at: YYYY-MM-DD
location: # optional for projects
---

# Status
Current state narrative. What's happening now.

# Tasks
- [ ] (optional) Task to do
- [x] (optional) Completed task

**Projects (non-beads):** Default the Tasks section to the TaskNotes view:

```markdown
# Tasks
![[tasks-default.base#Project]]
```

**CRITICAL - Projects with beads:** If project has `location` field AND `.beads` directory exists in that location, tasks live in beads ONLY. Omit this section and use beads commands instead.

# Blockers
- List obstacles (when applicable)

# Notes
Freeform observations, learnings, thoughts.

# Resources
Links, materials, references (when applicable).

# Related
Links to other entities (when applicable).

# Log
- [[YYYY-MM-DD]] HH:MM: What changed (newest first)
```

**Section rules:**
- No separate title header needed (title is the filename / frontmatter)
- Use `#` section headers inside entity files
- `# Status` - Required, first section after frontmatter
- `# Tasks` - Optional, skip for beads-managed projects
- `# Log` - Recommended, always last section when present
- Other sections - Optional, include when relevant
- Order - Always maintain the same order when sections are present

**Entity-specific notes:**

**Goals:** Fleeting/aspirational - "learn X", "become Y", "try to improve in Z"
- Can have `done` status when achieved
- Tasks track progress toward the goal

**Projects:** Concrete things to build - "build X app", "create Y system", "ship Z feature"
- Can have `location` field pointing to project directory
- If `location` + `.beads` exists → use beads for all task tracking
- If not beads-managed → use TaskNotes via `![[tasks-default.base#Project]]` in `# Tasks`
- Can have `done` status when shipped/completed

**Interests:** Domains of curiosity and ongoing knowledge accumulation
- No `done` status (open-ended by nature)
- Usually don't need a `# Tasks` section (knowledge accumulation, not deliverables)
- Focus on `# Notes` and `# Resources`

## Ideas

**Nature:** Actionable seeds that could become Goals, Projects, or Interests

**File:** Single append-only file at `Coach/Ideas.md`

**Format:** One line per idea, date-descending (newest at top)
```markdown
- [[YYYY-MM-DD]]: Brief description of actionable seed
- [[YYYY-MM-DD]]: Another idea
```

**Promotion:** When an idea grows, create a Goal/Project/Interest file. Original entry stays in Ideas.md as historical context.

## Thoughts

**Nature:** Observations, insights, or reflections - anything on your mind

**File:** Single append-only file at `Coach/Thoughts.md`

**Format:** One line per thought, date-descending (newest at top)
```markdown
- [[YYYY-MM-DD]]: Observation or reflection
- [[YYYY-MM-DD]]: Another thought
```

**Difference from Ideas:**
- Ideas: Actionable seeds ("What if I built X?")
- Thoughts: Observations and reflections ("I noticed X", "Feeling Y")
