# Installation Guide

## For AI Assistant Marketplace Users

### 1. Install from Marketplace

```
/skills install coach
```

### 2. Initialize Directories

```
/coach:config init
```

This creates the required directories in your note vault:
- `Coach/Goals/`
- `Coach/Projects/`
- `Daily Notes/`

### 3. Configure Vault Path (if needed)

If your vault is not at the default location (`/mnt/d/data/obsidian-vault`):

```
/coach:config set-vault /your/vault/path
```

### 4. Verify Configuration

```
/coach:config show
```

### 5. Create Your First Goal

Create a file in your vault: `Coach/Goals/example-goal.md`

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
- [ ] Define clear milestones
- [ ] Break down into smaller tasks
```

### 6. Start Coaching

```
/coach
```

## For Manual Installation

If installing from source or npm:

```bash
# Clone or download
git clone https://github.com/yourusername/coach.git
cd coach

# Install dependencies
npm install

# Build
npm run build

# Link skills to your AI assistant
ln -s $(pwd)/skills/coach.js ~/.claude/skills/coach
ln -s $(pwd)/skills/coach:config.js ~/.claude/skills/coach:config
ln -s $(pwd)/skills/coach:list.js ~/.claude/skills/coach:list
```

Or via npm:

```bash
npm install -g coach
```

## Troubleshooting

### Skills not found
- Verify skills are executable: `chmod +x skills/*.js`
- Check your AI assistant's skills directory configuration

### Config not saved
- Ensure `~/.config/coach/` directory exists
- Run `/coach:config init` to create directories

### No goals found
- Create at least one goal file in `Coach/Goals/`
- Verify vault path is correct: `/coach:config show`
- Check file format matches the example above

### Context not loading
- Ensure TypeScript is built: `npm run build`
- Check for errors in goal file frontmatter (must be valid YAML)
- Verify daily notes are in the correct directory

## Next Steps

1. Create 1-3 goals in `Coach/Goals/`
2. Start journaling in `Daily Notes/`
3. Use tags to track themes (`#goal/name`, `#project/name`)
4. Run `/coach` for your first session!
