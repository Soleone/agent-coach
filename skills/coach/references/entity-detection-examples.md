# Entity Detection Examples

This file demonstrates how to detect and create entities from user conversations.

**IMPORTANT - Timestamps and Dates:**
- Always generate timestamps using `date +"%H:%M"` (24-hour format, local timezone)
- Always generate dates using `date +"%Y-%m-%d"` (local timezone, not UTC)
- Never hardcode timestamps or dates - examples below use placeholders like `HH:MM` and `YYYY-MM-DD`
- All diary entries must use the actual current time when created

## Example 1: Goal + Project in One Statement

**User says:**
> "I want to learn Rust and build a CLI tool with it"

**Coach detects:**
1. Goal: "Learn Rust"
2. Project: "Build CLI tool with Rust"

**Coach actions:**
1. Create `Coach/Goals/Learn Rust.md`:
```markdown
---
type: goal
status: active
created-at: 2026-01-17
updated-at: 2026-01-17
---

# Learn Rust

## Milestones
- [ ] Complete Rust book basics
- [ ] Build first CLI tool
- [ ] Understand ownership and lifetimes

## Current Status
Just started. Excited to learn systems programming.

## Next Actions
- [ ] Download Rust book
- [ ] Set up development environment
```

2. Create `Coach/Projects/Rust CLI Tool.md`:
```markdown
---
type: project
status: active
created-at: 2026-01-17
updated-at: 2026-01-17
---

# Rust CLI Tool

## Goal
Build a practical CLI tool to learn Rust fundamentals.

## Milestones
- [ ] Design tool requirements
- [ ] Implement core functionality
- [ ] Add tests
- [ ] Publish to GitHub

## Current Status
Planning phase. Need to learn Rust basics first.

## Next Actions
- [ ] Decide what kind of CLI tool to build
- [ ] Research Rust CLI frameworks (clap, structopt)
```

3. Append to `{journals}/YYYY-MM-DD.md` under `# Coach` (generate date with `date +"%Y-%m-%d"`):
```markdown
# Coach

- HH:MM: Created [[Coach/Goals/Learn Rust]] goal - wants to learn systems programming
- HH:MM: Created [[Coach/Projects/Rust CLI Tool]] project - will build practical project while learning
```

**Note:** `HH:MM` is generated using `date +"%H:%M"` at interaction time (24-hour format)

## Example 2: Multiple Ideas and Thoughts

**User says:**
> "I've been thinking about starting a meditation practice. Maybe 10 minutes daily? I also had an idea - what if I built a habit tracker app? Oh and I noticed I'm more productive in the mornings."

**Coach detects:**
1. Goal: "Start meditation practice"
2. Idea: "Build habit tracker app"
3. Thought: "More productive in mornings"

**Coach actions:**

1. Create `Coach/Goals/Daily Meditation Practice.md`:
```markdown
---
type: goal
status: active
created-at: 2026-01-17
updated-at: 2026-01-17
---

# Daily Meditation Practice

## Milestones
- [ ] 7 days in a row (2026-01-24)
- [ ] 30 days in a row (2026-02-16)
- [ ] 90 days in a row (2026-04-17)

## Current Status
Planning to start. Thinking 10 minutes daily.

## Next Actions
- [ ] Choose meditation app or technique
- [ ] Set daily reminder
- [ ] Decide on morning or evening slot
```

2. Prepend to `Coach/Ideas.md`:
```markdown
- [[YYYY-MM-DD]]: Build habit tracker app - could help with meditation tracking
```

3. Prepend to `Coach/Thoughts.md`:
```markdown
- [[YYYY-MM-DD]]: More productive in mornings - should schedule important work then
```

4. Append to `{journals}/YYYY-MM-DD.md`:
```markdown
# Coach

- HH:MM: Created [[Coach/Goals/Daily Meditation Practice]] goal - starting with 10min daily
- HH:MM: Captured idea about building habit tracker app - could become a project
- HH:MM: Noted productivity pattern - mornings are most productive time
```

## Example 3: Task Detection

**User says:**
> "I need to email John about the project update and remind myself to review the code changes"

**Coach detects:**
1. Task: "Email John about project update"
2. Task: "Review code changes"

**Coach actions:**

Append to `{journals}/YYYY-MM-DD.md`:
```markdown
- [ ] Email John about project update #task
- [ ] Review code changes #task

# Coach

- HH:MM: Added 2 tasks: email John and review code changes
```

## Example 4: Updating Existing Goal

**User says:**
> "I finished chapter 4 of the Rust book and I finally understand ownership!"

