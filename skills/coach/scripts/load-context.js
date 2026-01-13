#!/usr/bin/env node

/**
 * Context loader for Claude Coach skill
 * This script loads and analyzes Obsidian goals and daily notes
 *
 * Requires: claude-coach npm package to be installed
 */

import { runCoachSkill } from 'claude-coach';

async function main() {
  try {
    const context = await runCoachSkill({});
    console.log(context);
  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND') {
      console.error('❌ claude-coach package not found.');
      console.error('\nPlease install it first:');
      console.error('  npm install -g claude-coach');
      console.error('  OR npm install claude-coach');
    } else {
      console.error('❌ Error loading context:', error.message);
    }
    process.exit(1);
  }
}

main();
