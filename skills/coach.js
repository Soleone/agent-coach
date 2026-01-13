#!/usr/bin/env node

/**
 * Main coaching skill - loads full context and activates proactive coaching
 * Usage: /coach or /coach:standup
 */

import { runCoachSkill } from '../dist/skill.js';

async function main() {
  try {
    const context = await runCoachSkill({});
    console.log(context);
  } catch (error) {
    console.error('Failed to load coaching context:', error.message);
    process.exit(1);
  }
}

main();
