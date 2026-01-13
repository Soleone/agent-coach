#!/bin/bash
# Setup script to symlink coach to OpenCode for testing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCODE_DIR="$HOME/.opencode"

echo "Setting up coach in OpenCode..."

# Create directories if needed
mkdir -p "$OPENCODE_DIR/commands"
mkdir -p "$OPENCODE_DIR/skills"

# Symlink commands
rm -f "$OPENCODE_DIR/commands/coach"
ln -sf "$SCRIPT_DIR/commands/coach" "$OPENCODE_DIR/commands/coach"

# Symlink skills
rm -f "$OPENCODE_DIR/skills/coach"
ln -sf "$SCRIPT_DIR/skills/coach" "$OPENCODE_DIR/skills/coach"

echo "✅ Coach linked to OpenCode"
echo ""
echo "To test:"
echo "1. Open OpenCode"
echo "2. Run /coach:start"
echo "3. Or use /help to see available commands"
