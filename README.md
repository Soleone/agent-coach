# Claude Coach

Proactive AI coaching assistant that integrates with Obsidian and Claude Code to help you track goals, conduct daily standups, and maintain focus.

## How It Works

Instead of a separate chatbot, Claude Coach **turns Claude Code into your proactive coach**. When you invoke `/coach`:

1. **Context Loading**: Loads your goals, recent daily notes, thoughts, and patterns from Obsidian
2. **Intelligent Analysis**: Analyzes what you've been working on, identifies stale goals, recent themes, and open questions
3. **Contextual Suggestions**: Generates specific, actionable suggestions based on your recent activity (not generic options)
4. **Conversational Coaching**: Claude (in your current session) becomes your coach - proactive, helpful, and action-oriented
5. **Direct File Updates**: During conversation, Claude updates your Obsidian goal files and daily notes

## Features

- **Proactive & Contextual**: Suggests actions based on recent activity, not static commands
- **Recent Activity Analysis**: Parses daily notes to find thoughts, questions, and patterns
- **Smart Suggestions**: Identifies stale goals, blockers, recent mentions, and themes
- **Goal Tracking**: Structured goal management with milestones, progress, and blockers
- **Seamless Integration**: Works directly in Claude Code sessions or from CLI
- **Configurable**: Customize vault paths, directory names, and preferences

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

# Set your Obsidian vault path (default: /mnt/d/data/obsidian-vault)
npm start -- config set-vault /path/to/your/vault

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

### Primary Usage: Claude Code Skill

In a Claude Code session, simply run:

```
/coach
```

This will:
1. Load all your goals and recent daily notes
2. Analyze your recent activity and identify patterns
3. Generate contextual suggestions based on what you've been working on
4. Activate Claude as your proactive coach in the current session

Claude will then greet you and suggest specific actions based on:
- Goals that haven't been updated recently (stale)
- Goals you've mentioned in recent notes
- Recent thoughts or questions you've logged
- Blocked goals that need attention
- Common themes in your recent work

### Alternative: CLI

```bash
# Start coaching session (prints context to copy into Claude Code)
npm start -- start

# List all goals
npm start -- list

# View configuration
npm start -- config show
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
```

## Example Interaction

```
You: /coach

Claude: Hi! I've analyzed your recent activity and see a few things worth discussing:

1. **Your "Learn Rust" goal is getting stale** - it's been 8 days since your last update.
   You were on chapter 10 (lifetimes). What's blocking you?

2. **You mentioned "authentication refactor" twice this week** in your daily notes but
   don't have a goal tracking it. Should we create one?

3. **Your distributed systems thoughts from Jan 9th** looked interesting - you asked
   "How do we handle partial failures in microservices?" Want to explore that further?

What would be most helpful to focus on right now?

You: Let's tackle the Rust goal - I got stuck on lifetime syntax

Claude: Got it! Let me update that goal's status to "blocked" and add that blocker...
[Updates goal file]

What specifically about lifetime syntax is tricky? Is it the concept or the syntax itself?

[Conversation continues naturally, Claude updates files as needed]
```

## Intelligent Context Analysis

The coach analyzes:
- **Stale goals**: Goals in-progress but not updated in 7+ days
- **Recent mentions**: Goals or topics you've referenced in daily notes
- **Thoughts & questions**: Reflective entries that could use deeper exploration
- **Blockers**: Goals explicitly marked as blocked
- **Themes**: Common tags/topics across recent notes
- **Missing structure**: Goals without next actions defined

## Roadmap

- [x] Conversational coaching in Claude Code sessions
- [x] Context-aware suggestions based on activity
- [x] Parse daily notes for thoughts and patterns
- [x] Goal tracking with Obsidian integration
- [ ] Git/code activity integration (analyze commits/PRs)
- [ ] Weekly/monthly review sessions
- [ ] Goal templates and categories
- [ ] Project file parsing and integration
- [ ] Progress visualization
- [ ] Better thought/idea extraction from daily notes
