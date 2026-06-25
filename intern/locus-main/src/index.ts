#!/usr/bin/env node
/**
 * @locus-dev/mcp-server — entry point
 *
 * FILE MODE (default — no credentials needed):
 *   npx @locus-dev/mcp-server
 *
 *   Reads stories.yaml from the current directory or repo root automatically.
 *   Optionally set LOCUS_STORIES_PATH to point at a specific file.
 *
 * CLOUD MODE (optional — for teams using the Locus platform):
 *   Set PROTOTYPER_API_KEY + PROTOTYPER_SUPABASE_URL to enable cloud sync.
 *
 * Claude Code / Claude Desktop config (file mode):
 *   {
 *     "mcpServers": {
 *       "locus": {
 *         "command": "npx",
 *         "args": ["-y", "@locus-dev/mcp-server"]
 *       }
 *     }
 *   }
 *
 * Claude Code config (cloud mode):
 *   {
 *     "mcpServers": {
 *       "locus": {
 *         "command": "npx",
 *         "args": ["-y", "@locus-dev/mcp-server"],
 *         "env": {
 *           "PROTOTYPER_API_KEY": "your-jwt-here",
 *           "PROTOTYPER_SUPABASE_URL": "https://your-project.supabase.co",
 *           "PROTOTYPER_PROJECT_ID": "optional-project-uuid"
 *         }
 *       }
 *     }
 *   }
 */

import { createAndStartServer } from './server.js';

const apiKey = process.env['PROTOTYPER_API_KEY'];
const supabaseUrl = process.env['PROTOTYPER_SUPABASE_URL'];
const defaultProjectId = process.env['PROTOTYPER_PROJECT_ID'];
const storiesPath = process.env['LOCUS_STORIES_PATH'];

// Auto-detect mode: cloud if both API key and Supabase URL are set, file otherwise
const useCloudMode = Boolean(apiKey && supabaseUrl);

if (useCloudMode) {
  process.stderr.write('[locus-mcp] Cloud mode detected (PROTOTYPER_API_KEY + PROTOTYPER_SUPABASE_URL set)\n');
  createAndStartServer({
    apiKey: apiKey!,
    supabaseUrl: supabaseUrl!,
    defaultProjectId,
  }).catch((err) => {
    process.stderr.write(`[locus-mcp] Fatal error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  });
} else {
  process.stderr.write('[locus-mcp] File mode — reading stories.yaml from repo\n');
  createAndStartServer({
    fileMode: true,
    storiesPath,
  }).catch((err) => {
    process.stderr.write(`[locus-mcp] Fatal error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  });
}
