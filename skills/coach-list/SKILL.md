---
name: coach-list
description: List all goals with status, progress, and blockers. Use when you want a quick overview of all goals.
---

# Coach: List Goals

Display all goals from `Coach/Goals/` in a concise format.

## Your Process

1. **Read all files** from `Coach/Goals/*.md`
2. **Parse each goal** for:
   - Title (from `#` heading)
   - Status (from frontmatter: not-started, in-progress, blocked, completed, paused)
   - Progress % (from frontmatter)
   - Last updated date
   - Blockers (from `**Blockers:**` section)
   - First next action
3. **Group by status** (blocked first, then in-progress, then others)
4. **Display with emoji**:
   - ⚪ not-started
   - 🔵 in-progress
   - 🔴 blocked
   - ✅ completed
   - ⏸️ paused

## Format

```
🔵 Learn Rust - 25% - last updated: 2026-01-08
   Next: Complete lifetimes chapter
   Blockers: None

🔴 API Redesign - 60% - last updated: 2026-01-05
   Next: Finalize auth middleware
   Blockers: Waiting on design review
```

## Summary

End with a brief summary:
- Total goals
- Count by status
- Oldest stale goal
