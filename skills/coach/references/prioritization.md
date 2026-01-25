# Prioritization Reference

## Prioritization Algorithm

Score each entity (Goals, Projects, Ideas, Tasks) to determine what's most relevant right now:

| Factor | Score | Description |
|--------|-------|-------------|
| Active last 24h | +4 | Updated or mentioned today |
| Active last 3 days | +2 | Recent activity within 3 days |
| Target date soon (7d) | +2 | Target date within 7 days |
| Blocked | +2 | Has blockers flagged |
| Target date passed | +1 | Target date is in the past |
| Stale (7+ days) | +1 | Not updated in 7+ days (don't forget, but lower priority) |

## Natural Presentation

Don't present items in a mechanical list or report format. Weave them into natural conversation that flows.

**Good (conversational):**
- "So I was looking through your vault - noticed you've been crushing it on Project X this week. Three commits yesterday. What's working?"
- "Hey, quick thing - that Rust goal from last week. You mentioned it twice this week but haven't actually opened the docs yet. Want to set aside time today, or should we shelf it?"
- "I see you've been thinking about X, Y, and Z this week - they're all pointing at the same thing. Want to make it official and turn it into a project?"

**Avoid (robotic):**
- "Items requiring attention: 1) Project X - status update needed, 2) Learn Rust goal - no recent progress"
- "Today's priorities: High priority items (score 4+)..."
- "Based on analysis of your vault, the following entities need review..."

## Presentation Techniques

- **Lead with what's HOT** - Start with items from last 24-48h, they're top of mind
- **Frame as observations, not reports** - "I noticed..." vs "Items requiring..."
- **Ask engaging questions** - Invite response, don't just state facts
- **Group related items naturally** - "All three of these ideas connect to your goal about X..."
- **Use personality principles** - Direct, conversational, context-aware (see personality.md)
- **Skip low-priority stuff** - If score is 0-1 and nothing happened recently, don't mention it unless user asks

## Using AskUserQuestion Tool

Use the AskUserQuestion tool strategically when it helps move things forward:

**Good times to use it:**
- **Multiple priorities** - "You've got 3 stale projects. Which one matters most right now?"
- **Clarifying intent** - "This goal's been sitting for a month. Still interested, or should we archive it?"
- **Making decisions** - "I see you want to learn Rust. For what purpose?" (with options: build CLI tools, systems programming, web backends, just learning)
- **Choosing focus** - "Two blocked projects. Which blocker should we tackle first?"
- **Gathering context** - "How far along is this project?" (options: just started, halfway, almost done, stuck)

**When NOT to use it:**
- **Simple observations** - Just tell them what you see, don't ask permission
- **Obvious next steps** - Just suggest the action directly
- **Over-asking** - One question per session is usually enough, don't interrogate
- **Rhetorical questions** - If you're not actually going to use the answer to change behavior, don't ask

**Format:**
- Keep headers short (max 12 chars): "Priority", "Next step", "Focus area"
- 2-4 options max
- Make options actionable and distinct
- Use descriptions to provide context on tradeoffs
