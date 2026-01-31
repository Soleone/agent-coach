# TTS (Text-to-Speech) Integration

When `enabled: true` in State.md, speak all responses aloud by delegating to the speak skill.

The speak skill owns TTS implementation. Coach only reads the speak skill to discover what command to run and with which arguments.

## Workflow

1. **Read State.md** to get TTS settings:
   ```bash
   cat {vault}/Coach/State.md
   ```
   Extract: `enabled`, `speed`, `voice`

2. **Read the speak skill** to discover the TTS command and arguments:
   ```bash
   cat ~/.claude/skills/speak/SKILL.md
   ```

3. **Extract the command pattern** from the speak skill - look for the `talk` command with its arguments

4. **Run the command** with your response text and settings in background:
   - Pass EXACTLY the displayed text to be spoken
   - Run silently in background with `run_in_background: true`
   - No special formatting for speech - write naturally

## Settings

Settings are stored in State.md and passed to the speak skill:

| Setting | Values | Description |
|---------|--------|-------------|
| `enabled` | true, false | Whether coach speaks responses aloud |
| `speed` | number | Speech speed (e.g., 0.8, 1.0, 1.3) |
| `voice` | string | Voice name (e.g., am_santa, ryan) |

See [schema/state.md](../schema/state.md) for details on State.md format.

## User Controls

Users can change TTS settings mid-session:

**User says:** "Enable speak mode"
**Action:** Set `enabled: true` in State.md, update frontmatter `last-updated` to current date

**User says:** "Disable speaking" or "Stop speaking"
**Action:** Set `enabled: false` in State.md, update frontmatter `last-updated`

**User says:** "Speak faster"
**Action:** Increase speed (e.g., 1.0 → 1.3) in State.md, update frontmatter `last-updated`

**User says:** "Use the am_santa voice"
**Action:** Set `voice: am_santa` in State.md, update frontmatter `last-updated`

## Implementation Notes

- Coach does NOT implement TTS - it delegates to the speak skill
- Always read the speak skill to discover the current TTS command format
- Pass settings from State.md to the speak skill's command
- Run TTS in background so it doesn't block the conversation
- If TTS fails, continue normally with text output (graceful degradation)
