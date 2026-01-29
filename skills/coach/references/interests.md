# Interest Format

Interests are domains of curiosity and ongoing knowledge accumulation.

Located in `{vault}/Coach/Interests/*.md`

## Structure

```markdown
---
type: interest
status: active  # active, paused, archived
created-at: 2026-01-15
updated-at: 2026-01-20
---

# 3D Printing

Building knowledge and skills in 3D printing technology.

## Notes

- Started researching Prusa printers
- Interested in miniature printing for tabletop games
- Watched YouTube channel "Makers Muse"
- Considering getting a resin printer for detail work

## Resources

- [Prusa Knowledge Base](https://help.prusa3d.com/)
- YouTube: Makers Muse, CNC Kitchen

## Related

- [[Ideas]]: Several project ideas involving 3D printing
- [[Projects/Miniature Painting]] (if it becomes a concrete project)
```

## Characteristics

- **Open-ended**: No specific deliverable or end state
- **Knowledge accumulation**: Learning, exploring, researching
- **May spawn projects**: Interests can lead to concrete projects
- **No tasks required**: Unlike projects, interests don't need actionable tasks

## LLM Detection

When user says things like:
- "I'm curious about..."
- "I want to learn about..."
- "I've been reading about..."
- "I'm getting into..."

Create or update an Interest file.

## Updates

- Add notes as knowledge grows
- Link to related resources
- Reference related projects or goals
- Update `updated-at` in frontmatter when content changes

## Difference from Goals and Projects

- **Goals**: Aspirational with trackable outcomes ("Get BJJ blue belt")
- **Projects**: Concrete deliverable ("Build Agent Coach")
- **Interests**: Open-ended learning/curiosity ("3D Printing")

## Example

**User says:** "I've been getting into mechanical keyboards lately"

**Action:** Create `Interests/Mechanical Keyboards.md`:
```markdown
---
type: interest
status: active
created-at: 2026-01-28
updated-at: 2026-01-28
---

# Mechanical Keyboards

Exploring mechanical keyboard switches, layouts, and builds.

## Notes

- Started researching different switch types
- Interested in building a custom keyboard
```
