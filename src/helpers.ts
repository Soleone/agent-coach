import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { Goal, GoalStatus, Milestone } from './models.js';
import { ObsidianManager } from './obsidian.js';

/**
 * Helper utilities for Claude to use during coaching sessions
 * These make it easy to update goals and daily notes
 */

export class CoachHelpers {
  constructor(private obsidian: ObsidianManager) {}

  /**
   * Update goal progress
   */
  updateProgress(goalId: string, newProgress: number, goals: Goal[]): Goal | null {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    goal.metadata.progress = Math.max(0, Math.min(100, newProgress));
    goal.metadata.lastUpdated = new Date().toISOString().split('T')[0];

    if (newProgress >= 100 && goal.metadata.status !== 'completed') {
      goal.metadata.status = 'completed';
    }

    this.obsidian.writeGoal(goal);
    return goal;
  }

  /**
   * Update goal status
   */
  updateStatus(goalId: string, newStatus: GoalStatus, goals: Goal[]): Goal | null {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    goal.metadata.status = newStatus;
    goal.metadata.lastUpdated = new Date().toISOString().split('T')[0];

    this.obsidian.writeGoal(goal);
    return goal;
  }

  /**
   * Add a blocker to a goal
   */
  addBlocker(goalId: string, blocker: string, goals: Goal[]): Goal | null {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    if (!goal.blockers.includes(blocker)) {
      goal.blockers.push(blocker);
      goal.metadata.status = 'blocked';
      goal.metadata.lastUpdated = new Date().toISOString().split('T')[0];
      this.obsidian.writeGoal(goal);
    }

    return goal;
  }

  /**
   * Remove/resolve a blocker
   */
  resolveBlocker(goalId: string, blocker: string, goals: Goal[]): Goal | null {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    goal.blockers = goal.blockers.filter(b => b !== blocker);

    if (goal.blockers.length === 0 && goal.metadata.status === 'blocked') {
      goal.metadata.status = 'in-progress';
    }

    goal.metadata.lastUpdated = new Date().toISOString().split('T')[0];
    this.obsidian.writeGoal(goal);
    return goal;
  }

  /**
   * Add next action to a goal
   */
  addNextAction(goalId: string, action: string, goals: Goal[]): Goal | null {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    if (!goal.nextActions.includes(action)) {
      goal.nextActions.push(action);
      goal.metadata.lastUpdated = new Date().toISOString().split('T')[0];
      this.obsidian.writeGoal(goal);
    }

    return goal;
  }

  /**
   * Complete a next action
   */
  completeNextAction(goalId: string, action: string, goals: Goal[]): Goal | null {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    goal.nextActions = goal.nextActions.filter(a => a !== action);
    goal.metadata.lastUpdated = new Date().toISOString().split('T')[0];
    this.obsidian.writeGoal(goal);
    return goal;
  }

  /**
   * Update current status notes for a goal
   */
  updateStatusNotes(goalId: string, notes: string, goals: Goal[]): Goal | null {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    goal.currentStatus = notes;
    goal.metadata.lastUpdated = new Date().toISOString().split('T')[0];
    this.obsidian.writeGoal(goal);
    return goal;
  }

  /**
   * Complete a milestone
   */
  completeMilestone(goalId: string, milestoneIndex: number, goals: Goal[]): Goal | null {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !goal.milestones[milestoneIndex]) return null;

    goal.milestones[milestoneIndex].completed = true;
    goal.milestones[milestoneIndex].completedDate = new Date().toISOString().split('T')[0];
    goal.metadata.lastUpdated = new Date().toISOString().split('T')[0];

    // Auto-update progress based on milestone completion
    const completedCount = goal.milestones.filter(m => m.completed).length;
    const totalMilestones = goal.milestones.length;
    if (totalMilestones > 0) {
      goal.metadata.progress = Math.round((completedCount / totalMilestones) * 100);
    }

    this.obsidian.writeGoal(goal);
    return goal;
  }

  /**
   * Add a milestone to a goal
   */
  addMilestone(goalId: string, milestone: Milestone, goals: Goal[]): Goal | null {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return null;

    goal.milestones.push(milestone);
    goal.metadata.lastUpdated = new Date().toISOString().split('T')[0];
    this.obsidian.writeGoal(goal);
    return goal;
  }

  /**
   * Create a new goal
   */
  createGoal(goal: Goal): Goal {
    this.obsidian.writeGoal(goal);
    return goal;
  }

  /**
   * Log a standup entry to today's daily note
   */
  logStandup(summary: string, goalsDiscussed: string[], energy?: number): void {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);

    const goalTags = goalsDiscussed.map(id => `#goal/${id}`).join(' ');
    const energyLine = energy ? `\n**Energy:** ${energy}/10` : '';

    const entry = `## Coach - ${date} ${time} #standup

${summary}

**Goals:** ${goalTags}${energyLine}`;

    this.obsidian.appendStandupToDaily(date, {
      date,
      time,
      goalsReviewed: goalsDiscussed,
      updates: [],
      blockers: [],
      energy,
      notes: summary,
    });
  }

  /**
   * Append a thought or reflection to today's daily note
   */
  logThought(thought: string, tags: string[] = []): void {
    const date = new Date().toISOString().split('T')[0];
    const dailyNotePath = join(
      this.obsidian['dailyNotesPath'],
      `${date}.md`
    );

    const tagString = tags.length > 0 ? ' ' + tags.join(' ') : '';
    const entry = `\n\n## Coach Reflection\n\n${thought}${tagString}`;

    if (existsSync(dailyNotePath)) {
      const existing = readFileSync(dailyNotePath, 'utf-8');
      writeFileSync(dailyNotePath, existing + entry, 'utf-8');
    } else {
      writeFileSync(dailyNotePath, entry.trim(), 'utf-8');
    }
  }
}

/**
 * Convenience function to format goal summary for display
 */
export function formatGoalSummary(goal: Goal): string {
  const statusEmoji = {
    'not-started': '⚪',
    'in-progress': '🔵',
    'blocked': '🔴',
    'completed': '✅',
    'paused': '⏸️',
  }[goal.metadata.status] || '⚪';

  const blockers = goal.blockers.length
    ? `\n  **Blockers:** ${goal.blockers.join(', ')}`
    : '';

  const nextActions = goal.nextActions.length > 0
    ? `\n  **Next:** ${goal.nextActions.slice(0, 2).join(', ')}`
    : '';

  return `${statusEmoji} **${goal.title}** (${goal.metadata.progress}%)
  Status: ${goal.metadata.status} | Last updated: ${goal.metadata.lastUpdated}${blockers}${nextActions}`;
}

/**
 * Format multiple goals into a readable list
 */
export function formatGoalsList(goals: Goal[]): string {
  if (goals.length === 0) {
    return 'No goals found.';
  }

  return goals.map(formatGoalSummary).join('\n\n');
}
