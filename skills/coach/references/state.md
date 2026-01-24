# State Format

Coach state is stored in `{vault}/Coach/State.md` to persist settings and preferences across sessions.

## Structure

```markdown
# Coach State

Last updated: 2026-01-24

## Speak Settings

- enabled: true
- speed: 1.1
- persona: ryan
- persona-description: ""

## Preferences

(Future settings can go here)
```

## Speak Settings

Settings for TTS integration. Values are passed to the speak skill's TTS command.

| Setting | Values | Description |
|---------|--------|-------------|
| `enabled` | true, false | Whether coach speaks responses aloud |
| `speed` | number | Speech speed (passed to speak skill) |
| `persona` | string | Voice name (passed to speak skill) |
| `persona-description` | string | Custom voice description (passed to speak skill) |

**Note:** TTS implementation is delegated to the speak skill. Settings are read from State.md and passed to the speak skill's command. See `~/.claude/skills/speak/SKILL.md` for available options.

## Updates

**When to update:**
- User explicitly changes a setting ("enable speaking", "speak faster", "use vivian voice")
- User implicitly indicates a preference ("that's too slow" → increase speed)

**How to update:**
1. Read `{vault}/Coach/State.md` (create if doesn't exist)
2. Update the specific setting value
3. Update `Last updated:` timestamp with current date
4. Write the file back

**Default state (if file doesn't exist):**
```markdown
# Coach State

Last updated: 2026-01-24

## Speak Settings

- enabled: false
- speed: 1.1
- persona: ryan
- persona-description: ""
```

## Reading State

At session start, read `{vault}/Coach/State.md`:
- Extract TTS settings: `enabled`, `speed`, `persona`, `persona-description`
- If `enabled: true`, read the speak skill to discover the TTS command
- Pass the settings to the speak skill's TTS command
- If `false` or missing, don't speak

## Examples

**User says:** "Enable speak mode"
**Action:** Set `enabled: true`, update timestamp

**User says:** "Disable speaking"
**Action:** Set `enabled: false`, update timestamp

**User says:** "Speak faster"
**Action:** Increase speed (e.g., 1.1 → 1.3), update timestamp

**User says:** "Use a different voice"
**Action:** Set `persona: vivian`, update timestamp
