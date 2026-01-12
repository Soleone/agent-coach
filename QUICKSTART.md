# Quick Start Guide

## 1. Install and Build

```bash
npm install
npm run build
```

## 2. Initialize

```bash
# Initialize directories in your Obsidian vault
npm start -- config init

# Verify configuration
npm start -- config show
```

This creates:
- `/mnt/d/data/obsidian-vault/Coach/Goals/`
- `/mnt/d/data/obsidian-vault/Coach/Projects/`
- `/mnt/d/data/obsidian-vault/Daily Notes/`

## 3. Create Your First Goal

Create a file: `/mnt/d/data/obsidian-vault/Coach/Goals/learn-typescript.md`

```markdown
---
status: in-progress
created: 2026-01-11
target: 2026-02-01
progress: 20
tags: [goal/active, area/learning]
lastUpdated: 2026-01-11
---

# Goal: Learn TypeScript Fundamentals

## Milestones
- [x] Complete basics tutorial (2026-01-08)
- [ ] Build a small CLI tool (2026-01-20)
- [ ] Contribute to open source TS project (2026-02-01)

## Current Status
**Last updated:** 2026-01-11
Working through generics and advanced types. Feeling good about progress!

## Next Actions
- [ ] Read TypeScript handbook chapter on generics
- [ ] Build type-safe API client
- [ ] Review DefinitelyTyped contributions
```

## 4. Add Some Daily Notes

Create: `/mnt/d/data/obsidian-vault/Daily Notes/2026-01-11.md`

```markdown
# 2026-01-11

## Work
- Fixed bug in authentication flow
- Started planning the API refactor #project/api-refactor

## Learning
- Worked on TypeScript generics #goal/learn-typescript
- Thought: How do I properly type recursive data structures?

## Ideas
- Maybe we should extract our auth logic into a separate service?
- Wondering about the best way to handle rate limiting
```

## 5. Invoke the Coach

### Option A: Claude Code Skill (Recommended)

In a Claude Code session:
```
/coach
```

### Option B: CLI

```bash
npm start -- start
```

This will output the coaching context. Copy it into a Claude Code session.

## 6. Have a Conversation

The coach will analyze your goals and recent notes, then suggest contextual actions:

- "Your 'Learn TypeScript' goal looks good! I see you were thinking about recursive types. Want to dive into that?"
- "You mentioned API refactor in yesterday's notes but don't have a goal for it. Should we create one?"
- "Your auth service extraction idea from today could be worth exploring. Want to brainstorm the architecture?"

Claude will then help you:
- Work through blockers
- Update goals with new progress
- Create new goals from ideas
- Log reflections to daily notes
- Explore questions you've logged

## 7. Update Goals During Conversation

During the coaching session, Claude can update your files directly. Just have a natural conversation:

```
You: I'm stuck on TypeScript generics, specifically with type constraints

Coach: Got it, let me mark that as a blocker in your goal...
[Updates learn-typescript.md to add blocker and change status]

Let's work through it - what specific constraint are you trying to express?
```

## Tips

1. **Log thoughts in daily notes** - The more you write, the better the coach can suggest contextual actions
2. **Use tags** - Tag goals and topics in notes so the coach can identify patterns
3. **Ask questions in notes** - Questions like "How do I...?" or "Why does...?" trigger the coach to help explore them
4. **Regular standups** - Invoke `/coach` daily or weekly to maintain momentum

## Next Steps

- Create more goals in `Coach/Goals/`
- Start journaling in daily notes
- Use tags to track themes (#goal/name, #project/name, #topic/name)
- Invoke `/coach` and let Claude help you maintain focus!
