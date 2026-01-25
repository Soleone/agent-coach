# Project Format

Projects are concrete things to build: "build X app", "create Y system", "ship Z feature"

Located in `{vault}/Coach/Projects/*.md`

## Structure

```markdown
---
status: in-progress  # not-started, in-progress, blocked, completed, paused
created: 2026-01-05
target: 2026-02-15
progress: 20
tags: [project/active]
lastUpdated: 2026-01-11
location: /path/to/project/directory  # If set, coach uses bd for task tracking here
---

# Agent Coach

## Milestones
- [x] Define skill structure (2026-01-08)
- [ ] Implement memory system (2026-01-15)
- [ ] Ship v1 (2026-02-15)

## Current Status
Building out the coaching skill with proactive memory.

**Blockers:**
- Need more daily notes to test pattern detection

## Next Actions
- [ ] Write prioritization algorithm
- [ ] Test with real journal entries
```

## Updates

- Same as goals: update frontmatter, milestones, blockers, next actions
