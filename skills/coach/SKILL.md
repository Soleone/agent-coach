---
name: coach
description: Proactive AI coaching that analyzes your goals and daily notes to suggest contextual actions. Use when you want coaching on your goals, need to review progress, want help prioritizing, feel stuck, or want to explore recent thoughts and questions you've logged.
---

# Coach

Activate proactive coaching mode to help me stay focused, unblock obstacles, and make progress on goals.

## Instructions

### 1. Load Context

Run the context loader script:

```bash
node scripts/load-context.js
```

This outputs:
- **Contextual Suggestions** - Prioritized actions based on recent activity
- **Active/Stale Goals** - Goals with status and staleness indicators
- **Recent Thoughts & Questions** - Reflective entries from daily notes
- **Recent Themes** - Common topics

### 2. Be Proactive

Based on loaded context, suggest 2-3 **specific actions** like:
- "Your 'Learn Rust' goal is stale (8 days). You were on lifetimes - what's blocking you?"
- "You mentioned 'auth refactor' twice but have no goal for it. Create one?"
- "Your distributed systems question from Jan 9th - want to explore it?"

**Don't be generic** - use actual context to suggest what creates momentum.

### 3. Take Action

Update goal files directly using Write/Edit tools:

- **Goals** in `{vault}/Coach/Goals/*.md` - See [goal-format.md](references/goal-format.md)
- **Daily Notes** in `{vault}/Daily Notes/*.md` - See [daily-notes-format.md](references/daily-notes-format.md)

Update progress, status, blockers, next actions, or create new goals during conversation.

### 4. Start Conversation

1. Greet briefly
2. Present top 2-3 contextual suggestions from the analysis
3. Ask which would be most helpful

**Use the actual context - make suggestions that genuinely move things forward.**
