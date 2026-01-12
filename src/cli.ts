#!/usr/bin/env node

import { Command } from 'commander';
import { ConfigManager } from './config.js';
import { ObsidianManager } from './obsidian.js';
import { formatGoalsList } from './helpers.js';
import { runCoachSkill } from './skill.js';

const program = new Command();

program
  .name('claude-coach')
  .description('Proactive AI coaching assistant integrated with Obsidian')
  .version('0.1.0');

program
  .command('start')
  .description('Start a coaching session (loads context for Claude Code)')
  .action(async () => {
    try {
      const context = await runCoachSkill({});
      console.log(context);
      console.log('\n\nℹ️  Copy the context above and start a Claude Code session, or use `/coach` skill directly in Claude Code.');
    } catch (error) {
      console.error('❌ Failed to load coaching context:', error);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List all goals')
  .action(() => {
    const config = new ConfigManager();
    const obsidian = new ObsidianManager(config.getGoalsPath(), config.getDailyNotesPath());
    const goals = obsidian.loadGoals();

    if (goals.length === 0) {
      console.log('No goals found. Create some goals in your Obsidian vault under Coach/Goals/');
      return;
    }

    console.log('\n📊 Your Goals:\n');
    console.log(formatGoalsList(goals));
    console.log('');
  });

const configCmd = program
  .command('config')
  .description('Manage configuration');

configCmd
  .command('show')
  .description('Show current configuration')
  .action(() => {
    const config = new ConfigManager();
    const cfg = config.get();
    console.log('\n📋 Current Configuration:\n');
    console.log(`Vault Path:       ${cfg.vaultPath}`);
    console.log(`Coach Directory:  ${cfg.coachDirName}`);
    console.log(`Daily Notes Path: ${cfg.dailyNotesPath}`);
    console.log(`Tracking Level:   ${cfg.preferences.trackingLevel}`);
    console.log(`Auto Daily Note:  ${cfg.preferences.autoAppendDaily}`);
    console.log('');
  });

configCmd
  .command('set-vault <path>')
  .description('Set Obsidian vault path')
  .action((path: string) => {
    const config = new ConfigManager();
    config.save({ vaultPath: path });
    console.log(`✅ Vault path set to: ${path}`);
  });

configCmd
  .command('init')
  .description('Initialize directories in Obsidian vault')
  .action(() => {
    const config = new ConfigManager();
    config.ensureDirectories();
    console.log('✅ Directories initialized:');
    console.log(`   - ${config.getCoachPath()}`);
    console.log(`   - ${config.getGoalsPath()}`);
    console.log(`   - ${config.getProjectsPath()}`);
    console.log(`   - ${config.getDailyNotesPath()}`);
  });

program.parse();
