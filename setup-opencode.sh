#!/bin/bash
# Setup script to symlink coach to OpenCode for testing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPENCODE_DIR="$HOME/.opencode"

echo "Setting up coach in OpenCode..."

# Symlink commands
rm -f "$OPENCODE_DIR/command/coach"
ln -sf "$SCRIPT_DIR/commands/coach" "$OPENCODE_DIR/command/coach"

# Symlink skills
rm -f "$OPENCODE_DIR/skills/coach"
ln -sf "$SCRIPT_DIR/skills/coach" "$OPENCODE_DIR/skills/coach"

echo "✅ Coach linked to OpenCode"