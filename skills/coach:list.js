#!/usr/bin/env node

/**
 * List all goals
 * Usage: /coach:list
 */

import { ConfigManager } from '../dist/config.js';
import { ObsidianManager } from '../dist/obsidian.js';
import { formatGoalsList } from '../dist/helpers.js';

const config = new ConfigManager();
const obsidian = new ObsidianManager(config.getGoalsPath(), config.getDailyNotesPath());
const goals = obsidian.loadGoals();

if (goals.length === 0) {
  console.log('No goals found. Create some goals in your Obsidian vault under Coach/Goals/');
  process.exit(0);
}

console.log('# Your Goals\n');
console.log(formatGoalsList(goals));
