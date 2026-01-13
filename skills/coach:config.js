#!/usr/bin/env node

/**
 * Configuration management skill
 * Usage: /coach:config [show|init|set-vault <path>]
 */

import { ConfigManager } from '../dist/config.js';

const args = process.argv.slice(2);
const command = args[0] || 'show';

const config = new ConfigManager();

switch (command) {
  case 'show':
    const cfg = config.get();
    console.log('# Coach Configuration\n');
    console.log(`**Vault Path:** ${cfg.vaultPath}`);
    console.log(`**Coach Directory:** ${cfg.coachDirName}`);
    console.log(`**Daily Notes Path:** ${cfg.dailyNotesPath}`);
    console.log(`**Tracking Level:** ${cfg.preferences.trackingLevel}`);
    console.log(`**Auto Daily Note:** ${cfg.preferences.autoAppendDaily}`);
    break;

  case 'init':
    config.ensureDirectories();
    console.log('✅ Directories initialized:');
    console.log(`   - ${config.getCoachPath()}`);
    console.log(`   - ${config.getGoalsPath()}`);
    console.log(`   - ${config.getProjectsPath()}`);
    console.log(`   - ${config.getDailyNotesPath()}`);
    break;

  case 'set-vault':
    const path = args[1];
    if (!path) {
      console.error('❌ Please provide a vault path: /coach:config set-vault <path>');
      process.exit(1);
    }
    config.save({ vaultPath: path });
    console.log(`✅ Vault path set to: ${path}`);
    break;

  default:
    console.log('Usage: /coach:config [show|init|set-vault <path>]');
    console.log('\nCommands:');
    console.log('  show         - Show current configuration (default)');
    console.log('  init         - Initialize directories in vault');
    console.log('  set-vault    - Set Obsidian vault path');
}
