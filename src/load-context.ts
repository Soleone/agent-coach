#!/usr/bin/env node

/**
 * Entry point for loading coaching context
 * Outputs markdown that Claude can use directly
 */

import { runCoachSkill } from './skill.js';

async function main() {
  try {
    const context = await runCoachSkill({});
    console.log(context);
  } catch (error) {
    console.error('Error loading context:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
