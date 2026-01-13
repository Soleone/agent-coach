# Coach

Proactive AI coaching that analyzes your goals, projects, ideas, and thoughts from your Obsidian vault to provide contextual guidance.

## Use

1. Add goals to `your-vault/Coach/Goals/`
2. Add projects to `your-vault/Coach/Projects/`
3. Journal in `your-vault/_journals/` as `YYYY-MM-DD.md`
4. Tag ideas with `#idea:` and thoughts with `#thought:`
5. Run `/coach:start` in OpenCode or Claude Code

## Installation

### OpenCode

```bash
./setup-opencode.sh
```

### Claude Code

```bash
cp -r commands/ skills/ ~/.claude/
```

## Entities

### Goals
Fleeting/aspirational: "learn X", "become Y"

### Projects
Concrete things to build: "build X app", "ship Y feature"

### Ideas
`#idea:` in journals - can become Goals/Projects

### Thoughts
`#thought:` in journals - non-actionable observations

### Tasks
`- [ ] task #task` in journals

## Vault Structure

```
{your-vault}/
├── Coach/
│   ├── Goals/*.md
│   └── Projects/*.md
└── _journals/
    └── YYYY-MM-DD.md
```
