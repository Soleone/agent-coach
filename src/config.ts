import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { parse, stringify } from 'yaml';
import { homedir } from 'os';

export interface CoachConfig {
  vaultPath: string;
  coachDirName: string;
  dailyNotesPath: string;
  anthropicApiKey?: string;
  preferences: {
    defaultStandupTime?: string;
    trackingLevel: 'minimal' | 'structured' | 'journal-rich';
    autoAppendDaily: boolean;
  };
}

const DEFAULT_CONFIG: CoachConfig = {
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
  private config: CoachConfig;

  constructor(configPath?: string) {
    this.configPath = configPath || join(homedir(), '.config', 'claude-coach', 'config.yaml');
    this.config = this.load();
  }

  private load(): CoachConfig {
    if (!existsSync(this.configPath)) {
      return DEFAULT_CONFIG;
    }

    try {
      const content = readFileSync(this.configPath, 'utf-8');
      return { ...DEFAULT_CONFIG, ...parse(content) };
    } catch (error) {
      console.warn(`Failed to load config from ${this.configPath}, using defaults`);
      return DEFAULT_CONFIG;
    }
  }

  save(config?: Partial<CoachConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    const dir = dirname(this.configPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(this.configPath, stringify(this.config), 'utf-8');
  }

  get(): CoachConfig {
    return { ...this.config };
  }

  getCoachPath(): string {
    return join(this.config.vaultPath, this.config.coachDirName);
  }

  getGoalsPath(): string {
    return join(this.getCoachPath(), 'Goals');
  }

  getProjectsPath(): string {
    return join(this.getCoachPath(), 'Projects');
  }

  getDailyNotesPath(): string {
    return join(this.config.vaultPath, this.config.dailyNotesPath);
  }

  ensureDirectories(): void {
    const paths = [
      this.getCoachPath(),
      this.getGoalsPath(),
      this.getProjectsPath(),
      this.getDailyNotesPath(),
    ];

    for (const path of paths) {
      if (!existsSync(path)) {
        mkdirSync(path, { recursive: true });
      }
    }
  }
}
