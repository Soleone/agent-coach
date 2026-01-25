# Beads Reference

## Create
bd create "<title>" [-t type] [-p 0-4] [-l labels] [-d "description"]

## Query
bd ready --json              # What's actionable now
bd list --status open --json # All open items
bd show <id> --json          # Single item details

## Update
bd update <id> --status in_progress
bd close <id> --reason "<text>"

## Types
task (default), feature, bug, epic, chore

## Labels for Coach
idea, thought (used instead of type for non-task items)
