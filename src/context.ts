import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { Goal } from './models.js';

export interface DailyNote {
  date: string;
  content: string;
  tags: string[];
  thoughts: string[];
  todos: string[];
  mentions: string[]; // mentioned goals, projects, topics
}

export interface RecentActivity {
  dailyNotes: DailyNote[];
  staleGoals: Goal[]; // not updated in 7+ days
  activeGoals: Goal[];
  recentThemes: string[]; // common tags/topics
  openQuestions: string[]; // questions or uncertainties logged
  recentIdeas: string[]; // ideas or thoughts worth expanding
}

export interface ContextualSuggestion {
  action: string;
  reason: string;
  priority: number; // 1-5, higher = more relevant
  context?: string;
}

export class ContextAnalyzer {
  constructor(
    private dailyNotesPath: string,
    private goalsPath: string,
    private projectsPath: string
  ) {}

  /**
   * Load recent daily notes (last N days)
   */
  loadRecentDailyNotes(days: number = 7): DailyNote[] {
    if (!existsSync(this.dailyNotesPath)) {
      return [];
    }

    const files = readdirSync(this.dailyNotesPath)
      .filter(f => f.endsWith('.md') && /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .sort()
      .reverse()
      .slice(0, days);

    return files.map(f => this.parseDailyNote(join(this.dailyNotesPath, f))).filter((n): n is DailyNote => n !== null);
  }

  /**
   * Parse a daily note to extract thoughts, todos, mentions
   */
  private parseDailyNote(filePath: string): DailyNote | null {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const date = filePath.match(/(\d{4}-\d{2}-\d{2})\.md$/)?.[1] || '';

      // Extract tags
      const tagRegex = /#[\w-\/]+/g;
      const tags = [...new Set(content.match(tagRegex) || [])];

      // Extract thoughts/ideas (lines that look reflective or conceptual)
      const thoughts: string[] = [];
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Look for thought patterns: questions, insights, ideas
        if (
          line.match(/\?$/) || // questions
          line.match(/^(thought|idea|insight|wondering|interesting|maybe|consider):/i) ||
          line.match(/^- .*\?\s*$/) // bullet questions
        ) {
          thoughts.push(line.replace(/^[-*]\s*/, ''));
        }
      }

      // Extract todos
      const todoRegex = /^[-*]\s*\[\s\]\s*(.+)$/gm;
      const todos: string[] = [];
      let match;
      while ((match = todoRegex.exec(content)) !== null) {
        todos.push(match[1]);
      }

      // Extract mentions (goals, projects, topics in #tags)
      const mentions = tags
        .filter(t => t.startsWith('#goal/') || t.startsWith('#project/') || t.startsWith('#topic/'))
        .map(t => t.replace(/^#(goal|project|topic)\//, ''));

      return { date, content, tags, thoughts, todos, mentions };
    } catch (error) {
      return null;
    }
  }

  /**
   * Analyze recent activity to generate contextual suggestions
   */
  analyzeActivity(goals: Goal[], recentNotes: DailyNote[]): ContextualSuggestion[] {
    const suggestions: ContextualSuggestion[] = [];
    const now = new Date();

    // Check for stale goals (no updates in 7+ days)
    goals.forEach(goal => {
      const lastUpdate = new Date(goal.metadata.lastUpdated);
      const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

      if (goal.metadata.status === 'in-progress' && daysSinceUpdate >= 7) {
        suggestions.push({
          action: `Check in on "${goal.title}" - it's been ${daysSinceUpdate} days since last update`,
          reason: 'Goal has gone stale',
          priority: 4,
          context: `Last update: ${goal.metadata.lastUpdated}. Progress: ${goal.metadata.progress}%`,
        });
      }
    });

    // Check for goals mentioned recently in notes
    const recentMentions = new Map<string, number>();
    recentNotes.forEach(note => {
      note.mentions.forEach(mention => {
        recentMentions.set(mention, (recentMentions.get(mention) || 0) + 1);
      });
    });

    recentMentions.forEach((count, goalId) => {
      const goal = goals.find(g => g.id === goalId);
      if (goal) {
        suggestions.push({
          action: `Continue work on "${goal.title}" - you've been thinking about it`,
          reason: `Mentioned ${count} times in recent notes`,
          priority: 5,
          context: `Status: ${goal.metadata.status}, ${goal.metadata.progress}%`,
        });
      }
    });

    // Extract recent thoughts/questions that might warrant discussion
    const recentThoughts = recentNotes
      .flatMap(n => n.thoughts)
      .slice(0, 5);

    if (recentThoughts.length > 0) {
      const latestThought = recentThoughts[0];
      suggestions.push({
        action: `Explore your recent thought: "${latestThought.slice(0, 80)}..."`,
        reason: 'Recent reflection in daily notes',
        priority: 3,
        context: recentNotes[0].date,
      });
    }

    // Check for blocked goals
    const blockedGoals = goals.filter(g => g.metadata.status === 'blocked');
    blockedGoals.forEach(goal => {
      suggestions.push({
        action: `Unblock "${goal.title}" - currently blocked`,
        reason: `Blockers: ${goal.blockers.join(', ')}`,
        priority: 5,
        context: `Let's brainstorm solutions to move forward`,
      });
    });

    // Check for goals with no next actions
    const goalsWithoutActions = goals.filter(
      g => g.metadata.status === 'in-progress' && g.nextActions.length === 0
    );
    goalsWithoutActions.forEach(goal => {
      suggestions.push({
        action: `Define next actions for "${goal.title}"`,
        reason: 'Goal is active but has no next actions defined',
        priority: 4,
      });
    });

    // Sort by priority (descending)
    return suggestions.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Extract common themes from recent activity
   */
  extractThemes(recentNotes: DailyNote[]): string[] {
    const tagCounts = new Map<string, number>();

    recentNotes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    // Return tags that appear in multiple notes
    return Array.from(tagCounts.entries())
      .filter(([_, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, _]) => tag);
  }

  /**
   * Build rich context for coaching session
   */
  buildContext(goals: Goal[]): RecentActivity {
    const recentNotes = this.loadRecentDailyNotes(7);
    const now = new Date();

    const staleGoals = goals.filter(g => {
      const lastUpdate = new Date(g.metadata.lastUpdated);
      const daysSinceUpdate = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
      return g.metadata.status === 'in-progress' && daysSinceUpdate >= 7;
    });

    const activeGoals = goals.filter(
      g => g.metadata.status === 'in-progress' || g.metadata.status === 'blocked'
    );

    const recentThemes = this.extractThemes(recentNotes);

    const openQuestions = recentNotes
      .flatMap(n => n.thoughts.filter(t => t.includes('?')))
      .slice(0, 5);

    const recentIdeas = recentNotes
      .flatMap(n => n.thoughts.filter(t => !t.includes('?')))
      .slice(0, 5);

    return {
      dailyNotes: recentNotes,
      staleGoals,
      activeGoals,
      recentThemes,
      openQuestions,
      recentIdeas,
    };
  }
}
