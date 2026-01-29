# Thoughts Format

Thoughts are observations, insights, or reflections - anything on your mind.

Located in `{vault}/Coach/Thoughts.md` as a single append-only file.

## Structure

```markdown
# Thoughts

- [[2026-01-26]]: Feeling really energized after BJJ class
- [[2026-01-25]]: Noticed patterns in how I learn - need hands-on projects
- [[2026-01-20]]: Maybe I'm overthinking the architecture
```

## Format Rules

- **Append-only**: New thoughts added at the top (date-descending)
- **Date as wiki-link**: `[[YYYY-MM-DD]]` provides metadata and journal context
- **One line per thought**: Brief capture of the observation or insight
- **Freeform**: No structure required, just capture what's on mind

## LLM Detection

When user says things like:
- "I noticed..."
- "I've been thinking..."
- "Feeling..."
- Any observation or reflection

Add entry to Thoughts.md at the top.

## Difference from Ideas

- **Ideas**: Actionable seeds ("What if I built X?")
- **Thoughts**: Observations and reflections ("I noticed X", "Feeling Y")

## Example Updates

**User says:** "I'm feeling really tired today, might take it easy"

**Action:** Prepend to Thoughts.md:
```markdown
- [[2026-01-28]]: Feeling tired, planning lighter day
```

**User says:** "I noticed I learn better with hands-on projects"

**Action:** Prepend to Thoughts.md:
```markdown
- [[2026-01-28]]: Learn best through hands-on projects vs theory
```
