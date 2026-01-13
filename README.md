---

# Claude Coach

**Proactive AI coaching that analyzes your Obsidian notes and suggests contextual actions.**

Claude Coach transforms Claude into a proactive personal coach by analyzing your goals and journal entries to suggest specific, contextual actions based on what you're actually working on - not generic task lists.

## How It Works

When you run `/coach`:

1. Analyzes your goals from `Coach/Goals/` directory
2. Reviews your recent daily notes (last 7 days)
3. Identifies patterns: stale goals, recent mentions, open questions, themes
4. Suggests **specific actions** like:
   - "Your 'Learn Rust' goal is stale (8 days). You were on lifetimes - what's blocking you?"
   - "You mentioned 'auth refactor' twice this week but have no goal for it. Create one?"
   - "Your distributed systems question from Jan 9th - want to explore that?"

## Skills

- **`/coach`** - Start proactive coaching with contextual suggestions
- **`/coach-list`** - List all goals with status and progress
- **`/coach-config`** - Manage configuration and initialize directories

## Installation

```bash
npm install -g claude-coach
```

Or add to your Claude Code project:
```bash
npm install claude-coach
```

## Setup

1. **Initialize directories**:
   ```
   /coach-config
   ```
   Type: "Initialize directories"

2. **Set vault path** (if not using default):
   ```
   /coach-config
   ```
   Type: "Set vault path to /your/vault/path"

3. **Create your first goal** in `{vault}/Coach/Goals/example.md`:

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
- [ ] Define milestones
- [ ] Break down into tasks
```

4. **Start coaching**:
   ```
   /coach
   ```

## Directory Structure

```
your-vault/
├── Daily Notes/
│   └── 2026-01-12.md          # Journal entries
└── Coach/
    ├── Goals/
    │   └── example-goal.md     # Individual goals
    └── Projects/
        └── project-name.md     # Project tracking
```

## Intelligent Analysis

The coach identifies:

- **Stale goals** - Not updated in 7+ days
- **Recent mentions** - Goals/topics in daily notes
- **Thoughts & questions** - Reflective entries worth exploring
- **Blockers** - Goals marked as blocked
- **Themes** - Common tags across recent work
- **Missing structure** - Goals without next actions

## Example Interaction

```
You: /coach

Claude: Hi! I've analyzed your recent activity:

1. **"Learn Rust" needs attention** - 8 days since update.
   You were working on lifetimes. What's blocking you?

2. **"Auth refactor" mentioned twice** but no goal tracking it.
   Want to create one?

3. **Recursive types question from yesterday** - explore together?

What would move things forward?

You: Let's tackle the Rust lifetime confusion

Claude: Got it! Let me update that goal...
[Updates goal file with blocker]

What specifically about lifetimes is tricky?

[Conversation continues, Claude updates files]
```

## Daily Notes Integration

The coach analyzes your daily notes for:

```markdown
# 2026-01-12

## Work
- Fixed auth bug
- Planning API refactor #project/api-refactor

## Learning
- Rust generics #goal/learn-rust
- Question: How do I handle recursive types properly?

## Ideas
- Extract auth into separate service?
```

Claude will:
- See you're actively working on Rust
- Offer to help with the recursive types question
- Suggest creating a goal for auth service extraction

## Tips for Best Results

1. **Journal regularly** - More notes = better suggestions
2. **Use tags** - `#goal/name`, `#project/name`, `#topic/name`
3. **Ask questions** - "How do I...?" triggers exploration
4. **Update goals** - Even small updates prevent staleness
5. **Run /coach often** - Daily or weekly for momentum

## Configuration

Located at `~/.config/claude-coach/config.yaml`:

```yaml
vaultPath: /path/to/vault
coachDirName: Coach
dailyNotesPath: Daily Notes
preferences:
  trackingLevel: structured
  autoAppendDaily: true
```

## Development

```bash
git clone https://github.com/yourusername/claude-coach
cd claude-coach
npm install
npm run build
```

Link skills for local testing:
```bash
ln -s $(pwd)/skills/coach ~/.claude/skills/coach
ln -s $(pwd)/skills/coach-list ~/.claude/skills/coach-list
ln -s $(pwd)/skills/coach-config ~/.claude/skills/coach-config
```

## License

MIT

---

**Sources:**
- [Agent Skills - Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Skills Repository](https://github.com/anthropics/skills)
- [How to Build Claude Skills](https://www.codecademy.com/article/how-to-build-claude-skills)
