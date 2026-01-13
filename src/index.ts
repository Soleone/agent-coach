/**
 * Coach - Proactive AI Coaching Assistant
 *
 * Main entry point for library usage
 */

export { ConfigManager, CoachConfig } from './config.js';
export { ObsidianManager } from './obsidian.js';
export { ContextAnalyzer, ContextualSuggestion, RecentActivity } from './context.js';
export { CoachHelpers, formatGoalSummary, formatGoalsList } from './helpers.js';
export { runCoachSkill } from './skill.js';
export * from './models.js';
