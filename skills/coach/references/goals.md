# Goal Format

Goals are fleeting/aspirational: "learn X", "become Y", "try to improve in Z"

Located in `{vault}/Coach/Goals/*.md`

## Structure

```markdown
---
status: in-progress  # not-started, in-progress, blocked, completed, paused
created: 2026-01-05
target: 2026-02-01
progress: 35  # 0-100
tags: [goal/active]
lastUpdated: 2026-01-11
---

# Learn Rust Fundamentals

## Milestones
- [x] Complete basics tutorial (2026-01-08)
- [ ] Build a CLI tool (2026-01-20)
- [ ] Contribute to OSS project (2026-02-01)

## Current Status
Working through lifetimes and generics.

**Blockers:**
- Confused about lifetime syntax in nested structs

## Next Actions
- [ ] Read chapter on lifetimes
- [ ] Build example with multiple lifetimes
```

## Updates

- Update `progress`, `status`, `target`, `lastUpdated` in frontmatter
- Add/remove blockers in **Blockers:** section
- Add/remove items in ## Next Actions
- Mark milestones with `[x]`
