# Coach

Proactive AI coaching that analyzes your goals and notes to suggest contextual actions.

## Use

1. Add goals to `your-vault/Coach/Goals/`
2. Journal in `your-vault/Daily Notes/` as `YYYY-MM-DD.md`
3. Run `/coach` in claude, opencode or your preferred agent harness

## Installation

### Marketplace

TODO

## Manual

Copy `skills/` and `commands/` to your AI assistant:

| Assistant | Path |
|-----------|------|
| Claude Code | `~/.claude/` |
| OpenCode | `~/.opencode/` |

## Goal Format

```markdown
---
status: in-progress
created: 2026-01-12
target: 2026-02-01
progress: 10
tags: [goal/active]
lastUpdated: 2026-01-12
---

# Goal: Example Goal

## Milestones
- [ ] First milestone
- [ ] Second milestone

## Current Status
**Last updated:** 2026-01-12
Just getting started!

## Next Actions
- [ ] Define clear milestones
- [ ] Break down into smaller tasks
```

## Daily Notes

```markdown
# 2026-01-12

## Work
- Fixed auth bug

## Learning
- Rust generics #goal/learn-rust

## Ideas
- Extract auth into separate service?
```
