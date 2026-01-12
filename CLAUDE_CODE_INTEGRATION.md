# Claude Code Integration

This guide explains how to integrate Claude Coach as a skill in Claude Code.

## Method 1: NPM Script Skill (Recommended for Development)

Create a skill configuration file that invokes the CLI:

**~/.claude/skills/coach.skill**

```bash
#!/bin/bash
# Claude Coach - Proactive coaching assistant
# Usage: /coach

cd /home/soleone/workspace/tries/2026-01-11-aisyst
node dist/cli.js start 2>&1
```

Make it executable:
```bash
chmod +x ~/.claude/skills/coach.skill
```

Now `/coach` will be available in Claude Code sessions.

## Method 2: Direct Node Module (For Production)

If you install globally or link the package:

```bash
npm link
```

Create **~/.claude/skills/coach.skill**:

```bash
#!/bin/bash
claude-coach start 2>&1
```

## Method 3: Import as TypeScript Module

If Claude Code supports importing TS/JS modules directly (check documentation):

**~/.claude/skills/coach.ts**

```typescript
import { runCoachSkill } from '/home/soleone/workspace/tries/2026-01-11-aisyst/dist/index.js';

export async function coach(args?: string) {
  const context = await runCoachSkill({ args });
  return context;
}
```

## Verification

Test the skill:

```bash
# In Claude Code
/coach

# Should output coaching context with your goals and suggestions
```

## Troubleshooting

### Skill not found
- Verify `~/.claude/skills/coach.skill` exists and is executable
- Check Claude Code's skill directory configuration

### No output
- Ensure the project is built: `npm run build`
- Test the CLI directly: `npm start -- start`
- Check paths in the skill file are absolute

### Module errors
- Run `npm install` and `npm run build` again
- Verify TypeScript compilation succeeded

## Advanced: Custom Context

You can modify `src/skill.ts` to customize what context is loaded:

```typescript
// Add custom sections to the coaching context
const customSection = `
## Custom Context
- Your custom data here
`;

return buildCoachingContext(goals, recentActivity, suggestions) + customSection;
```

## Integration with Other Tools

The coach can be enhanced to load context from:
- Git commits (analyze recent work)
- GitHub issues/PRs
- Time tracking data
- Calendar events
- Any other source you want Claude to be aware of

Just modify `src/context.ts` to parse additional sources!
