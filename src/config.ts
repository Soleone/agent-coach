import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { parse, stringify } from 'yaml';
import { homedir } from 'os';

export interface Config {
  vaultPath: string;
  coachDirName: string;
  dailyNotesPath: string;
  preferences: {
    trackingLevel: 'minimal' | 'structured' | 'journal-rich';
    autoAppendDaily: boolean;
  };
}

const DEFAULT_CONFIG: Config = {
  vaultPath: '/mnt/d/data/obsidian-vault',
  coachDirName: 'Coach',
  dailyNotesPath: 'Daily Notes',
  preferences: {
    trackingLevel: 'structured',
    autoAppendDaily: true,
  },
};

export class ConfigManager {
  private configPath: string;
  private config: Config;

  constructor(configPath?: string) {
    this.configPath = configPath || join(homedir(), '.config', 'coach', 'config.yaml');
    this.config = this.load();
  }

  private load(): Config {
    if (!existsSync(this.configPath)) {
      return DEFAULT_CONFIG;
    }
    try {
      const content = readFileSync(this.configPath, 'utf-8');
      return { ...DEFAULT_CONFIG, ...parse(content) };
    } catch {
      return DEFAULT_CONFIG;
    }
  }

  save(config?: Partial<Config>): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    const dir = dirname(this.configPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(this.configPath, stringify(this.config), 'utf-8');
  }

  get(): Config {
    return { ...this.config };
  }

  getGoalsPath(): string {
    return join(this.config.vaultPath, this.config.coachDirName, 'Goals');
  }

  getDailyNotesPath(): string {
    return join(this.config.vaultPath, this.config.dailyNotesPath);
  }

  ensureDirectories(): void {
    const paths = [
      join(this.config.vaultPath, this.config.coachDirName),
      this.getGoalsPath(),
      join(this.config.vaultPath, this.config.coachDirName, 'Projects'),
      this.getDailyNotesPath(),
    ];
    for (const path of paths) {
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    }
  }
}
