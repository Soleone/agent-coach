# Coach

Proactive AI coaching that analyzes your goals, projects, ideas, and thoughts from your Obsidian vault to provide contextual guidance.

## Use

1. Add goals to `your-vault/Coach/Goals/`
2. Add projects to `your-vault/Coach/Projects/`
3. Journal in `your-vault/Daily Notes/` as `YYYY-MM-DD.md`
4. Tag ideas with `#idea:` and thoughts with `#thought:`
5. Run `/coach:start` in OpenCode or Claude Code

## Features

- **Memory from files** - Your goals, projects, ideas, and thoughts live in Obsidian
- **Prioritization** - Scores entities by staleness, blockers, dates, recency
- **Proactive suggestions** - Identifies what needs attention
- **Updates memory** - Writes progress, captures new thoughts/ideas after each interaction
- **Idea promotion** - Links promoted ideas to their new Goal/Project

## Installation

### OpenCode

```bash
./setup-opencode.sh
```

### Claude Code

```bash
cp -r commands/ skills/ ~/.claude/
```

## Testing

Create a test vault with sample data:

```bash
./create-test-vault.sh
```

This creates `test-vault/` with:
- 2 goals (1 stale, 1 recent)
- 1 project
- 3 days of notes with ideas, thoughts, and tasks

To test:
1. Run `./setup-opencode.sh`
2. Run `/coach:start` in OpenCode
3. The coach should surface the stale goal, blocked items, and pending ideas

## Entities

### Goals

Fleeting/aspirational: "learn X", "become Y", "try to improve in Z"

Located in `Coach/Goals/*.md`

```markdown
---
status: in-progress
created: 2026-01-05
target: 2026-02-01
progress: 35
tags: [goal/active]
lastUpdated: 2026-01-11
---

# Goal: Learn Rust Fundamentals

## Milestones
- [x] Complete basics tutorial
- [ ] Build a CLI tool

## Current Status
Working through lifetimes and generics.

**Blockers:**
- Confused about lifetime syntax

## Next Actions
- [ ] Read chapter on lifetimes
```

### Projects

Concrete things to build: "build X app", "ship Y feature"

Located in `Coach/Projects/*.md` - same format as goals

### Ideas

Actionable insights in Daily Notes:

```markdown
#idea: Learn Rust lifetimes and understand ownership
#idea: Build a personal website
```

When promoted to Goal/Project, the line gets linked:

```markdown
#idea: Learn Rust lifetimes [→ Goal: Learn Rust Fundamentals](Coach/Goals/learn-rust.md)
```

### Thoughts

Non-actionable observations in Daily Notes:

```markdown
#thought: Feeling tired today
#thought: Article about async/await was interesting
```

### Tasks

Inline tasks in Daily Notes:

```markdown
- [ ] Review API docs #task
- [ ] Write tests #task
```

## Vault Structure

```
{your-vault}/
├── Coach/
│   ├── Goals/*.md
│   └── Projects/*.md
└── Daily Notes/
    └── YYYY-MM-DD.md     # Contains #idea, #thought, - [ ] #task items
```