**Coach detects:**
- Progress update on existing Goal: "Learn Rust"
- Notable learning moment (diary-worthy)

**Coach actions:**

1. Edit `Coach/Goals/Learn Rust.md`:
```markdown
---
type: goal
status: active
created-at: 2026-01-17
updated-at: 2026-01-18
---

# Learn Rust

## Milestones
- [x] Complete basics tutorial - Chapter 4 (2026-01-18)
- [ ] Build a CLI tool (2026-03-01)
- [ ] Contribute to OSS project (2026-03-15)

## Current Status
Completed Chapter 4. Had breakthrough understanding ownership concepts.

## Next Actions
- [ ] Complete Chapter 5 (Generics)
- [ ] Do ownership exercises
- [ ] Start planning CLI tool project
```

2. Append to `{journals}/YYYY-MM-DD.md` under `# Coach`:
```markdown
# Coach

- HH:MM: Updated [[Coach/Goals/Learn Rust]] goal to 25% - breakthrough on ownership in Chapter 4, core concept finally clicked
```

## Example 5: Mixed Conversation

**User says:**
> "I'm feeling stuck on my Rust project. Maybe I should try a simpler example first. Also, I want to start contributing to open source."

**Coach detects:**
1. Blocker on existing Project: "Rust CLI Tool"
2. Idea: "Try simpler example first"
3. Goal: "Start contributing to open source"

**Coach actions:**

1. Edit `Coach/Projects/Rust CLI Tool.md`:
```markdown
---
type: project
status: active
created-at: 2026-01-17
updated-at: 2026-01-19
---

# Rust CLI Tool

...

**Blockers:**
- Current approach too complex for learning level
- Need to try simpler example first

## Next Actions
- [ ] Find simpler Rust project tutorial
- [ ] Build confidence with smaller example
- [ ] Return to CLI tool with more experience
```

2. Create `Coach/Goals/Contribute to Open Source.md`:
```markdown
---
type: goal
status: active
created-at: 2026-01-19
updated-at: 2026-01-19
---

# Contribute to Open Source

## Milestones
- [ ] Find beginner-friendly Rust projects (2026-02-01)
- [ ] Make first PR (2026-03-01)
- [ ] Get PR merged (2026-04-01)

## Current Status
Motivated to start contributing but need to build skills first.

## Next Actions
- [ ] Research good-first-issue projects
- [ ] Set up GitHub profile
- [ ] Practice code review on existing PRs
```

3. Prepend to `Coach/Ideas.md`:
```markdown
- [[YYYY-MM-DD]]: Try simpler Rust example before tackling CLI tool
```

4. Append to `{journals}/YYYY-MM-DD.md`:
```markdown
# Coach

- HH:MM: Updated [[Coach/Projects/Rust CLI Tool]] project - too complex for current level
- HH:MM: Captured idea to try simpler example first - good instinct to reduce scope
- HH:MM: Created [[Coach/Goals/Contribute to Open Source]] goal - aligns well with learning Rust
```

## Example 6: Interest Detection

**User says:**
> "I've been getting really into mechanical keyboards lately. Learning about different switch types and layouts."

**Coach detects:**
- Interest: "Mechanical Keyboards"

**Coach actions:**

1. Create `Coach/Interests/Mechanical Keyboards.md`:
```markdown
---
type: interest
status: active
created-at: 2026-01-20
updated-at: 2026-01-20
---

# Mechanical Keyboards

Exploring mechanical keyboard switches, layouts, and builds.

## Notes

- Learning about different switch types
- Interested in custom builds
```

2. Append to `{journals}/YYYY-MM-DD.md` under `# Coach`:
```markdown
# Coach

- HH:MM: Created [[Coach/Interests/Mechanical Keyboards]] interest - exploring switches and layouts
```

## Detection Patterns Summary

| Pattern | Entity Type | Example |
|---------|-------------|---------|
| "I want to...", "I'd like to...", "Goal: X" | Goal | "I want to learn piano" |
| "I'm building...", "Working on...", "Project: X" | Project | "I'm building a web app" |
| "I'm curious about...", "learning about...", "getting into..." | Interest | "I'm getting into 3D printing" |
| "What if...", "Maybe I should...", "Idea: X" | Idea | "What if I tried meditation?" |
| "I think...", "I noticed...", "Feeling..." | Thought | "I noticed I'm tired lately" |
| "I need to...", "TODO: X", "Reminder to..." | Task | "I need to call the dentist" |
| "I finished...", "Made progress on..." | Update | "I finished the first chapter" |
| "I'm stuck on...", "Blocked by..." | Blocker | "I'm stuck on the API design" |
