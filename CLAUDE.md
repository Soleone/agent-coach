# Agent Coach Project

This is a Claude Code skill project using **bd** (beads) for issue tracking.

## Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

## Skill Development

- Use `/skill-creator` when modifying skills - it has specialized knowledge for Claude skills
- This project builds a coach skill that uses Obsidian vaults for memory

## Documentation Architecture

**Critical: Single Source of Truth**
- Never duplicate instructions across files - creates maintenance burden
- When behavior needs updating, it should change in ONE place only
- Use references/links instead of copying content

**Module Structure:**
- **Core** (always loaded): SKILL.md, triggers.md, behavior/, schema/, procedures/
- **Integrations** (loaded on-demand): Optional features like TTS, beads
- Only load integration docs when feature is detected (e.g., when `.beads` exists)

**Progressive Disclosure:**
- Hub files (SKILL.md) contain principles and references
- Detail files contain full workflows and examples
- Keep hubs lean - they're always loaded

**Content Guidelines:**
- **References over Duplication:** "See [file.md](file.md) for workflow" NOT copying entire workflows
- **Layering:** High-level principles in SKILL.md → Detailed procedures in procedures/ → Examples in detail files

**Testing Changes:**
1. Check if change creates duplication
2. If yes, refactor to single source of truth
3. Update references, not copies

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
