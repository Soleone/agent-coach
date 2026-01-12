/**
 * Claude Code Skill Integration
 *
 * This is the main entry point for /coach skill.
 * It loads context from Obsidian and activates proactive coaching mode.
 */

import { ConfigManager } from './config.js';
import { ObsidianManager } from './obsidian.js';
import { ContextAnalyzer } from './context.js';
import { CoachHelpers, formatGoalsList } from './helpers.js';

export interface SkillContext {
  args?: string;
  sessionContext?: string;
}

/**
 * Main entry point for /coach skill
 * Loads all context and activates proactive coaching mode
 */
export async function runCoachSkill(context: SkillContext): Promise<string> {
  const config = new ConfigManager();
  const obsidian = new ObsidianManager(config.getGoalsPath(), config.getDailyNotesPath());
  const analyzer = new ContextAnalyzer(
    config.getDailyNotesPath(),
    config.getGoalsPath(),
    config.getProjectsPath()
  );

  // Load all goals and recent activity
  const goals = obsidian.loadGoals();
  const recentActivity = analyzer.buildContext(goals);
  const suggestions = analyzer.analyzeActivity(goals, recentActivity.dailyNotes);

  // Build rich context message
  return buildCoachingContext(goals, recentActivity, suggestions);
}

/**
 * Build the coaching context message that activates coach mode
 */
function buildCoachingContext(
  goals: any[],
  activity: any,
  suggestions: any[]
): string {
  const today = new Date().toISOString().split('T')[0];

  // Format recent thoughts/ideas
  const recentThoughtsSection = activity.recentIdeas.length > 0
    ? `\n## Recent Thoughts & Ideas\n${activity.recentIdeas.map((t: string) => `- ${t}`).join('\n')}`
    : '';

  const openQuestionsSection = activity.openQuestions.length > 0
    ? `\n## Open Questions\n${activity.openQuestions.map((q: string) => `- ${q}`).join('\n')}`
    : '';

  const themesSection = activity.recentThemes.length > 0
    ? `\n## Recent Themes/Topics\n${activity.recentThemes.slice(0, 5).join(', ')}`
    : '';

  // Format contextual suggestions
  const suggestionsSection = suggestions.length > 0
    ? `\n## Contextual Suggestions (ordered by relevance)\n${suggestions.slice(0, 5).map((s, i) =>
      `${i + 1}. **${s.action}**\n   _${s.reason}${s.context ? ' - ' + s.context : ''}_`
    ).join('\n\n')}`
    : '';

  // Format active goals summary
  const activeGoalsSection = activity.activeGoals.length > 0
    ? `\n## Active Goals\n\n${formatGoalsList(activity.activeGoals)}`
    : '\n## No Active Goals\nYou currently have no active goals.';

  const staleGoalsSection = activity.staleGoals.length > 0
    ? `\n## Stale Goals (7+ days without update)\n${activity.staleGoals.map((g: { title: string; metadata: { lastUpdated: string } }) => `- ${g.title} (last updated: ${g.metadata.lastUpdated})`).join('\n')}`
    : '';

  return `# 🎯 Claude Coach Activated - ${today}

You are now in **proactive coaching mode**. Your role is to help me stay focused, unblock obstacles, reflect on ideas, and make progress on my goals.

${suggestionsSection}
${activeGoalsSection}
${staleGoalsSection}
${recentThoughtsSection}
${openQuestionsSection}
${themesSection}

---

## Your Role as Coach

**BE PROACTIVE**: Don't just list options - analyze the context above and suggest what would be most valuable right now based on:
- Goals that need attention (stale, blocked, or recently mentioned)
- Recent thoughts/questions that could use exploration
- Patterns in my recent activity
- What would create the most momentum

**BE CONVERSATIONAL**: Engage naturally. Ask clarifying questions. Help me think through blockers. Celebrate progress.

**TAKE ACTION**: During our conversation, you can update goals using the Write/Edit tools:
- Update progress, status, blockers, next actions
- Complete milestones
- Create new goals
- Log standups/reflections to daily notes (in "## Coach" section with #standup tag)

**AVAILABLE HELPERS**: You have access to these utility functions (implemented in src/helpers.ts):
- Update goal progress/status
- Add/resolve blockers
- Add/complete next actions
- Complete milestones
- Create new goals
- Log standup summaries to daily notes

**START THE CONVERSATION**:
Greet me briefly, then offer 2-3 specific, contextual suggestions based on what you see above. Make them actionable and relevant to my recent activity. Ask which would be most helpful, or if there's something else on my mind.

Don't give me generic options - use the context to suggest what would genuinely move things forward right now.`;
}

// Export main handler for skill integration
export default runCoachSkill;
