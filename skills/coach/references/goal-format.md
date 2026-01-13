# Goal File Format

Goals are markdown files with YAML frontmatter located in `{vault}/Coach/Goals/*.md`

## Structure

```markdown
---
status: in-progress  # not-started, in-progress, blocked, completed, paused
created: 2026-01-05
target: 2026-02-01
progress: 35  # 0-100
tags: [goal/active, area/learning]
lastUpdated: 2026-01-11
---

# Goal: Learn Rust Fundamentals

## Milestones
- [x] Complete basics tutorial (2026-01-08)
- [ ] Build a CLI tool (2026-01-20)
- [ ] Contribute to OSS project (2026-02-01)

## Current Status
**Last updated:** 2026-01-11
Working through lifetimes and generics. Making good progress!

**Blockers:**
- Confused about lifetime syntax in nested structs

## Next Actions
- [ ] Read chapter on lifetimes
- [ ] Build example with multiple lifetimes
- [ ] Ask on Reddit about best practices
```

## Updating Goals

Use Write/Edit tools to:
- Update `progress`, `status`, `target`, or `lastUpdated` in frontmatter
- Add/remove items in `**Blockers:**` section
- Add/remove items in `## Next Actions` section
- Mark milestones complete with `[x]`
- Update `## Current Status` notes
