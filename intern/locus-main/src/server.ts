/**
 * Locus MCP Server — capability registration and request routing.
 *
 * Uses the high-level McpServer API from @modelcontextprotocol/sdk v1.x.
 * Tools use Zod shapes for parameter validation (SDK handles JSON Schema conversion).
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { stringify as toYaml } from 'yaml';
import type { ApiConfig, StoryStatus } from './types.js';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const _pkg = require('../package.json') as { version: string };

// ── link_pr param shape ───────────────────────────────────────────────────────

const LinkPrParams = {
  pr_url: z
    .string()
    .url()
    .describe('Full URL of the pull request, e.g. https://github.com/org/repo/pull/142.'),
  pr_number: z
    .number()
    .int()
    .positive()
    .describe('Pull request number (integer).'),
  pr_title: z
    .string()
    .optional()
    .describe('Title of the pull request. Optional but recommended for audit trail readability.'),
  story_ids: z
    .array(z.string())
    .min(1)
    .describe('One or more story IDs that this PR implements or references, e.g. ["BT-12", "BT-13"].'),
  link_type: z
    .enum(['implements', 'partial', 'refs'])
    .optional()
    .default('implements')
    .describe('Relationship type: implements (PR fully delivers the story), partial (partial progress), refs (related but not implementing).'),
  state: z
    .enum(['open', 'merged', 'closed'])
    .optional()
    .default('open')
    .describe('Current state of the PR.'),
  merged_at: z
    .string()
    .optional()
    .describe('ISO 8601 timestamp of when the PR was merged. Set automatically when state=merged.'),
  project_id: z
    .string()
    .optional()
    .describe('Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.'),
};
import { PrototyperApiClient } from './api.js';
import { FileApiClient } from './file-client.js';
import { readResource } from './resources.js';

type AnyApiClient = PrototyperApiClient | FileApiClient;

// ── Zod parameter shapes for tools ───────────────────────────────────────────

const ListStoriesParams = {
  project_id: z
    .string()
    .optional()
    .describe(
      'Locus project ID. If omitted, uses the PROTOTYPER_PROJECT_ID environment variable.'
    ),
  status: z
    .enum(['not-implemented', 'partial', 'implemented', 'stale', 'deprecated', 'all'])
    .optional()
    .default('all')
    .describe('Filter by implementation status. Default: all.'),
  section: z
    .string()
    .optional()
    .describe('Filter by feature section/area (case-insensitive partial match). Optional.'),
};

const GetStoryParams = {
  story_id: z
    .string()
    .describe('Story ID in the format PREFIX-NUMBER (e.g. US-01, AUTH-03).'),
  project_id: z
    .string()
    .optional()
    .describe('Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.'),
};

const GetActiveStoryParams = {
  project_id: z
    .string()
    .optional()
    .describe('Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.'),
};

const MarkStoryStatusParams = {
  story_id: z.string().describe('Story ID to update.'),
  status: z
    .enum(['not-implemented', 'partial', 'implemented', 'stale', 'deprecated'])
    .describe('New implementation status to set.'),
  notes: z
    .string()
    .optional()
    .describe(
      'Optional implementation notes (e.g. PR number, component name, known limitations).'
    ),
  project_id: z
    .string()
    .optional()
    .describe('Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.'),
};

const FindStoriesParams = {
  query: z.string().describe('Search term to match against story titles, descriptions, and acceptance criteria.'),
  project_id: z.string().optional().describe('Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.'),
};

const GetCoverageParams = {
  project_id: z.string().optional().describe('Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.'),
};

// ── Server factory ────────────────────────────────────────────────────────────

export async function createAndStartServer(config: ApiConfig | { fileMode: true; storiesPath?: string }): Promise<void> {
  const api: AnyApiClient = 'fileMode' in config
    ? new FileApiClient((config as { fileMode: true; storiesPath?: string }).storiesPath)
    : new PrototyperApiClient(config as ApiConfig);

  const server = new McpServer({
    name: 'locus',
    version: _pkg.version,
  });

  // ── Resources ───────────────────────────────────────────────────────────────

  server.resource(
    'locus-projects',
    'prototyper://projects',
    {
      description: 'All projects in the connected Locus account.',
      mimeType: 'application/json',
    },
    async (uri) => {
      const content = await readResource(uri.href, api);
      return {
        contents: [{ uri: uri.href, mimeType: content.mimeType, text: content.text }],
      };
    }
  );

  if (config.defaultProjectId) {
    const pid = config.defaultProjectId;

    server.resource(
      'locus-stories-all',
      `prototyper://projects/${pid}/stories`,
      {
        description: 'All user stories for the default Locus project.',
        mimeType: 'text/yaml',
      },
      async (uri) => {
        const content = await readResource(uri.href, api);
        return {
          contents: [{ uri: uri.href, mimeType: content.mimeType, text: content.text }],
        };
      }
    );

    server.resource(
      'locus-stories-pending',
      `prototyper://projects/${pid}/stories?status=not-implemented`,
      {
        description: 'Unimplemented stories — use as context for a new implementation session.',
        mimeType: 'text/yaml',
      },
      async (uri) => {
        const content = await readResource(uri.href, api);
        return {
          contents: [{ uri: uri.href, mimeType: content.mimeType, text: content.text }],
        };
      }
    );
  }

  // ── Tools ───────────────────────────────────────────────────────────────────

  server.tool(
    'list_stories',
    'List user stories for a Locus project. Returns stories with IDs, titles, statuses, ' +
      'acceptance criteria, and descriptions. Use this to understand what needs to be built before writing code. ' +
      'Call with status="not-implemented" at the start of an implementation session.',
    ListStoriesParams,
    async (args) => {
      try {
        const projectId = api.resolveProjectId(args.project_id);
        const status = args.status === 'all' ? undefined : (args.status as StoryStatus);
        const { project, stories } = await api.getStories(projectId, {
          status,
          section: args.section,
        });

        if (stories.length === 0) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `No stories found in project "${project.name}" with the given filters.`,
              },
            ],
          };
        }

        const yaml = toYaml({
          project: { id: project.id, name: project.name },
          filter: { status: args.status, section: args.section ?? 'all' },
          story_count: stories.length,
          stories: stories.map((s) => ({
            story_id: s.story_id,
            title: s.title,
            section: s.section,
            status: s.status,
            description: s.description,
            ...(s.acceptance_criteria && s.acceptance_criteria.length > 0
              ? { acceptance_criteria: s.acceptance_criteria }
              : {}),
            ...(s.depends_on && s.depends_on.length > 0
              ? { depends_on: s.depends_on }
              : {}),
          })),
        });

        return { content: [{ type: 'text' as const, text: yaml }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: 'text' as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    'get_story',
    'Get full detail for a single user story, including description and acceptance criteria. ' +
      'Use when you need to understand exactly what to build for a specific story ID.',
    GetStoryParams,
    async (args) => {
      try {
        const projectId = api.resolveProjectId(args.project_id);
        const story = await api.getStory(projectId, args.story_id);

        if (!story) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Story "${args.story_id}" not found in project ${projectId}.`,
              },
            ],
            isError: true,
          };
        }

        return { content: [{ type: 'text' as const, text: toYaml(story) }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: 'text' as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    'get_active_story',
    'Get the story currently being implemented — the story in "partial" status with the most recent activity, ' +
      'or the first "not-implemented" story if none are in progress. ' +
      'Used by Story Guard PostToolUse hooks to check whether an agent action falls within the active story\'s acceptance criteria. ' +
      'Call this in a PostToolUse hook that fires after every tool (file writes, bash commands, API calls) to verify agent scope.',
    GetActiveStoryParams,
    async (args) => {
      try {
        const projectId = api.resolveProjectId(args.project_id);
        const { project, stories } = await api.getStories(projectId);

        const activeStory =
          stories.find((s) => s.status === 'partial') ??
          stories.find((s) => s.status === 'not-implemented');

        if (!activeStory) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `No active story found in project "${project.name}". All stories are implemented or there are no stories.`,
              },
            ],
          };
        }

        const yaml = toYaml({
          active_story: activeStory,
          story_guard_note:
            'Check whether your last action falls within the acceptance_criteria above. ' +
            'If the action is outside all acceptance criteria and is not a necessary sub-step of implementing one, flag the discrepancy before proceeding.',
        });

        return { content: [{ type: 'text' as const, text: yaml }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: 'text' as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    'mark_story_status',
    'Update the implementation status of a user story. Use when you have finished implementing ' +
      'a story ("implemented") or partial progress has been made ("partial"). ' +
      'This closes the audit loop: the Locus dashboard updates immediately.',
    MarkStoryStatusParams,
    async (args) => {
      try {
        const projectId = api.resolveProjectId(args.project_id);
        await api.markStoryStatus(projectId, args.story_id, args.status, args.notes);

        return {
          content: [
            {
              type: 'text' as const,
              text:
                `✓ Story ${args.story_id} marked as "${args.status}".` +
                (args.notes ? `\nNotes: ${args.notes}` : '') +
                '\nThe Locus dashboard has been updated.',
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: 'text' as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    'find_stories',
    'Full-text search across all story titles, descriptions, and acceptance criteria for a Locus project. ' +
      'Use when you want to find stories related to a specific feature, component, or keyword.',
    FindStoriesParams,
    async (args) => {
      try {
        const projectId = api.resolveProjectId(args.project_id);
        const query = args.query.toLowerCase();
        const { project, stories } = await api.getStories(projectId);
        const matches = stories.filter((s) => {
          const haystack = [
            s.story_id,
            s.title,
            s.description,
            ...(s.acceptance_criteria ?? []),
            s.section,
          ].join(' ').toLowerCase();
          return haystack.includes(query);
        });
        if (matches.length === 0) {
          return {
            content: [{ type: 'text' as const, text: `No stories matched "${args.query}" in Locus project "${project.name}".` }],
          };
        }
        const yaml = toYaml({
          project: { id: project.id, name: project.name },
          query: args.query,
          match_count: matches.length,
          stories: matches.map((s) => ({
            story_id: s.story_id,
            title: s.title,
            section: s.section,
            status: s.status,
            description: s.description,
            ...(s.acceptance_criteria && s.acceptance_criteria.length > 0
              ? { acceptance_criteria: s.acceptance_criteria }
              : {}),
          })),
        });
        return { content: [{ type: 'text' as const, text: yaml }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: 'text' as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  server.tool(
    'get_coverage',
    'Get implementation coverage summary for a Locus project. Returns total stories, counts by status, ' +
      'and overall coverage percentage. Use at the start or end of a session to understand project health.',
    GetCoverageParams,
    async (args) => {
      try {
        const projectId = api.resolveProjectId(args.project_id);
        const { project, stories } = await api.getStories(projectId);
        const total = stories.length;
        const implemented = stories.filter((s) => s.status === 'implemented').length;
        const partial = stories.filter((s) => s.status === 'partial').length;
        const notImplemented = stories.filter((s) => s.status === 'not-implemented').length;
        const stale = stories.filter((s) => s.status === 'stale').length;
        const deprecated = stories.filter((s) => s.status === 'deprecated').length;
        const coveragePct = total > 0 ? Math.round((implemented / total) * 100) : 0;
        const yaml = toYaml({
          project: { id: project.id, name: project.name },
          coverage: {
            percent: coveragePct,
            implemented,
            partial,
            not_implemented: notImplemented,
            stale,
            deprecated,
            total,
          },
          summary: `${coveragePct}% implemented (${implemented}/${total} stories)`,
        });
        return { content: [{ type: 'text' as const, text: yaml }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: 'text' as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    }
  );

  // ── detect_drift ──────────────────────────────────────────────────────────

  server.tool(
    'detect_drift',
    'Analyse the current codebase against stories and their acceptance criteria. ' +
      'Returns a structured drift report: which stories are satisfied, partial, or diverged, ' +
      'with per-acceptance-criterion pass/fail and file evidence. ' +
      'Use before a PR, after a refactor, or whenever you want to know if the code matches the spec. ' +
      'IMPORTANT: After calling this tool, read each story\'s acceptance_criteria carefully and ' +
      'check the relevant source files yourself to produce the evidence field — ' +
      'this tool provides the structure, you provide the analysis.',
    {
      story_id: z.string().optional().describe('Check one story by ID. If omitted, checks all stories.'),
      project_id: z.string().optional().describe('Locus project ID. Optional in file mode.'),
    },
    async (args) => {
      try {
        const projectId = api.resolveProjectId(args.project_id);
        const { project, stories } = await api.getStories(projectId);
        const targets = args.story_id
          ? stories.filter((s) => s.story_id === args.story_id)
          : stories.filter((s) => s.status !== 'deprecated' && s.status !== 'stale');

        if (targets.length === 0) {
          return {
            content: [{ type: 'text' as const, text: args.story_id
              ? `Story "${args.story_id}" not found.`
              : 'No active stories to check.' }],
          };
        }

        // Partition: stories with file_refs get deterministic file-based checking;
        // stories without fall back to Claude codebase inference.
        const withFileRefs = targets.filter((s) => s.file_refs && s.file_refs.length > 0);
        const withoutFileRefs = targets.filter((s) => !s.file_refs || s.file_refs.length === 0);

        const yaml = toYaml({
          project: { id: project.id, name: project.name },
          instruction:
            'For each story below, examine the codebase and fill in the drift analysis. ' +
            'For each acceptance_criterion: set satisfied=true/false, provide evidence (file:line) if found, ' +
            'add a note if the code contradicts or partially satisfies the criterion. ' +
            'Set story status to: satisfied (all ACs pass), partial (some ACs pass), diverged (ACs actively contradicted by code). ' +
            'Stories listed under stories_with_file_refs: check ONLY those declared files first — they are the authoritative implementation files. ' +
            'This is faster and more accurate than searching the whole codebase.',
          ...(withFileRefs.length > 0 && {
            stories_with_file_refs: withFileRefs.map((s) => ({
              story_id: s.story_id,
              title: s.title,
              section: s.section,
              current_status: s.status,
              file_refs: s.file_refs,
              file_refs_note: 'Check ONLY these declared files first. They are the authoritative implementation files for this story.',
              acceptance_criteria: s.acceptance_criteria?.length
                ? s.acceptance_criteria.map((ac) => ({ criterion: ac, satisfied: null, evidence: null, note: null }))
                : ['(no acceptance criteria defined — assess from description)'],
              description: s.description,
              depends_on: s.depends_on ?? [],
            })),
          }),
          ...(withoutFileRefs.length > 0 && {
            stories_inferred: withoutFileRefs.map((s) => ({
              story_id: s.story_id,
              title: s.title,
              section: s.section,
              current_status: s.status,
              file_refs_note: 'No file_refs declared — search the codebase using Claude inference.',
              acceptance_criteria: s.acceptance_criteria?.length
                ? s.acceptance_criteria.map((ac) => ({ criterion: ac, satisfied: null, evidence: null, note: null }))
                : ['(no acceptance criteria defined — assess from description)'],
              description: s.description,
              depends_on: s.depends_on ?? [],
            })),
          }),
          output_format: {
            per_story: {
              story_id: 'string',
              drift_status: 'satisfied | partial | diverged | unknown',
              acceptance_criteria: [{ criterion: 'string', satisfied: 'boolean', evidence: 'file:line or null', note: 'string or null' }],
            },
            summary: { satisfied: 'number', partial: 'number', diverged: 'number', coverage_pct: 'number' },
          },
        });

        return { content: [{ type: 'text' as const, text: yaml }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
      }
    }
  );

  // ── create_story ──────────────────────────────────────────────────────────

  server.tool(
    'create_story',
    'Add a new story to stories.yaml. Use when you discover behaviour in the codebase ' +
      'that has no story covering it, or when a new feature needs to be specified before implementation. ' +
      'The story is appended to the file and validated before writing. ' +
      'If id is omitted, a unique ID is auto-generated from the existing prefix pattern. ' +
      'If section is omitted, existing sections are listed to guide your choice.',
    {
      id: z
        .string()
        .optional()
        .describe(
          'Story ID, e.g. BT-24. Must be unique. ' +
          'If omitted, a new ID is auto-generated from the most common existing prefix (e.g. US-07).'
        ),
      title: z.string().describe('Short verb-first title: "User can X".'),
      description: z.string().describe('What the user can do and why.'),
      section: z
        .string()
        .optional()
        .describe(
          'Feature area this story belongs to. ' +
          'If omitted, existing sections are listed so you can pick the right one.'
        ),
      status: z.enum(['not-implemented', 'partial', 'implemented']).default('not-implemented'),
      acceptance_criteria: z
        .array(z.string())
        .optional()
        .describe('List of specific, testable conditions. At least 2 recommended.'),
      depends_on: z
        .array(z.string())
        .optional()
        .describe('Story IDs that must be implemented first. Validated — referenced IDs must exist.'),
      file_refs: z
        .array(z.string())
        .optional()
        .describe(
          'File paths (relative to repo root) that implement this story. ' +
          'Supports globs: src/deposit/**/*.ts, src/deposit/psbt.ts. ' +
          'When present, the CI audit action only audits this story if at least one listed file appears in the PR diff. ' +
          'Example: ["src/vaults/VaultList.tsx", "src/hooks/useVaultFilter.ts"]'
        ),
      project_id: z.string().optional(),
    },
    async (args) => {
      try {
        if (!('fileMode' in config)) {
          return { content: [{ type: 'text' as const, text: 'create_story is only supported in file mode.' }], isError: true };
        }
        const fileClient = api as FileApiClient;
        const { stories } = await fileClient.getStories('local');
        const existingIds = new Set(stories.map((s) => s.story_id));

        // ── 1. Auto-generate ID if not provided ──────────────────────────────
        let storyId = args.id;
        if (!storyId) {
          // Determine the most common prefix among existing IDs
          const prefixCounts: Record<string, number> = {};
          for (const id of existingIds) {
            const m = /^([A-Z][A-Z0-9]*)-(\d+)$/.exec(id);
            if (m) prefixCounts[m[1]] = (prefixCounts[m[1]] ?? 0) + 1;
          }
          const topPrefix = Object.entries(prefixCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'US';
          const existingNums = [...existingIds]
            .map((id) => new RegExp('^' + topPrefix + '-(\\d+)$').exec(id)?.[1])
            .filter((n): n is string => n !== undefined)
            .map(Number);
          const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
          storyId = topPrefix + '-' + String(nextNum).padStart(2, '0');
        }

        // ── 2. Duplicate ID check ────────────────────────────────────────────
        if (existingIds.has(storyId)) {
          // Suggest the next available ID with same prefix
          const m = /^([A-Z][A-Z0-9]*)-(\d+)$/.exec(storyId);
          let suggestion = '';
          if (m) {
            const pfx = m[1];
            const nums = [...existingIds]
              .map((id) => new RegExp('^' + pfx + '-(\\d+)$').exec(id)?.[1])
              .filter((n): n is string => n !== undefined)
              .map(Number);
            const next = nums.length > 0 ? Math.max(...nums) + 1 : 1;
            suggestion = ` Next available: ${pfx}-${String(next).padStart(2, '0')}`;
          }
          return {
            content: [{ type: 'text' as const, text: `Story "${storyId}" already exists.${suggestion}` }],
            isError: true,
          };
        }

        // ── 3. ID format validation ──────────────────────────────────────────
        if (!/^[A-Z][A-Z0-9]*-\d+$/.test(storyId)) {
          return {
            content: [{
              type: 'text' as const,
              text: `Invalid story ID format "${storyId}". Expected PREFIX-NUMBER, e.g. US-01, AUTH-03, BT-12.`,
            }],
            isError: true,
          };
        }

        // ── 4. Section auto-suggestion ───────────────────────────────────────
        const existingSections = [...new Set(stories.map((s) => s.section).filter(Boolean))];
        if (!args.section) {
          const sectionList = existingSections.length > 0
            ? existingSections.map((s) => `  - ${s}`).join('\n')
            : '  (no sections yet — you can create a new one)';
          return {
            content: [{
              type: 'text' as const,
              text:
                `section is required. Existing sections in this project:\n${sectionList}\n\n` +
                `Re-call create_story with section set to one of the above (or a new section name).\n` +
                `Suggested story ID: ${storyId}`,
            }],
            isError: true,
          };
        }

        // ── 5. Title validation ──────────────────────────────────────────────
        if (!args.title || args.title.trim().length < 5) {
          return {
            content: [{ type: 'text' as const, text: 'title is required and must be at least 5 characters. Use verb-first form: "User can X".' }],
            isError: true,
          };
        }

        // ── 6. depends_on cross-reference check ──────────────────────────────
        if (args.depends_on && args.depends_on.length > 0) {
          const missing = args.depends_on.filter((dep) => !existingIds.has(dep));
          if (missing.length > 0) {
            return {
              content: [{
                type: 'text' as const,
                text:
                  `depends_on references story IDs that do not exist: ${missing.join(', ')}. ` +
                  'Fix the IDs or create the prerequisite stories first.',
              }],
              isError: true,
            };
          }
        }

        // ── 7. Acceptance criteria advisory ─────────────────────────────────
        const warnings: string[] = [];
        if (!args.acceptance_criteria || args.acceptance_criteria.length < 2) {
          warnings.push('⚠ Tip: stories without at least 2 acceptance criteria are harder to validate. Consider adding them.');
        }

        // ── 8. Write the story ───────────────────────────────────────────────
        await fileClient.createStory({
          id: storyId,
          title: args.title,
          description: args.description,
          section: args.section,
          status: args.status,
          acceptance_criteria: args.acceptance_criteria,
          depends_on: args.depends_on,
          file_refs: args.file_refs,
        });

        const lines = [`✓ Story ${storyId} "${args.title}" added to stories.yaml.`];
        if (warnings.length > 0) lines.push('', ...warnings);
        if (!args.file_refs || args.file_refs.length === 0) {
          lines.push(
            '',
            '💡 Tip: add file_refs to enable deterministic CI audit triggering.',
            '   file_refs lists the source files that implement this story.',
            '   When set, the audit action only checks this story when those files change in a PR.',
            '   Example: file_refs: ["src/vaults/VaultList.tsx", "src/hooks/useVaultFilter.ts"]',
            '   Glob patterns supported: src/deposit/**/*.ts',
            '   Re-call create_story with file_refs to add them now, or update stories.yaml manually.',
          );
        }
        return { content: [{ type: 'text' as const, text: lines.join('\n') }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
      }
    }
  );

  // ── suggest_stories ────────────────────────────────────────────────────────

  server.tool(
    'suggest_stories',
    'Analyse a git diff or a set of source files and suggest user stories that are missing from stories.yaml. ' +
      'Use when you have implemented code with no corresponding story, when reviewing a PR, or when auditing ' +
      'a codebase for undocumented behaviour. ' +
      'Returns a structured YAML template with suggested stories pre-filled from the analysis. ' +
      'Each suggestion includes: a proposed ID, title, section, description, and acceptance_criteria. ' +
      'You can pass the output directly to create_story to add them to stories.yaml.',
    {
      diff: z
        .string()
        .optional()
        .describe(
          'Git diff text (output of `git diff` or `git diff HEAD~1`). ' +
          'Paste the full diff. If omitted, provide files instead.'
        ),
      files: z
        .array(z.string())
        .optional()
        .describe(
          'Array of file paths whose contents should be analysed. ' +
          'The tool will read these files from disk (relative to cwd). ' +
          'Use instead of diff when you want to analyse existing source without a diff.'
        ),
      focus: z
        .string()
        .optional()
        .describe(
          'Optional description of what area or feature to focus on, e.g. "authentication", "payment flow". ' +
          'Helps filter out irrelevant suggestions.'
        ),
      id_prefix: z
        .string()
        .optional()
        .describe(
          'Prefix for suggested story IDs, e.g. "AUTH" produces AUTH-01, AUTH-02. ' +
          'If omitted, defaults to "US".'
        ),
      project_id: z
        .string()
        .optional()
        .describe('Locus project ID. Optional in file mode.'),
    },
    async (args) => {
      try {
        if (!args.diff && (!args.files || args.files.length === 0)) {
          return {
            content: [{
              type: 'text' as const,
              text: 'Error: provide either diff (git diff text) or files (array of file paths).',
            }],
            isError: true,
          };
        }

        // Load existing stories for dedup context
        const projectId = api.resolveProjectId(args.project_id);
        const { project, stories } = await api.getStories(projectId);

        // Read file contents if files were provided
        const fileContents: Array<{ path: string; content: string }> = [];
        if (args.files && args.files.length > 0) {
          const { readFileSync, existsSync } = await import('fs');
          const { resolve } = await import('path');
          for (const filePath of args.files) {
            const abs = resolve(filePath);
            if (existsSync(abs)) {
              try {
                const raw = readFileSync(abs, 'utf-8');
                // Truncate very large files to 8KB to keep context manageable
                fileContents.push({
                  path: filePath,
                  content: raw.length > 8192 ? raw.slice(0, 8192) + '\n...(truncated)' : raw,
                });
              } catch {
                fileContents.push({ path: filePath, content: '(could not read file)' });
              }
            } else {
              fileContents.push({ path: filePath, content: '(file not found)' });
            }
          }
        }

        // Determine next available story number for the prefix
        const prefix = args.id_prefix ?? 'US';
        const existingIds = stories.map((s) => s.story_id);
        const prefixPattern = new RegExp('^' + prefix + '-(\\d+)$');
        const existingNums = existingIds
          .map((id) => prefixPattern.exec(id)?.[1])
          .filter((n): n is string => n !== undefined)
          .map(Number);
        const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
        const nextId = prefix + '-' + String(nextNum).padStart(2, '0');

        const existingStorySummary = stories.slice(0, 30).map((s) => ({
          id: s.story_id,
          title: s.title,
          section: s.section,
          status: s.status,
        }));

        const focusRule = args.focus ? '(6) Focus on: ' + args.focus + '.' : '';
        const instruction =
          'You are a product analyst. Analyse the input below and identify USER-VISIBLE BEHAVIOURS ' +
          'that are not covered by existing stories. ' +
          'For each gap, produce a story suggestion. ' +
          'Rules: (1) Only suggest behaviour that a user or external system would actually observe. ' +
          '(2) Do not suggest internal refactors, type changes, or dev tooling as stories. ' +
          '(3) Each story must have at least 2 acceptance criteria (specific and testable). ' +
          '(4) If a behaviour is already covered by an existing story, skip it. ' +
          '(5) Assign a section that matches an existing section in the project, or create a new one only if clearly needed. ' +
          focusRule +
          '\n\nAfter generating suggestions, call create_story for each one you are confident about.';

        const payload: Record<string, unknown> = {
          instruction,
          project: { id: project.id, name: project.name },
          existing_stories_sample: existingStorySummary,
          existing_story_count: stories.length,
          next_available_id_prefix: prefix,
          next_available_id_number: nextNum,
          suggested_id_format: nextId,
          output_template: {
            suggestions: [
              {
                id: nextId,
                title: 'User can <verb> <object>',
                section: '<feature area>',
                description: '<1-2 sentence description of what the user can do and why>',
                status: 'not-implemented',
                acceptance_criteria: [
                  'Given <context>, when <action>, then <outcome>',
                  'Given <context>, when <action>, then <outcome>',
                ],
                confidence: 'high | medium | low',
                rationale: '<why this behaviour needs a story>',
              },
            ],
          },
        };

        if (args.diff) {
          payload['diff'] = args.diff.length > 16384
            ? args.diff.slice(0, 16384) + '\n...(truncated)'
            : args.diff;
        }
        if (fileContents.length > 0) {
          payload['files'] = fileContents;
        }

        const yaml = toYaml(payload);
        return { content: [{ type: 'text' as const, text: yaml }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text' as const, text: 'Error: ' + message }], isError: true };
      }
    }
  );

  // ── link_pr ────────────────────────────────────────────────────────────────

  server.tool(
    'link_pr',
    'Associate a pull request with the stories it implements or references. ' +
      'Writes pr_refs to each story, creating an audit trail between PRs and stories. ' +
      'Use when opening or merging a PR: call with story_ids set to all stories the PR contributes to. ' +
      'In file mode, writes directly to stories.yaml. In cloud mode, calls the Locus backend.',
    LinkPrParams,
    async (args) => {
      try {
        const result = await api.linkPr({
          pr_url: args.pr_url,
          pr_number: args.pr_number,
          pr_title: args.pr_title,
          story_ids: args.story_ids,
          link_type: args.link_type as 'implements' | 'partial' | 'refs',
          state: args.state as 'open' | 'merged' | 'closed',
          merged_at: args.merged_at,
        });

        const lines: string[] = [
          `✓ PR #${args.pr_number} linked to ${result.linked.length} stor${result.linked.length === 1 ? 'y' : 'ies'}.`,
        ];
        if (result.linked.length > 0) {
          lines.push(`  Linked: ${result.linked.join(', ')}`);
        }
        if (result.skipped.length > 0) {
          lines.push(`  Skipped (not found): ${result.skipped.join(', ')}`);
        }
        lines.push(
          '',
          `PR: ${args.pr_url}`,
          `Link type: ${args.link_type ?? 'implements'}`,
          `State: ${args.state ?? 'open'}`,
        );

        return { content: [{ type: 'text' as const, text: lines.join('\n') }] };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
      }
    }
  );

  // ── draft_story ───────────────────────────────────────────────────────────

  server.tool(
    'draft_story',
    'Convert a plain-language feature description into a properly formatted Locus story. ' +
      'Use this when a PM, designer, or engineer describes what they want to build in natural language. ' +
      'The tool infers the story structure, writes acceptance criteria, assigns the next available ID, ' +
      'and returns a ready-to-review story. ' +
      'After the user approves, call create_story to add it to stories.yaml.',
    {
      description: z.string().describe(
        'Plain-language description of the feature or user need. ' +
        'Can be a sentence, a paragraph, or bullet points. ' +
        'Example: "I want users to filter the vault list by status"'
      ),
      section: z.string().optional().describe(
        'Feature area this story belongs to. If omitted, inferred from the description and existing sections.'
      ),
      project_id: z.string().optional(),
    },
    async (args) => {
      try {
        const projectId = api.resolveProjectId(args.project_id);
        const { stories } = await api.getStories(projectId);

        // Determine next ID
        const existingIds = stories
          .map((s) => s.story_id)
          .filter((id) => /^[A-Z]+-\d+$/.test(id));
        const prefixes = [...new Set(existingIds.map((id) => id.split('-')[0]))];
        const prefix = prefixes[0] ?? 'US';
        const maxNum = existingIds
          .filter((id) => id.startsWith(prefix + '-'))
          .map((id) => parseInt(id.split('-')[1], 10))
          .reduce((max, n) => (n > max ? n : max), 0);
        const nextId = `${prefix}-${String(maxNum + 1).padStart(2, '0')}`;

        // Gather existing sections for context
        const sections = [...new Set(stories.map((s) => s.section).filter(Boolean))];

        const prompt = toYaml({
          task: 'Convert the following feature description into a Locus user story.',
          instructions: [
            'Write a verb-first title starting with "User can"',
            'Write 3-5 specific, testable acceptance criteria',
            'Each criterion should be a complete sentence describing observable behaviour',
            'Assign the story to the most appropriate section from the existing sections, or create a new one',
            `Use story_id: ${nextId}`,
            'Set status: not-implemented',
            'Do not invent requirements not implied by the description',
          ],
          feature_description: args.description,
          existing_sections: sections,
          output_format: {
            story_id: nextId,
            title: 'User can ...',
            description: '(one sentence: what the user can do and why)',
            section: '(pick from existing or create new)',
            status: 'not-implemented',
            acceptance_criteria: [
              '(specific, testable condition)',
              '(specific, testable condition)',
              '(specific, testable condition)',
            ],
            file_refs: '(optional: list source files that implement this story, e.g. ["src/vaults/VaultList.tsx"])',
          },
          next_step:
            'Present the draft story to the user for review. ' +
            'Then ask: "Do you know which files implement this story? ' +
            'Add them as file_refs for deterministic CI auditing — the audit action will only check this story when those files change in a PR. ' +
            'Example: file_refs: [\"src/vaults/VaultList.tsx\", \"src/hooks/useVaultFilter.ts\"] ' +
            'Glob patterns like src/deposit/**/*.ts are supported. ' +
            'You can skip this and add file_refs to stories.yaml manually later." ' +
            'If they approve and provide file_refs, call create_story with file_refs set. ' +
            'If they approve without file_refs, call create_story without file_refs.',
        });

        return {
          content: [{
            type: 'text' as const,
            text:
              `Draft story ready for review (ID: ${nextId}).\n\n` +
              `Use the following context to write the story, then present it to the user:\n\n` +
              prompt,
          }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { content: [{ type: 'text' as const, text: `Error: ${message}` }], isError: true };
      }
    }
  );

  // ── Transport ───────────────────────────────────────────────────────────────

  const transport = new StdioServerTransport();
  await server.connect(transport);

  const modeLabel = 'fileMode' in config ? 'file mode' : `cloud mode (project: ${'defaultProjectId' in config ? (config as ApiConfig).defaultProjectId ?? 'not set' : 'not set'})`;
  process.stderr.write(`[locus-mcp] Server started in ${modeLabel}\n`);
}
