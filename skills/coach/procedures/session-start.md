# Session Start Procedure

**Execute these steps at the beginning of each coaching session:**

## 1. Get Current Date and Time (DETERMINISTIC)

Always use exact commands for deterministic behavior:

```bash
date +"%Y-%m-%d"    # Date: e.g., "2026-01-18"
date +"%H:%M"       # Time: e.g., "14:30"
date +"%A"          # Weekday: e.g., "Sunday"
date +"%Z"          # Timezone: e.g., "EST"
```

**INTERNAL USE ONLY** - never state the date/time in your output.

## 2. Read State

Read `{vault}/Coach/State.md` to get coach settings and preferences.

See [schema/state.md](../schema/state.md) for format details.

## 3. Check TTS Enabled

Look for `enabled: true` in Speak Settings section:
- If `true`: Read the speak skill to discover the TTS command and arguments
- If `false`: TTS disabled, just output text normally

## 4. Read the Speak Skill

When TTS is enabled, discover TTS implementation:

```bash
cat ~/.claude/skills/speak/SKILL.md
```

Extract the command pattern - look for the `talk` command with its arguments.

See [integrations/tts.md](../integrations/tts.md) for details on invoking TTS.

## 5. Read Journal Entries

**Reading order:**
1. **Today's journal** (`{vault}/{journals}/YYYY-MM-DD.md` for current date) - read first, most important
2. **Previous 2-3 journal entries** - read after today's, most recent first
3. **Next 3 journal entries** - check for appointments/planning (e.g., `{vault}/{journals}/2026-01-19.md`, etc.)

Extract from journal entries:
- `- [ ]` items with `#task` tag - Inline tasks
- Diary entries under `# Coach` header - Notable events, decisions, progress worth remembering

## 6. Read All Entities

Read from these locations in the Obsidian vault:

- `{vault}/Coach/Goals/*.md` - All goal files
- `{vault}/Coach/Projects/*.md` - All project files
- `{vault}/Coach/Interests/*.md` - All interest files
- `{vault}/Coach/Ideas.md` - Actionable seeds
- `{vault}/Coach/Thoughts.md` - Observations and insights

**For Projects with beads integration:**

For each Project file read from `{vault}/Coach/Projects/*.md`:
1. Extract `location` field from frontmatter (e.g., `location: ~/workspace/tries/2026-01-11-agent-coach/`)
2. If `location` exists, check if `.beads` directory exists: `cd <location> && [ -d .beads ] && echo "BEADS" || echo "NO"`
3. If beads exists, load recent task context using these commands from that directory:
   - `cd <location> && bd ready --json` - Get actionable tasks (not blocked, ready to work on)
   - `cd <location> && bd list --status in_progress --json` - Get currently active tasks
   - `cd <location> && bd list --status done --json | head -20` - Get recently completed tasks (limit to recent 20)
4. Parse JSON and incorporate into your understanding of the project's current state
5. Use this context when prioritizing and coaching (e.g., "I see you're working on ac-8jj...")

**Why this matters:**
- Projects using beads have ALL tasks in the beads system, not in markdown
- You need this context to provide relevant coaching
- Recent completions show momentum, in-progress shows current focus, ready shows what's next
- Include task IDs (e.g., ac-8jj) when referencing specific tasks in conversation

See [integrations/beads.md](../integrations/beads.md) for beads command reference.

## 7. Analyze and Score

Score each entity by priority using the prioritization algorithm.

See [behavior/prioritization.md](../behavior/prioritization.md) for scoring criteria and presentation techniques.

## 8. Generate Your OUTPUT Response

This text goes to the user. Use the communication style defined in personality.

See [behavior/personality.md](../behavior/personality.md) for voice and tone guidelines.

## 9. If TTS Enabled: Speak Your Response

Run the speak skill's TTS command with your response in background.

See [integrations/tts.md](../integrations/tts.md) for implementation details.

## 10. Engage Conversationally

Ask questions, offer insights, help prioritize. Use the personality principles:
- Genuine, not generic
- Direct, not diplomatic
- Conversational, not formal
- Honest, not political
- Context-aware, not transactional
- Supportive but not soft

## Referring to Dates

- For recent dates (last 6 days): Use weekday names ("on Monday", "from Thursday")
- For older dates: Use full dates ("on January 10th")
- Never state today's date in your opening - keep it internal
