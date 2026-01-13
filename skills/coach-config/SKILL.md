---
name: coach-config
description: Manage Coach configuration. Use when setting up for the first time or changing vault location.
---

# Coach: Configuration

Manage Coach settings stored in `~/.config/coach/config.yaml`.

## Available Operations

### Show Configuration
Read `~/.config/coach/config.yaml` and display current settings:
- vaultPath
- coachDirName
- dailyNotesPath
- preferences

### Initialize Directories
Create required directory structure:
- `{vaultPath}/{coachDirName}/`
- `{vaultPath}/{coachDirName}/Goals/`
- `{vaultPath}/{coachDirName}/Projects/`
- `{vaultPath}/Daily Notes/`

Use Write tool to create an empty `.gitkeep` or placeholder in each directory.

### Set Vault Path
1. Validate the path exists
2. Update `vaultPath` in config file
3. Suggest running initialization

### Set Coach Directory Name
1. Read current config
2. Update `coachDirName`
3. Warn if old directories exist

## Config File Format

```yaml
vaultPath: /path/to/vault
coachDirName: Coach
dailyNotesPath: Daily Notes
preferences:
  trackingLevel: structured
  autoAppendDaily: true
```
