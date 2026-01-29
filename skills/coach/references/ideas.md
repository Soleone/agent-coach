# Ideas Format

Ideas are actionable seeds that could become Goals, Projects, or Interests.

Located in `{vault}/Coach/Ideas.md` as a single append-only file.

## Structure

```markdown
# Ideas

- [[2026-01-26]]: Combine AI + 3D printing for miniatures
- [[2026-01-15]]: Coach CLI for markdown querying
- [[2026-01-12]]: Learn Rust lifetimes and understand ownership
```

## Format Rules

- **Append-only**: New ideas added at the top (date-descending)
- **Date as wiki-link**: `[[YYYY-MM-DD]]` provides metadata and journal context
- **One line per idea**: Brief description of the actionable seed
- **Promotion**: Ideas that grow get moved to their own Goal, Project, or Interest file

## LLM Detection

When user says things like:
- "What if..."
- "I should..."
- "Maybe I could..."
- Any actionable seed

Add entry to Ideas.md at the top.

## Example Updates

**User says:** "What if I built a personal website with Obsidian?"

**Action:** Prepend to Ideas.md:
```markdown
- [[2026-01-28]]: Build personal website with Obsidian publish
```

**User says:** "I've been thinking about learning 3D printing"

**Action:** This is more of an interest/curiosity than a specific idea, so create `Interests/3D Printing.md` instead.
