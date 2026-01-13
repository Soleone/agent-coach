---
name: coach-config
description: Manage Claude Coach configuration including Obsidian vault path, coach directory name, and initialization. Use when setting up for the first time or changing vault location.
---

# Coach: Configuration

Manage configuration and initialize directory structure in Obsidian vault.

## Config File

Location: `~/.config/claude-coach/config.yaml`

Contains: `vaultPath`, `coachDirName`, `dailyNotesPath`, `preferences`

## Instructions

### Show Configuration

Read and display settings from `~/.config/claude-coach/config.yaml`. If file doesn't exist, show defaults.

### Initialize Directories

1. Read `vaultPath` from config
2. Create if missing:
   - `{vaultPath}/{coachDirName}/`
   - `{vaultPath}/{coachDirName}/Goals/`
   - `{vaultPath}/{coachDirName}/Projects/`
   - `{vaultPath}/Daily Notes/`
3. Confirm with full paths

### Set Vault Path

1. Validate path exists
2. Update or create config file with new `vaultPath`
3. Suggest running initialization

### Set Coach Directory Name

1. Read current config
2. Update `coachDirName` field
3. Warn if old directories exist

## Operations

Use Write/Edit tools to modify config file. Create with defaults if doesn't exist.
