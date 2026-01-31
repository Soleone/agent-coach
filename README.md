# Agent Coach

Proactive AI coaching that analyzes your goals, projects, ideas, and thoughts from your Obsidian vault to provide contextual guidance.

**GitHub:** https://github.com/Soleone/agent-coach

## Features

- **Entity-First Memory:** Captures goals, projects, interests, ideas, and thoughts as structured data
- **Smart Diary Routing:** Routes entries to entity logs or daily journals based on context
- **Beads Integration:** Optional task tracking for projects using [bd](https://github.com/yourorg/bd)
- **TTS Support:** Optional text-to-speech via speak skill
- **Configurable Personality:** Customizable coaching voice and style
- **Progressive Disclosure:** Modular architecture loads only what's needed

## Quick Start

1. **Install:**
   ```bash
   # Claude Code
   cp -r commands/ skills/ ~/.claude/

   # OpenCode
   ./setup-opencode.sh
   ```

2. **Configure:** Edit `your-vault/Coach/State.md` to set vault path and preferences

3. **Use:** Run `/coach:start` in Claude Code or OpenCode

## Vault Structure

```
{your-vault}/
├── Coach/
│   ├── Goals/*.md         # Aspirational targets
│   ├── Projects/*.md      # Concrete deliverables
│   ├── Interests/*.md     # Domains of curiosity
│   ├── Ideas.md           # Actionable seeds (append-only)
│   ├── Thoughts.md        # Observations (append-only)
│   └── State.md           # Coach configuration
└── {journals}/
    └── YYYY-MM-DD.md      # Daily journal pages
        └── ## Coach       # Required header for diary entries
```

## Entity Types

| Entity | Description | Example |
|--------|-------------|---------|
| **Goal** | Aspirational target | "Learn Rust", "Get fit" |
| **Project** | Concrete deliverable | "Build CLI tool", "Launch blog" |
| **Interest** | Domain of curiosity | "Game development", "Photography" |
| **Idea** | Actionable seed | "Build habit tracker app" |
| **Thought** | Observation/insight | "More productive in mornings" |

## Development

See [CLAUDE.md](CLAUDE.md) for development guidelines:
- Use `/skill-creator` for skill modifications
- Single source of truth - no duplication
- Progressive disclosure - core vs integrations

**Contributing:** Issues and PRs welcome at https://github.com/Soleone/agent-coach

## Architecture

Modular structure with progressive disclosure:
- **Core** (always loaded): `SKILL.md`, `triggers.md`, `behavior/`, `schema/`, `procedures/`
- **Integrations** (on-demand): `tts.md`, `beads.md` (loaded when features detected)

See `skills/coach/SKILL.md` for full documentation.
