import { Command } from 'commander';
import { ConfigManager } from './config.js';
import { join } from 'path';

const program = new Command();

program
  .name('coach')
  .description('Goal coaching assistant')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize directory structure')
  .action(() => {
    const config = new ConfigManager();
    config.ensureDirectories();
    console.log('Created directories:');
    console.log(`  - ${config.getGoalsPath()}`);
    console.log(`  - ${join(config.getGoalsPath(), '..', 'Projects')}`);
    console.log(`  - ${config.getDailyNotesPath()}`);
  });

program
  .command('config')
  .description('Show current configuration')
  .action(() => {
    const config = new ConfigManager();
    const cfg = config.get();
    console.log(`Vault Path:       ${cfg.vaultPath}`);
    console.log(`Coach Directory:  ${cfg.coachDirName}`);
    console.log(`Daily Notes:      ${cfg.dailyNotesPath}`);
  });

program
  .command('config set-vault <path>')
  .description('Set vault path')
  .action((path: string) => {
    const config = new ConfigManager();
    config.save({ vaultPath: path });
    console.log(`Vault path: ${path}`);
  });

program.parse();
