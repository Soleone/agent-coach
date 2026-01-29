# Coach Vault Schema

This document defines the markdown-based schema for Coach personal life tracking in Obsidian.

## Overview

- **Source of truth**: Markdown files in Obsidian vault
- **LLM access**: Direct read/write of markdown, no CLI required
- **Structure**: Folder-based organization with frontmatter metadata
- **Append-only files**: Ideas.md and Thoughts.md for quick capture

## Directory Structure

```
Coach/
├── Goals/           # Aspirations with trackable outcomes
│   └── BJJ Blue Belt.md
├── Projects/        # Bounded work with deliverables
│   └── Agent Coach.md
├── Interests/       # Domains of curiosity, knowledge accumulation
│   └── 3D Printing.md
├── Ideas.md         # Actionable seeds (single append-only file)
├── Thoughts.md      # Observations/insights (single append-only file)
└── State.md         # Coach settings and configuration
```

## Entity Types

### Goals (Goals/*.md)

Aspirations with trackable outcomes.

**Frontmatter:**
```yaml
---
type: goal
status: active | paused | done | archived
created-at: 2026-01-26
updated-at: 2026-01-26
---
```

**Examples:** "Get BJJ blue belt", "Learn Rust", "Read 12 books this year"

### Projects (Projects/*.md)

Bounded work with concrete deliverables.

**Frontmatter:**
```yaml
---
type: project
status: active | paused | done | archived
created-at: 2026-01-26
updated-at: 2026-01-26
---
```

**Examples:** "Build Agent Coach", "Ship portfolio website", "Organize home office"

### Interests (Interests/*.md)

Open-ended domains of curiosity and learning.

**Frontmatter:**
```yaml
---
type: interest
status: active | paused | archived
created-at: 2026-01-26
updated-at: 2026-01-26
---
```

**Examples:** "3D Printing", "Mechanical Keyboards", "Brazilian Jiu-Jitsu"

## Append-Only Files

### Ideas.md

Actionable seeds that could become Goals, Projects, or Interests.

**Format:**
```markdown
# Ideas

- [[2026-01-26]]: Combine AI + 3D printing for miniatures
- [[2026-01-15]]: Coach CLI for markdown querying
```

- Date as wiki-link provides metadata and journal context
- Append new ideas at the top (date-descending)
- One line per idea

### Thoughts.md

Observations, insights, or reflections.

**Format:**
```markdown
# Thoughts

- [[2026-01-26]]: Feeling energized after BJJ class
- [[2026-01-25]]: Learn best through hands-on projects
```

- Date as wiki-link provides metadata and journal context
- Append new thoughts at the top (date-descending)
- One line per thought

## Frontmatter Rules

- **No freeform text**: Only enums, dates, or page references
- **type field**: Reinforces folder (helps LLM when reading without path)
- **status field**: Key trackable field for all entities
- **Optional fields**: Add as needed (due-date, parent: "[[path]]", tags: [x, y])

## Body Conventions (Not Enforced)

Suggested structure for Goals, Projects, Interests:

```markdown
# Title

One-line description.

## Notes

Freeform content, updates, research.

## Tasks

- [ ] Actionable items
- [ ] With optional Tasks plugin syntax 📅 2026-02-01
```

## LLM Decision Rules

| User says                              | Coach action                |
|----------------------------------------|-----------------------------|
| "I want to achieve X"                  | Create Goals/X.md           |
| "I'm working on X" / "build X"        | Create Projects/X.md        |
| "I'm curious about X" / "learning X"  | Create Interests/X.md       |
| "What if..." / actionable seed         | Append to Ideas.md          |
| "I noticed..." / observation           | Append to Thoughts.md       |
| "Remind me to X" / "I need to X"      | Task in relevant file or journal |

## What's NOT in Schema

- No Areas/Habits (covered by Interests + recurring tasks)
- No CLI required (LLM reads/writes directly)
- No unique task IDs or block references
- No enforced body structure beyond frontmatter
- Beads stays for software project issue tracking only

## Reference Documentation

Detailed format specifications:
- [Goals](./references/goals.md)
- [Projects](./references/projects.md)
- [Interests](./references/interests.md)
- [Ideas](./references/ideas.md)
- [Thoughts](./references/thoughts.md)
- [State](./references/state.md)
