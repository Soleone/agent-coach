---
name: coach-list
description: List all your goals from your notes with current status, progress, and blockers. Use when you want to see an overview of all your goals at a glance.
---

# Coach: List Goals

Display all goals from your note vault with current status.

## Instructions

1. **Load goals** using Glob: `{vault}/Coach/Goals/*.md`
2. **Read and parse** each goal file
3. **Extract key info**:
   - Status (from frontmatter) → Use emoji: ⚪ not-started, 🔵 in-progress, 🔴 blocked, ✅ completed, ⏸️ paused
   - Title, progress %, last updated, target date
   - Blockers (from `**Blockers:**` section)
   - First next action
4. **Sort** by priority: blocked first, then in-progress, then others
5. **Display** formatted with status emoji, key metrics, and blockers
6. **Summarize**: Total count and breakdown by status

**If no goals exist**, suggest creating goals with `/coach`

## Format

Reference [goal-format.md](../coach/references/goal-format.md) for goal file structure.
