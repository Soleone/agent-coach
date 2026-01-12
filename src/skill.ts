/**
 * Claude Code Skill Integration
 *
 * This module provides the integration layer for Claude Code skills.
 * It allows invoking the coaching system directly within Claude Code sessions.
 */

import { ConfigManager } from './config.js';
import { ObsidianManager } from './obsidian.js';
import { Goal } from './models.js';

export interface SkillContext {
  // Context provided by Claude Code when skill is invoked
  args?: string;
  sessionContext?: string;
}

/**
 * Main entry point for /coach skill
 */
export async function runCoachSkill(context: SkillContext): Promise<string> {
  const args = context.args?.trim().toLowerCase() || 'standup';

  const config = new ConfigManager();
  const obsidian = new ObsidianManager(config.getGoalsPath(), config.getDailyNotesPath());

  switch (args) {
    case 'standup':
      return await handleStandup(obsidian);

    case 'list':
      return handleList(obsidian);

    case 'goals':
      return handleGoalSetting();

    default:
      if (args.startsWith('review ')) {
        const goalId = args.replace('review ', '').trim();
        return await handleReview(goalId, obsidian);
      }
      return getHelpText();
  }
}

async function handleStandup(obsidian: ObsidianManager): Promise<string> {
  const goals = obsidian.loadGoals();
  const activeGoals = goals.filter(g =>
    g.metadata.status === 'in-progress' || g.metadata.status === 'blocked'
  );

  if (activeGoals.length === 0) {
    return `No active goals found. Use \`/coach goals\` to set some goals first.`;
  }

  // Return context for Claude to conduct standup
  const goalsSummary = activeGoals.map(g => {
    const blockers = g.blockers.length ? `\n  **Blockers:** ${g.blockers.join(', ')}` : '';
    return `### ${g.title}
- **Status:** ${g.metadata.status}
- **Progress:** ${g.metadata.progress}%
- **Target:** ${g.metadata.target || 'Not set'}${blockers}
- **Next Actions:** ${g.nextActions.slice(0, 3).join(', ') || 'None'}`;
  }).join('\n\n');

  return `# Daily Standup - ${new Date().toISOString().split('T')[0]}

## Active Goals

${goalsSummary}

---

**Instructions for Claude:**
You are now conducting a daily standup with the user. For each goal above:

1. Ask the user what progress they've made (if any)
2. Check if any blockers have been resolved or new ones emerged
3. Update the progress percentage if needed
4. Confirm or update next actions
5. Finally, ask about their energy level (1-10)

Be conversational and encouraging. After the conversation, you should:
- Update the goal files with new progress/status
- Create a standup entry in today's daily note under "## Coach" section
- Include goal tags like #goal/goal-name for easy filtering

Begin the standup now with a brief greeting and dive into the first goal.`;
}

function handleList(obsidian: ObsidianManager): string {
  const goals = obsidian.loadGoals();

  if (goals.length === 0) {
    return 'No goals found. Use `/coach goals` to create some goals.';
  }

  const goalsList = goals.map(g => {
    const emoji = getStatusEmoji(g.metadata.status);
    const blockerText = g.blockers.length ? ` 🚧 **Blockers:** ${g.blockers.join(', ')}` : '';
    return `${emoji} **${g.title}** (${g.metadata.progress}%)
   - Status: ${g.metadata.status}
   - Target: ${g.metadata.target || 'Not set'}${blockerText}
   - Next: ${g.nextActions[0] || 'No actions defined'}`;
  }).join('\n\n');

  return `# Your Goals\n\n${goalsList}`;
}

async function handleReview(goalId: string, obsidian: ObsidianManager): Promise<string> {
  const goals = obsidian.loadGoals();
  const goal = goals.find(g => g.id === goalId);

  if (!goal) {
    const availableIds = goals.map(g => `- ${g.id}`).join('\n');
    return `Goal "${goalId}" not found.\n\nAvailable goals:\n${availableIds}`;
  }

  return `# Goal Review: ${goal.title}

## Overview
- **Status:** ${goal.metadata.status}
- **Progress:** ${goal.metadata.progress}%
- **Created:** ${goal.metadata.created}
- **Target:** ${goal.metadata.target || 'Not set'}
- **Tags:** ${goal.metadata.tags.join(', ') || 'None'}

## Milestones
${goal.milestones.map(m => `- [${m.completed ? 'x' : ' '}] ${m.description}${m.targetDate ? ` (${m.targetDate})` : ''}`).join('\n') || '- No milestones defined'}

## Current Status
${goal.currentStatus || 'No status notes'}

${goal.blockers.length ? `## Blockers\n${goal.blockers.map(b => `- ${b}`).join('\n')}` : ''}

## Next Actions
${goal.nextActions.map(a => `- [ ] ${a}`).join('\n') || '- No actions defined'}

---

**Instructions for Claude:**
You are now reviewing this goal with the user. Engage in a focused conversation to:
1. Celebrate what's been accomplished
2. Discuss and help resolve any blockers
3. Adjust milestones if the goal has evolved
4. Clarify and prioritize next actions

After the conversation, update the goal file with any changes.`;
}

function handleGoalSetting(): string {
  return `# Goal Setting Session

**Instructions for Claude:**
You are helping the user define new goals. Guide them through a conversational process:

1. Ask what areas they want to focus on (work, health, learning, relationships, etc.)
2. Help them articulate 1-3 specific, measurable goals
3. For each goal, establish:
   - A clear title and description
   - Target completion date
   - 2-4 milestones along the way
   - Initial next actions (1-3 concrete steps)
   - Relevant tags for organization

Be encouraging but help them stay realistic and focused. Once goals are defined, create goal files in the Goals directory with proper structure and metadata.

Begin the conversation by asking what areas of their life or work they'd like to focus on.`;
}

function getStatusEmoji(status: string): string {
  const emojiMap: Record<string, string> = {
    'not-started': '⚪',
    'in-progress': '🔵',
    'blocked': '🔴',
    'completed': '✅',
    'paused': '⏸️',
  };
  return emojiMap[status] || '⚪';
}

function getHelpText(): string {
  return `# Claude Coach - Help

Available commands:

- \`/coach standup\` - Run daily standup session
- \`/coach list\` - List all goals with status
- \`/coach goals\` - Set new goals (guided conversation)
- \`/coach review <goal-id>\` - Review a specific goal

The coaching system integrates with your Obsidian vault to track goals, milestones, and progress.`;
}

// Export main handler for skill integration
export default runCoachSkill;
