# Coach

Proactive AI coaching that analyzes your goals and notes to suggest contextual actions.

## Skills

- `/coach` - Proactive coaching session
- `/coach-list` - List all goals
- `/coach-config` - Manage configuration

## Setup

1. Create directories:
   ```
   your-vault/
   ├── Coach/
   │   └── Goals/
   └── Daily Notes/
   ```

2. Create goals in `Coach/Goals/` using the [goal format](skills/coach/references/goal-format.md)

3. Journal in `Daily Notes/` with dates like `2026-01-12.md`

4. Use tags: `#goal/name`, `#project/name`, `#topic/name`

5. Run `/coach` for a coaching session

## For AI Assistants

Copy the skills folder to your AI assistant's skills directory:
- Claude Code: `~/.claude/skills/`
- OpenCode: `~/.opencode/skills/`

## File Format

See reference docs:
- [Goal format](skills/coach/references/goal-format.md)
- [Daily notes format](skills/coach/references/daily-notes-format.md)
