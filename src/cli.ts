#!/usr/bin/env node

import { Command } from 'commander';
import { ConfigManager } from './config.js';
import { ObsidianManager } from './obsidian.js';
import { CoachEngine } from './coach.js';

const program = new Command();

program
  .name('claude-coach')
  .description('Proactive AI coaching assistant integrated with Obsidian')
  .version('0.1.0');

program
  .command('standup')
  .description('Run daily standup session')
  .action(async () => {
    try {
      const config = new ConfigManager();
      const cfg = config.get();

      if (!cfg.anthropicApiKey && !process.env.ANTHROPIC_API_KEY) {
        console.error('❌ No Anthropic API key found. Set ANTHROPIC_API_KEY or run: claude-coach config set-key');
        process.exit(1);
      }

      const obsidian = new ObsidianManager(config.getGoalsPath(), config.getDailyNotesPath());
      const coach = new CoachEngine({
        apiKey: cfg.anthropicApiKey,
        obsidianManager: obsidian,
      });

      const update = await coach.runStandup();

      // Append to daily note
      if (cfg.preferences.autoAppendDaily) {
        obsidian.appendStandupToDaily(update.date, update);
        console.log(`\n✅ Standup recorded in daily note: ${update.date}.md`);
      }
    } catch (error) {
      console.error('❌ Standup failed:', error);
      process.exit(1);
    }
  });

program
  .command('goals')
  .description('Set new goals with guided conversation')
  .action(async () => {
    try {
      const config = new ConfigManager();
      const cfg = config.get();

      if (!cfg.anthropicApiKey && !process.env.ANTHROPIC_API_KEY) {
        console.error('❌ No Anthropic API key found. Set ANTHROPIC_API_KEY or run: claude-coach config set-key');
        process.exit(1);
      }

      const obsidian = new ObsidianManager(config.getGoalsPath(), config.getDailyNotesPath());
      const coach = new CoachEngine({
        apiKey: cfg.anthropicApiKey,
        obsidianManager: obsidian,
      });

      await coach.elicitGoals();
    } catch (error) {
      console.error('❌ Goal setting failed:', error);
      process.exit(1);
    }
  });

program
  .command('review <goal-id>')
  .description('Review a specific goal')
  .action(async (goalId: string) => {
    try {
      const config = new ConfigManager();
      const cfg = config.get();

      if (!cfg.anthropicApiKey && !process.env.ANTHROPIC_API_KEY) {
        console.error('❌ No Anthropic API key found. Set ANTHROPIC_API_KEY or run: claude-coach config set-key');
        process.exit(1);
      }

      const obsidian = new ObsidianManager(config.getGoalsPath(), config.getDailyNotesPath());
      const coach = new CoachEngine({
        apiKey: cfg.anthropicApiKey,
        obsidianManager: obsidian,
      });

      await coach.reviewGoal(goalId);
    } catch (error) {
      console.error('❌ Review failed:', error);
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
      console.log('No goals found. Run: claude-coach goals');
      return;
    }

    console.log('\n📊 Your Goals:\n');
    goals.forEach(g => {
      const status = g.metadata.status.toUpperCase().padEnd(12);
      const progress = `${g.metadata.progress}%`.padStart(4);
      console.log(`${status} ${progress} ${g.title}`);
      if (g.blockers.length) {
        console.log(`         🚧 Blockers: ${g.blockers.join(', ')}`);
      }
    });
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
    console.log(`API Key Set:      ${cfg.anthropicApiKey ? 'Yes' : 'No (using env)'}`);
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
  .command('set-key <api-key>')
  .description('Set Anthropic API key')
  .action((apiKey: string) => {
    const config = new ConfigManager();
    config.save({ anthropicApiKey: apiKey });
    console.log('✅ API key saved');
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
