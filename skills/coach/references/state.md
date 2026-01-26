# State Format

Coach state is stored in `{vault}/Coach/State.md` to persist settings and preferences across sessions.

## Format: Hybrid Frontmatter + Markdown

The state file uses YAML frontmatter for metadata, with markdown sections for settings. This provides both machine-parseable structure and human readability.

## Structure

```markdown
---
last-updated: 2026-01-25
---

## Speak Settings

- enabled: true
- speed: 1.0
- voice: am_santa

## Preferences

(Future settings can go here)
```

## Sections

### YAML Frontmatter

Contains metadata about the state file itself:

| Field | Type | Description |
|-------|------|-------------|
| `last-updated` | date (YYYY-MM-DD) | Date when state was last modified |

### Speak Settings

Settings for TTS integration. Values are passed to the speak skill's TTS command.

| Setting | Values | Description |
|---------|--------|-------------|
| `enabled` | true, false | Whether coach speaks responses aloud |
| `speed` | number | Speech speed (e.g., 0.8, 1.0, 1.3) |
| `voice` | string | Voice name (e.g., am_santa, ryan) |

**Note:** TTS implementation is delegated to the speak skill. Settings are read from State.md and passed to the speak skill's command. See `~/.claude/skills/speak/SKILL.md` for available voice options.

### Preferences

Reserved for future coach-wide settings such as:
- Projects root directory
- Time/date format preferences
- Default journal location overrides
- Custom personality settings

## Updates

**When to update:**
- User explicitly changes a setting ("enable speaking", "speak faster", "use am_santa voice")
- User implicitly indicates a preference ("that's too slow" → increase speed)

**How to update:**
1. Read `{vault}/Coach/State.md` (create if doesn't exist using default below)
2. Update the specific setting value in the appropriate section
3. Update `last-updated:` in frontmatter with current date (YYYY-MM-DD format)
4. Write the file back

**Default state (if file doesn't exist):**
```markdown
---
last-updated: 2026-01-25
---

## Speak Settings

- enabled: false
- speed: 1.0
- voice: ryan

## Preferences

(Reserved for future settings)
```

## Reading State

At session start, read `{vault}/Coach/State.md`:
1. Parse YAML frontmatter to get metadata
2. Extract settings from markdown sections using bullet list format
3. If Speak Settings `enabled: true`, read the speak skill to discover the TTS command
4. Pass the settings to the speak skill's TTS command
5. If `enabled: false` or missing, don't speak

## Parsing Guidelines

**For bullet lists:**
- Pattern: `- key: value`
- Extract key-value pairs from lines matching this pattern
- Boolean values: `true`, `false`
- Numbers: parse as float/int
- Strings: everything else

**Example parsing:**
```
- enabled: true      → { enabled: true }
- speed: 1.0         → { speed: 1.0 }
- voice: am_santa    → { voice: "am_santa" }
```

## Examples

**User says:** "Enable speak mode"
**Action:** Set `enabled: true`, update frontmatter `last-updated` to current date

**User says:** "Disable speaking"
**Action:** Set `enabled: false`, update frontmatter `last-updated`

**User says:** "Speak faster"
**Action:** Increase speed (e.g., 1.0 → 1.3), update frontmatter `last-updated`

**User says:** "Use the am_santa voice"
**Action:** Set `voice: am_santa`, update frontmatter `last-updated`

## Future Extensions

When adding new settings categories:

1. **Create new section:** Add `## Section Name` header
2. **Use bullet list format:** `- key: value`
3. **Document in this file:** Add section description above
4. **Update SKILL.md:** Reference the new settings where relevant

Example:
```markdown
## Projects

- root: ~/projects
- default-location: ~/projects/personal
- auto-detect-bd: true
```
