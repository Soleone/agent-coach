# Triggers - Pattern Dispatch Table

User statement patterns → procedure mapping. Use this to detect what actions to take based on user input.

## Entity Type Classification

When users describe goals, projects, or interests, classify them appropriately:

| User Says | Entity Type | Action |
|-----------|-------------|--------|
| "I want to learn X", "become Y", "improve at Z" | **Goal** | Create in `Coach/Goals/*.md` |
| "I'm building X", "shipping Y", "working on Z" | **Project** | Create in `Coach/Projects/*.md` |
| "I'm curious about X", "learning about Y", "getting into Z" | **Interest** | Create in `Coach/Interests/*.md` |
| "What if I...", "Maybe I should...", "Idea: X" | **Idea** | Prepend to `Coach/Ideas.md` |
| "I think...", "I noticed...", "Feeling..." | **Thought** | Prepend to `Coach/Thoughts.md` |
| "I need to...", "TODO: X", "reminder to Y" | **Task** | Append to journal with `#task` or use beads if project has `.beads` |
| "I finished...", "Made progress on..." | **Update** | Edit existing entity file |
| "I'm stuck on...", "Blocked by..." | **Blocker** | Add to entity's Blockers section |

**Procedure:** [procedures/entity-lifecycle.md](procedures/entity-lifecycle.md)

## Settings Changes

When users mention settings or preferences:

| User Says | Action | Update Location |
|-----------|--------|-----------------|
| "speak", "talk", "enable speak mode", "enable TTS" | Enable TTS | State.md: `enabled: true` |
| "stop speaking", "disable speaking", "quiet", "mute" | Disable TTS | State.md: `enabled: false` |
| "speak faster", "speed up" | Increase speed | State.md: `speed: [current + 0.2]` |
| "speak slower", "slow down" | Decrease speed | State.md: `speed: [current - 0.2]` |
| "use X voice", "change voice to X" | Change voice | State.md: `voice: X` |
| "my projects are in X", "project directory is X" | Set project roots | State.md: `project-roots: X` |
| "scan roots are X", "use $CODE and $TRIES for activity scan" | Set activity scan roots | State.md: `activity-scan-roots: X` |

**Procedure:** [schema/state.md](schema/state.md) (sync on update section)

## Beads Context Detection

When users discuss projects, check if beads integration applies:

| Scenario | Action |
|----------|--------|
| User mentions project with `location` field | Check if `.beads` directory exists in location |
| `.beads` exists | Use beads commands for all task operations |
| `.beads` doesn't exist | Use markdown `# Tasks` section |
| Creating new project | Attempt location auto-discovery from `project-roots` |

**Procedure:** [integrations/beads.md](integrations/beads.md)

## Code Activity Scan Detection

When users ask to inspect coding activity from repositories:

| User Says | Action |
|-----------|--------|
| "scan $CODE", "what changed in my repos", "summarize recent commits", "log git activity" | Run standardized code activity scan and journal workflow |
| "auto-journal commits", "track coding activity daily" | Use commit-level entries with commit timestamps and dedupe markers |

**Procedure:** [procedures/activity-scanning.md](procedures/activity-scanning.md)

## Past Event Detection

When users mention events from the past, route to historical journal pages:

| User Says | Calculate Date | Target File |
|-----------|----------------|-------------|
| "yesterday" | `date -d "yesterday" +"%Y-%m-%d"` | `{journals}/[DATE].md` |
| "last Monday", "last Tuesday", etc. | `date -d "last [DAY]" +"%Y-%m-%d"` | `{journals}/[DATE].md` |
| "N days ago" | `date -d "N days ago" +"%Y-%m-%d"` | `{journals}/[DATE].md` |
| "on January 10th", absolute dates | Parse and format to YYYY-MM-DD | `{journals}/[DATE].md` |

**Procedure:** [procedures/diary-routing.md](procedures/diary-routing.md) (date detection section)

## Entity Context Detection

When users reference existing entities (explicitly or implicitly):

| Reference Type | Examples | Action |
|----------------|----------|--------|
| **Explicit mention** | "my Rust project", "the meditation goal" | Match against existing entities, route to entity log |
| **Pronouns with context** | "I'm stuck on it" (after discussing project) | Use most recently discussed entity |
| **Topic continuation** | "Made more progress" (continuing topic) | Update most recently discussed entity |
| **Keywords** | Technical terms, project names | Match against entity titles using normalized comparison |

**Procedure:** [procedures/diary-routing.md](procedures/diary-routing.md) (entity context detection section)

## Smart Routing Decision

| Entry Type | Routing Destination |
|------------|---------------------|
| Routine entity update | Entity `# Log` only |
| Significant milestone | Entity `# Log` + Journal reference |
| New entity mention | Check existing entities → create if no match |
| General reflection | Journal `# Coach` section |
| Multiple entities involved | Route to each entity log + optional journal reference |

**Procedure:** [procedures/diary-routing.md](procedures/diary-routing.md)
