export type GoalStatus = 'not-started' | 'in-progress' | 'blocked' | 'completed' | 'paused';

export interface Milestone {
  description: string;
  targetDate?: string;
  completed: boolean;
  completedDate?: string;
}

export interface GoalMetadata {
  status: GoalStatus;
  created: string;
  target?: string;
  progress: number; // 0-100
  tags: string[];
  lastUpdated: string;
}

export interface Goal {
  id: string; // slug from filename
  title: string;
  metadata: GoalMetadata;
  milestones: Milestone[];
  currentStatus: string;
  blockers: string[];
  nextActions: string[];
  content?: string; // additional notes/context
}

export interface StandupUpdate {
  date: string;
  time: string;
  goalsReviewed: string[]; // goal IDs
  updates: GoalUpdate[];
  blockers: string[];
  energy?: number; // 1-10
  notes?: string;
}

export interface GoalUpdate {
  goalId: string;
  goalTitle: string;
  progressChange?: { from: number; to: number };
  statusChange?: { from: GoalStatus; to: GoalStatus };
  updates: string[];
  blockersResolved?: string[];
  newBlockers?: string[];
}

export interface CoachingSession {
  timestamp: string;
  type: 'standup' | 'goal-setting' | 'review';
  goals: Goal[];
  updates: StandupUpdate;
}
