# Diary Entry Format

## Purpose: Enabling Better Coaching

Diary entries serve **two equally important purposes:**

1. **For the user:** Help them remember past actions, decisions, and learnings
   - Memory loss test: Would they be happy to find this if they lost their memory?
   - Future gratitude: Will they be glad this was logged when they review it later?

2. **For you (the coach):** Build context for better coaching
   - Know what to chat about in future sessions
   - Remind them of past items they could pick up or continue pursuing
   - Notice correlations between current moment and past moments
   - Identify patterns in their thinking, behavior, and progress

**Test before writing:**
- "Would this help the user reconstruct their life if they had amnesia?"
- "Does this give me context to coach better next time?"

Write entries as if the user WILL lose their memory AND you will need this context to coach them effectively in the future.

## Format

**Structure:** Bullet points with timestamps under the `# Coach` header

**Format:** `- HH:MM: entry text`

**Timestamps:**
- **When user specifies a time:** Use that exact time converted to 24-hour format. E.g., "I woke up around 30 min after 11am" → `- 11:30: Woke up`
- **When user mentions multiple timed events:** Create **separate timeline entries per event** (never combine into one narrative line)
- **When no event time is provided:** Use current time from `date +"%H:%M"` for coach/meta entries
- **Always use 24-hour format** (00:00 to 23:59, NOT 12-hour with AM/PM)
- **Timezone:** Run `date +"%Z"` for current timezone (e.g., EST, PST)
- **Deterministic:**
  - Event entries use the event's actual/mentioned time
  - Coach/meta entries in one interaction can share the same current timestamp
- **Never hardcode examples** - always generate current time or use user's specified time

**Style:** Concise, specific, context-rich

**Mandatory questions to answer:**
- What happened?
- Why does it matter?
- What changed?
- What's the context?

**Validation:** Does this entry pass the memory loss test?

## Timed Event Entries (Critical)

When users mention events anchored to specific times (past, present, or future), write them as **timeline entries**, not narrative summaries.

**Do this:**
- `- 10:00: Dentist appointment`
- `- 14:30: Met with John about project`
- `- 18:00: Dinner at restaurant X`

**Never do this:**
- `- 00:40: User mentioned dentist appointment at 10am and dinner at 6pm`

If one prompt contains multiple timed events, write multiple lines (one per event time).

## Creating the Header

**Daily journal page:** `{vault}/{journals}/YYYY-MM-DD.md`

**Required header for diary entries:** `# Coach` (h1 header at the bottom of the page)

If the `# Coach` header doesn't exist in the journal page, append it at the bottom:

```markdown
# Coach

- 09:30: [First diary entry]
```

If it already exists, write entries using `skills/coach/scripts/log-manager.mjs` into `# Coach` with format: `- HH:MM: entry text`.

**Ordering rule (critical):** Entries are chronological with **oldest first** (top = earliest, bottom = latest). Use log-manager so ordering is enforced deterministically.

## Good Examples

```markdown
# Coach

- 09:30: Decided to pivot Build Personal Website project to use Astro instead of Next.js after discovering better Obsidian integration. This unblocks the publishing workflow.
- 09:45: Breakthrough on [[Coach/Goals/Learn Rust]] - finally understood lifetime annotations by working through Chapter 10 examples. Key insight: lifetimes are about references, not values.
- 11:30: Woke up today - slept in after late night coding session
- 14:15: Created new goal [[Coach/Goals/Master TypeScript Generics]] after struggling with type inference in current project. Target: 2 weeks.
- 16:20: Realized that chasing perfection on side projects has been blocking me from shipping. New approach: "good enough" iterations with 2-week cycles. This shifts my entire project philosophy.
- 21:00: Had conversation about work-life balance. Recognized pattern: I overcommit when anxious about progress. Going to try time-boxing commitments for next month.
- 22:34: Created [[Coach/Goals/Jump Roping]] goal to try to get more fit
```

## Poor Examples

```markdown
# Coach

- Had a good coaching session today
- Discussed various topics
- Made some progress on projects
- Feeling productive
- Talked about goals
- 22:34: Created new goal to start jump roping (missing link to goal file)
```
