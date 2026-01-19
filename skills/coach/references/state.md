# State Format

Coach state is stored in `{vault}/Coach/State.md` to persist settings and preferences across sessions.

## Structure

```markdown
# Coach State

Last updated: 2026-01-18

## Speak Settings

- speakEnabled: true
- voice: Kristin
- personality: default
- language: english
- speed: 1x
- verbosity: medium
- backgroundMusic: off
- reverb: off

## Preferences

(Future settings can go here)
```

## Speak Settings

| Setting | Values | Description |
|---------|--------|-------------|
| `speakEnabled` | true, false | Whether coach speaks responses aloud |
| `voice` | Voice name | TTS voice (e.g., "Kristin", "Jenny", "Tracy") |
| `personality` | default, flirty, sarcastic, pirate, robot, zen | TTS personality style |
| `language` | english, spanish, french, german, etc. | Language for spoken responses |
| `speed` | 0.5x, 1x, 2x, 3x, slow, normal, fast, faster | Speech speed |
| `verbosity` | low, medium, high | How much coach speaks while working |
| `backgroundMusic` | off, track name | Background music track (e.g., "flamenco", "celtic") |
| `reverb` | off, light, medium, heavy, cathedral | Reverb level for voice |

## Updates

**When to update:**
- User explicitly changes a setting ("set voice to Jenny", "disable speaking", "use fast speed")
- User implicitly indicates a preference ("that's too slow" → increase speed)

**How to update:**
1. Read `{vault}/Coach/State.md` (create if doesn't exist)
2. Update the specific setting value
3. Update `Last updated:` timestamp with current date
4. Write the file back

**Default state (if file doesn't exist):**
```markdown
# Coach State

Last updated: 2026-01-18

## Speak Settings

- speakEnabled: false
- voice: default
- personality: default
- language: english
- speed: 1x
- verbosity: medium
- backgroundMusic: off
- reverb: off
```

## Reading State

At session start, read `{vault}/Coach/State.md` to apply user preferences:
- If `speakEnabled: true`, use TTS for responses
- Apply voice, personality, language, speed settings via AgentVibes tools
- Respect verbosity level when deciding what to speak

## Examples

**User says:** "Enable speak mode"
**Action:** Set `speakEnabled: true`, update timestamp

**User says:** "Use Jenny's voice"
**Action:** Set `voice: Jenny`, update timestamp, call `mcp__agentvibes__set_voice` tool

**User says:** "Speak faster"
**Action:** Increase speed (1x → 2x), update timestamp, call `mcp__agentvibes__set_speed` tool

**User says:** "That's too much talking"
**Action:** Set `verbosity: low`, update timestamp, call `mcp__agentvibes__set_verbosity` tool
