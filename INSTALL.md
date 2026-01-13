# Installation

## Quick Setup

1. Create required directories in your vault:
   ```
   your-vault/
   ├── Coach/
   │   ├── Goals/
   │   └── Projects/
   └── Daily Notes/
   ```

2. Create your first goal in `Coach/Goals/example.md`

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

Use `YYYY-MM-DD.md` format:
```markdown
# 2026-01-12

## Work
- Fixed auth bug

## Learning
- Rust generics #goal/learn-rust

## Ideas
- Extract auth into separate service?
```

## Using with AI Assistants

Copy the `skills/` folder to your assistant's skills directory:
- Claude Code: `~/.claude/skills/`
- OpenCode: `~/.opencode/skills/`

Then use `/coach`, `/coach-list`, `/coach-config` commands.
