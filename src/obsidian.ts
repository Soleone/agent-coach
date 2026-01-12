import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';
import matter from 'gray-matter';
import { Goal, GoalMetadata, GoalStatus, Milestone, StandupUpdate } from './models.js';

export class ObsidianManager {
  constructor(private goalsPath: string, private dailyNotesPath: string) {}

  // Parse a goal markdown file
  parseGoal(filePath: string): Goal | null {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const { data, content: body } = matter(content);

      const id = basename(filePath, '.md');
      const titleMatch = body.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : id;

      const metadata: GoalMetadata = {
        status: (data.status as GoalStatus) || 'not-started',
        created: data.created || new Date().toISOString().split('T')[0],
        target: data.target,
        progress: data.progress || 0,
        tags: data.tags || [],
        lastUpdated: data.lastUpdated || data.created || new Date().toISOString().split('T')[0],
      };

      const milestones = this.parseMilestones(body);
      const currentStatus = this.extractSection(body, 'Current Status') || '';
      const blockers = this.extractBlockers(currentStatus);
      const nextActions = this.extractNextActions(body);

      return {
        id,
        title,
        metadata,
        milestones,
        currentStatus,
        blockers,
        nextActions,
        content: body,
      };
    } catch (error) {
      console.error(`Failed to parse goal from ${filePath}:`, error);
      return null;
    }
  }

  // Write a goal to markdown
  writeGoal(goal: Goal): void {
    const filePath = join(this.goalsPath, `${goal.id}.md`);

    const frontmatter = {
      status: goal.metadata.status,
      created: goal.metadata.created,
      target: goal.metadata.target,
      progress: goal.metadata.progress,
      tags: goal.metadata.tags,
      lastUpdated: goal.metadata.lastUpdated,
    };

    const milestones = goal.milestones.map(m =>
      `- [${m.completed ? 'x' : ' '}] ${m.description}${m.targetDate ? ` (${m.targetDate})` : ''}`
    ).join('\n');

    const nextActions = goal.nextActions.map(a => `- [ ] ${a}`).join('\n');

    const content = `---
${Object.entries(frontmatter).map(([k, v]) => {
  if (v === undefined) return '';
  if (Array.isArray(v)) return `${k}: [${v.join(', ')}]`;
  return `${k}: ${v}`;
}).filter(Boolean).join('\n')}
---

# ${goal.title}

## Milestones
${milestones || '- No milestones yet'}

## Current Status
**Last updated:** ${goal.metadata.lastUpdated}
${goal.currentStatus}
${goal.blockers.length ? `\n**Blockers:**\n${goal.blockers.map(b => `- ${b}`).join('\n')}` : ''}

## Next Actions
${nextActions || '- No next actions defined'}
`;

    writeFileSync(filePath, content, 'utf-8');
  }

  // Load all goals
  loadGoals(): Goal[] {
    if (!existsSync(this.goalsPath)) {
      return [];
    }

    const files = readdirSync(this.goalsPath).filter(f => f.endsWith('.md'));
    return files
      .map(f => this.parseGoal(join(this.goalsPath, f)))
      .filter((g): g is Goal => g !== null);
  }

  // Append standup to daily note
  appendStandupToDaily(date: string, update: StandupUpdate): void {
    const dailyNotePath = join(this.dailyNotesPath, `${date}.md`);

    const standupSection = this.formatStandupSection(update);

    if (existsSync(dailyNotePath)) {
      const existing = readFileSync(dailyNotePath, 'utf-8');
      const updated = existing + '\n\n' + standupSection;
      writeFileSync(dailyNotePath, updated, 'utf-8');
    } else {
      writeFileSync(dailyNotePath, standupSection, 'utf-8');
    }
  }

  private formatStandupSection(update: StandupUpdate): string {
    const goalTags = update.goalsReviewed.map(id => `#goal/${id}`).join(' ');
    const updates = update.updates.map(u => {
      const progress = u.progressChange
        ? `${u.progressChange.from}% → ${u.progressChange.to}%`
        : '';
      const changes = u.updates.join(', ');
      const resolved = u.blockersResolved?.length
        ? ` (✅ resolved: ${u.blockersResolved.join(', ')})`
        : '';
      return `- ${u.goalTitle}: ${progress} ${changes}${resolved}`.trim();
    }).join('\n');

    const blockers = update.blockers.length
      ? `\n**Blockers:** ${update.blockers.join(', ')}`
      : '\n**Blockers:** None';

    const energy = update.energy ? `\n**Energy:** ${update.energy}/10` : '';
    const notes = update.notes ? `\n\n${update.notes}` : '';

    return `## Coach - ${update.date} ${update.time} #standup

**Goals reviewed:** ${goalTags}
${updates}
${blockers}${energy}${notes}`;
  }

  private parseMilestones(content: string): Milestone[] {
    const section = this.extractSection(content, 'Milestones');
    if (!section) return [];

    const milestoneRegex = /^- \[([ x])\]\s+(.+?)(?:\s+\(([^)]+)\))?$/gm;
    const milestones: Milestone[] = [];
    let match;

    while ((match = milestoneRegex.exec(section)) !== null) {
      milestones.push({
        description: match[2].trim(),
        targetDate: match[3],
        completed: match[1] === 'x',
      });
    }

    return milestones;
  }

  private extractBlockers(statusText: string): string[] {
    const blockerMatch = statusText.match(/\*\*Blockers?:\*\*\s*\n((?:- .+\n?)+)/i);
    if (!blockerMatch) return [];

    return blockerMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());
  }

  private extractNextActions(content: string): string[] {
    const section = this.extractSection(content, 'Next Actions');
    if (!section) return [];

    return section
      .split('\n')
      .filter(line => line.trim().startsWith('- [ ]'))
      .map(line => line.replace(/^-\s*\[\s*\]\s*/, '').trim());
  }

  private extractSection(content: string, heading: string): string | null {
    const regex = new RegExp(`##\\s+${heading}\\s*\n([\\s\\S]*?)(?=\n##|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  }
}
