import Anthropic from '@anthropic-ai/sdk';
import { Goal, StandupUpdate, GoalUpdate, GoalStatus } from './models.js';
import { ObsidianManager } from './obsidian.js';

export interface CoachOptions {
  apiKey?: string;
  model?: string;
  obsidianManager: ObsidianManager;
}

export class CoachEngine {
  private client: Anthropic;
  private model: string;
  private obsidian: ObsidianManager;

  constructor(options: CoachOptions) {
    this.client = new Anthropic({
      apiKey: options.apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.model = options.model || 'claude-sonnet-4-5-20250929';
    this.obsidian = options.obsidianManager;
  }

  async runStandup(): Promise<StandupUpdate> {
    const goals = this.obsidian.loadGoals();
    const activeGoals = goals.filter(g => g.metadata.status === 'in-progress' || g.metadata.status === 'blocked');

    if (activeGoals.length === 0) {
      console.log('\nNo active goals found. Would you like to set some goals first?');
      throw new Error('No active goals');
    }

    const standupPrompt = this.buildStandupPrompt(activeGoals);
    const conversation = await this.conductStandup(standupPrompt, activeGoals);

    return conversation;
  }

  private buildStandupPrompt(goals: Goal[]): string {
    const goalsSummary = goals.map(g => {
      const blockers = g.blockers.length ? `\n  Blockers: ${g.blockers.join(', ')}` : '';
      return `- **${g.title}** (${g.metadata.progress}%, ${g.metadata.status})${blockers}
  Next actions: ${g.nextActions.slice(0, 3).join(', ') || 'None defined'}`;
    }).join('\n\n');

    return `You are a proactive coaching assistant conducting a daily standup.

Current active goals:
${goalsSummary}

Your role:
1. Review each goal briefly with the user
2. Ask what progress was made (if any)
3. Identify any new blockers or resolved blockers
4. Update progress percentage if applicable
5. Confirm or update next actions
6. Ask about energy level (1-10)

Be concise and conversational. Focus on forward momentum. Extract structured data from the conversation for tracking.

Begin the standup now.`;
  }

  private async conductStandup(systemPrompt: string, goals: Goal[]): Promise<StandupUpdate> {
    const messages: Anthropic.MessageParam[] = [];

    console.log('\n🎯 Daily Standup\n');

    // Initial greeting
    const greeting = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: "Let's do standup" }],
    });

    const assistantMessage = greeting.content[0].type === 'text' ? greeting.content[0].text : '';
    console.log(`Coach: ${assistantMessage}\n`);

    messages.push(
      { role: 'user', content: "Let's do standup" },
      { role: 'assistant', content: greeting.content }
    );

    // Interactive conversation
    // For now, we'll create a simplified version that returns mock data
    // In practice, this would use a proper CLI interface like inquirer

    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);

    // Placeholder: In real implementation, this would be extracted from conversation
    const update: StandupUpdate = {
      date,
      time,
      goalsReviewed: goals.map(g => g.id),
      updates: goals.map(g => ({
        goalId: g.id,
        goalTitle: g.title,
        progressChange: undefined,
        statusChange: undefined,
        updates: [],
        blockersResolved: [],
        newBlockers: [],
      })),
      blockers: [],
      energy: undefined,
    };

    return update;
  }

  async elicitGoals(): Promise<Goal[]> {
    const prompt = `You are a coaching assistant helping the user define their goals.

Guide them through:
1. What areas of their life/work they want to focus on
2. Specific, measurable goals in those areas
3. Target dates for completion
4. Initial milestones (2-4 per goal)
5. First next actions

Be encouraging but concise. Help them create 1-3 goals to start.

Begin the conversation now.`;

    console.log('\n🎯 Goal Setting Session\n');

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: prompt,
      messages: [{ role: 'user', content: "Help me set some goals" }],
    });

    const message = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log(`Coach: ${message}\n`);

    // Placeholder: would conduct full conversation and extract goals
    return [];
  }

  async reviewGoal(goalId: string): Promise<void> {
    const goals = this.obsidian.loadGoals();
    const goal = goals.find(g => g.id === goalId);

    if (!goal) {
      throw new Error(`Goal not found: ${goalId}`);
    }

    const prompt = `You are reviewing progress on a goal with the user.

Goal: ${goal.title}
Status: ${goal.metadata.status} (${goal.metadata.progress}%)
Created: ${goal.metadata.created}
Target: ${goal.metadata.target || 'No target date'}

Milestones:
${goal.milestones.map(m => `- [${m.completed ? 'x' : ' '}] ${m.description}`).join('\n')}

Current blockers:
${goal.blockers.length ? goal.blockers.map(b => `- ${b}`).join('\n') : 'None'}

Next actions:
${goal.nextActions.length ? goal.nextActions.map(a => `- ${a}`).join('\n') : 'None'}

Conduct a focused review:
1. Celebrate progress
2. Discuss any blockers
3. Adjust milestones if needed
4. Clarify next actions

Be supportive and action-oriented.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: prompt,
      messages: [{ role: 'user', content: `Let's review my goal: ${goal.title}` }],
    });

    const message = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log(`\n🎯 Reviewing: ${goal.title}\n`);
    console.log(`Coach: ${message}\n`);
  }
}
