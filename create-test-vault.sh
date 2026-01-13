#!/bin/bash
# Create test vault with sample data for testing the coach

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_VAULT="$SCRIPT_DIR/test-vault"

echo "Creating test vault at: $TEST_VAULT"

rm -rf "$TEST_VAULT"
mkdir -p "$TEST_VAULT/Coach/Goals"
mkdir -p "$TEST_VAULT/Coach/Projects"
mkdir -p "$TEST_VAULT/Daily Notes"

# Sample Goal - stale
cat > "$TEST_VAULT/Coach/Goals/learn-rust.md" << 'EOF'
---
status: in-progress
created: 2026-01-01
target: 2026-02-01
progress: 35
tags: [goal/active]
lastUpdated: 2026-01-05
---

# Goal: Learn Rust Fundamentals

## Milestones
- [x] Complete basics tutorial (2026-01-08)
- [ ] Build a CLI tool (2026-01-20)
- [ ] Contribute to OSS project (2026-02-01)

## Current Status
Working through lifetimes and generics. Making good progress!

**Blockers:**
- Confused about lifetime syntax in nested structs

## Next Actions
- [ ] Read chapter on lifetimes
- [ ] Build example with multiple lifetimes
- [ ] Ask on Reddit about best practices
EOF

# Sample Goal - recently updated
cat > "$TEST_VAULT/Coach/Goals/api-redesign.md" << 'EOF'
---
status: in-progress
created: 2026-01-08
target: 2026-01-20
progress: 60
tags: [goal/active]
lastUpdated: 2026-01-12
---

# Goal: API Redesign

## Milestones
- [x] Define new schema (2026-01-10)
- [ ] Implement auth middleware (2026-01-15)
- [ ] Write integration tests (2026-01-18)

## Current Status
Auth middleware in progress. Almost done!

**Blockers:**
- None

## Next Actions
- [ ] Finalize auth middleware
EOF

# Sample Project
cat > "$TEST_VAULT/Coach/Projects/agent-coach.md" << 'EOF'
---
status: in-progress
created: 2026-01-10
target: 2026-02-15
progress: 20
tags: [project/active]
lastUpdated: 2026-01-12
---

# Project: Agent Coach

## Milestones
- [x] Define skill structure (2026-01-08)
- [ ] Implement memory system (2026-01-15)
- [ ] Ship v1 (2026-02-15)

## Current Status
Building out the coaching skill with proactive memory.

**Blockers:**
- Need more daily notes to test pattern detection

## Next Actions
- [ ] Write prioritization algorithm
- [ ] Test with real journal entries
EOF

# Daily Notes with Ideas and Thoughts
cat > "$TEST_VAULT/Daily Notes/2026-01-10.md" << 'EOF'
# 2026-01-10

## Work
- Started working on agent coach project
- Created initial skill structure

## Learning
- More Rust generics today #goal/learn-rust

## Ideas
#idea: Learn Rust lifetimes and understand ownership
#idea: Build a personal website with Obsidian publish

## Thoughts
#thought: Feeling productive today, want to keep momentum going
EOF

cat > "$TEST_VAULT/Daily Notes/2026-01-11.md" << 'EOF'
# 2026-01-11

## Work
- Refined the coach skill structure
- Implemented prioritization algorithm

## Learning
- Still on Rust lifetimes #goal/learn-rust

## Ideas
#idea: Could add energy tracking to daily notes
#idea: Maybe a weekly review mode?

## Tasks
- [ ] Review API design docs #task
- [ ] Write more tests for auth #task

## Thoughts
#thought: Sleep was good last night, energy is high
#thought: Article about async/await was interesting
EOF

cat > "$TEST_VAULT/Daily Notes/2026-01-12.md" << 'EOF'
# 2026-01-12

## Work
- Shipped the initial coach implementation

## Learning
- API redesign is going well #goal/api-redesign

## Ideas
#idea: Add a habit tracker module

## Tasks
- [ ] Update project milestones #task

## Thoughts
#thought: Tired today, maybe take it easy on complex tasks
EOF

echo "✅ Test vault created at: $TEST_VAULT"
echo ""
echo "To test with OpenCode:"
echo "1. Run ./setup-opencode.sh"
echo "2. In OpenCode, run /coach:start"
echo "3. The coach should see:"
echo "   - 2 goals (Learn Rust stale, API Redesign recent)"
echo "   - 1 project (Agent Coach)"
echo "   - Ideas about lifetimes, website, energy tracking, weekly review, habit tracker"
echo "   - Thoughts about productivity, sleep, energy"
echo "   - 2 pending tasks"
