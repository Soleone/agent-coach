# State Format

Coach state is stored in `{vault}/Coach/State.md` to persist settings and preferences across sessions.

## Structure

```markdown
# Coach State

Last updated: 2026-01-18

## Speak Settings

- enabled: true
- speed: 1.2
- language: en-us
- model: am_adam

## Preferences

(Future settings can go here)
```

## Speak Settings

Settings for Kokoro TTS integration (via speak skill):

| Setting | Values | Description |
|---------|--------|-------------|
| `enabled` | true, false | Whether coach speaks responses aloud |
| `speed` | 0.5 to 2.0 | Speech speed (1.0 = normal, 1.2 = faster, 0.8 = slower) |
| `language` | en-us, en-gb, fr-fr, it, ja, cmn | Language code for TTS |
| `model` | Voice name | Kokoro voice model (see available voices below) |

### Available Voice Models

**American English Male:**
- `am_adam` - American male (recommended default)
- `am_michael`, `am_eric`, `am_liam`, `am_onyx`, `am_echo`, `am_fenrir`, `am_puck`, `am_santa`

**American English Female:**
- `af_sarah` - American female (Kokoro default)
- `af_bella`, `af_nova`, `af_sky`, `af_river`, `af_jessica`, `af_nicole`, `af_heart`, `af_alloy`, `af_aoede`, `af_kore`

**British English:**
- Male: `bm_george`, `bm_daniel`, `bm_lewis`, `bm_fable`
- Female: `bf_alice`, `bf_emma`, `bf_isabella`, `bf_lily`

**Other Languages:**
- Japanese: `jf_alpha`, `jm_kumo`, etc.
- Chinese Mandarin: `zf_xiaobei`, `zf_xiaoni`, etc.
- French, Italian (see `speak-kokoro --list-voices`)

## Updates

**When to update:**
- User explicitly changes a setting ("enable speaking", "use male voice", "speak faster")
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

- enabled: false
- speed: 1.0
- language: en-us
- model: af_sarah
```

## Reading State

At session start, read `{vault}/Coach/State.md` to apply user preferences:
- If `enabled: true`, invoke the speak skill to enable persistent speak mode
- Pass speed, language, and model settings to the speak skill

## Examples

**User says:** "Enable speak mode"
**Action:** Set `enabled: true`, update timestamp, invoke speak skill

**User says:** "Use a British male voice"
**Action:** Set `model: bm_george`, update timestamp

**User says:** "Speak faster"
**Action:** Increase speed (1.2 → 1.5), update timestamp

**User says:** "Disable speaking"
**Action:** Set `enabled: false`, update timestamp, disable speak skill
