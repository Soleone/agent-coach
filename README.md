# Claude Coach

Proactive AI coaching assistant that integrates with Obsidian and Claude Code to help you track goals, conduct daily standups, and maintain focus.

## Features

- **Goal Tracking**: Structured goal management with milestones, progress tracking, and blockers
- **Daily Standups**: AI-facilitated standup conversations that update your goals
- **Obsidian Integration**: Seamlessly works with your Obsidian vault's daily notes and goal files
- **Dual Interface**: Use as a CLI tool or Claude Code skill
- **Configurable**: Customize vault paths, directory names, and tracking preferences

## Installation

```bash
npm install
npm run build
```

## Configuration

### Initial Setup

```bash
# Initialize configuration and directories
npm start -- config init

# Set your Obsidian vault path
npm start -- config set-vault /mnt/d/data/obsidian-vault

# Set Anthropic API key (or use ANTHROPIC_API_KEY env var)
npm start -- config set-key sk-ant-...

# View configuration
npm start -- config show
```

### Directory Structure

The system creates this structure in your Obsidian vault:

```
/mnt/d/data/obsidian-vault/
├── Daily Notes/
│   └── 2026-01-11.md          # Daily standups appended here
└── Coach/                      # Configurable parent directory
    ├── Goals/
    │   └── run-5k.md          # Individual goal files
    └── Projects/
        └── project-name.md     # Project-specific goals
```

## Usage

### CLI Commands

```bash
# Run daily standup
npm start -- standup

# List all goals
npm start -- list

# Set new goals (guided conversation)
npm start -- goals

# Review a specific goal
npm start -- review goal-id
```

### Claude Code Integration

In a Claude Code session, you can use the `/coach` skill:

```
/coach standup     # Run daily standup
/coach list        # List all goals
/coach goals       # Set new goals
/coach review <id> # Review specific goal
```

## Goal File Format

Goals are stored as markdown files with frontmatter:

```markdown
---
status: in-progress
created: 2026-01-05
target: 2026-02-01
progress: 35
tags: [goal/active, area/health]
lastUpdated: 2026-01-11
---

# Goal: Run 5K in under 25 minutes

## Milestones
- [x] Run 3K comfortably (2026-01-10)
- [ ] Run 4K in 22min (2026-01-20)
- [ ] Run 5K in 25min (2026-02-01)

## Current Status
**Last updated:** 2026-01-11
Making steady progress, up to 3.5K

**Blockers:**
- Knee pain after long runs

## Next Actions
- [ ] Get running shoes assessed
- [ ] Add stretching routine
```

## Daily Note Format

Standups are appended to daily notes:

```markdown
## Coach - 2026-01-11 09:30 #standup

**Goals reviewed:** #goal/run-5k #goal/learn-rust
- Run 5K: 35% → 40%, resolved knee pain blocker ✅
- Learn Rust: Started chapter 10, next: lifetimes

**Blockers:** None
**Energy:** 7/10
```

## Development

```bash
# Build
npm run build

# Watch mode
npm run dev
```

## Configuration File

Config is stored at `~/.config/claude-coach/config.yaml`:

```yaml
vaultPath: /mnt/d/data/obsidian-vault
coachDirName: Coach
dailyNotesPath: Daily Notes
preferences:
  trackingLevel: structured
  autoAppendDaily: true
anthropicApiKey: sk-ant-... # optional
```

## Roadmap

- [ ] Interactive CLI conversations (currently placeholder)
- [ ] Git/code activity integration for context
- [ ] Weekly/monthly review sessions
- [ ] Goal templates and categories
- [ ] Progress visualization
- [ ] Multi-user support for teams
