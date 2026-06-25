/**
 * MCP Tools for the Locus MCP server.
 *
 * Tools are callable by Claude Code to query or update stories dynamically.
 *
 * Tools:
 *   list_stories       — list stories with optional status/section filters
 *   get_story          — get full detail for a single story by ID
 *   get_active_story   — get the story currently being implemented (used by Story Guard)
 *   mark_story_status  — update implementation status (closes the audit loop)
 *   find_stories       — full-text search across story titles, descriptions, and acceptance criteria
 *   get_coverage       — get implementation coverage summary for a project
 */

import { stringify as toYaml } from 'yaml';
import { z } from 'zod';
import type { PrototyperApiClient } from './api.js';
import type { StoryStatus } from './types.js';

// ─── Input schemas (Zod → JSON Schema for MCP) ───────────────────────────────

export const ListStoriesInput = z.object({
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
    .describe(
      'Filter by feature section/area (case-insensitive partial match). Optional.'
    ),
});

export const GetStoryInput = z.object({
  story_id: z
    .string()
    .describe('Story ID in the format PREFIX-NUMBER (e.g. US-01, AUTH-03).'),
  project_id: z
    .string()
    .optional()
    .describe(
      'Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.'
    ),
});

export const GetActiveStoryInput = z.object({
  project_id: z
    .string()
    .optional()
    .describe(
      'Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.'
    ),
});

export const MarkStoryStatusInput = z.object({
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
    .describe(
      'Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.'
    ),
});

// ─── Tool definitions (MCP-compatible JSON Schema) ────────────────────────────

export const TOOL_DEFINITIONS = [
  {
    name: 'list_stories',
    description:
      'List user stories for a Locus project. Returns stories with their IDs, titles, statuses, and acceptance criteria. ' +
      'Use this to understand what the product is supposed to do before writing or reviewing code. ' +
      'Tip: call with status="not-implemented" at the start of an implementation session to see what still needs to be built.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        project_id: {
          type: 'string',
          description:
            'Locus project ID. If omitted, uses the PROTOTYPER_PROJECT_ID environment variable.',
        },
        status: {
          type: 'string',
          enum: ['not-implemented', 'partial', 'implemented', 'stale', 'deprecated', 'all'],
          description: 'Filter by implementation status. Default: all.',
        },
        section: {
          type: 'string',
          description:
            'Filter by feature section/area (case-insensitive partial match). Optional.',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_story',
    description:
      'Get full detail for a single user story, including description and acceptance criteria. ' +
      'Use when you need to understand exactly what to build for a specific story ID.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        story_id: {
          type: 'string',
          description: 'Story ID in the format PREFIX-NUMBER (e.g. US-01, AUTH-03).',
        },
        project_id: {
          type: 'string',
          description:
            'Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.',
        },
      },
      required: ['story_id'],
    },
  },
  {
    name: 'get_active_story',
    description:
      'Get the story currently being implemented — the story in "partial" status with the most recent activity, ' +
      'or the first "not-implemented" story if none are in progress. ' +
      'Used by Story Guard PostToolUse hooks to check whether an agent action falls within the active story\'s acceptance criteria. ' +
      'Call this in a PostToolUse hook that fires after every tool (file writes, bash commands, API calls) to verify agent scope.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        project_id: {
          type: 'string',
          description:
            'Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.',
        },
      },
      required: [],
    },
  },
  {
    name: 'find_stories',
    description:
      'Full-text search across all story titles, descriptions, and acceptance criteria for a Locus project. ' +
      'Use when you want to find stories related to a specific feature, component, or keyword.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        query: {
          type: 'string',
          description: 'Search term to match against story content.',
        },
        project_id: {
          type: 'string',
          description: 'Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_coverage',
    description:
      'Get implementation coverage summary for a Locus project. ' +
      'Returns total stories, counts by status, and overall coverage percentage. ' +
      'Use at the start or end of a session to understand overall project health.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        project_id: {
          type: 'string',
          description: 'Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.',
        },
      },
      required: [],
    },
  },
  {
    name: 'mark_story_status',
    description:
      'Update the implementation status of a user story. ' +
      'Use when you have finished implementing a story and want to record it as "implemented", ' +
      'or when partial progress has been made. ' +
      'This closes the audit loop: the Locus dashboard updates immediately.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        story_id: {
          type: 'string',
          description: 'Story ID to update.',
        },
        status: {
          type: 'string',
          enum: ['not-implemented', 'partial', 'implemented'],
          description: 'New implementation status to set.',
        },
        notes: {
          type: 'string',
          description:
            'Optional implementation notes (e.g. PR number, component name, known limitations).',
        },
        project_id: {
          type: 'string',
          description:
            'Locus project ID. Optional if PROTOTYPER_PROJECT_ID is configured.',
        },
      },
      required: ['story_id', 'status'],
    },
  },
] as const;

// ─── Tool call handlers ───────────────────────────────────────────────────────

export interface ToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

export async function callTool(
  name: string,
  args: Record<string, unknown>,
  api: PrototyperApiClient
): Promise<ToolResult> {
  try {
    switch (name) {
      case 'list_stories': {
        const input = ListStoriesInput.parse(args);
        const projectId = api.resolveProjectId(input.project_id);
        const status = input.status === 'all' ? undefined : (input.status as StoryStatus);
        const { project, stories } = await api.getStories(projectId, {
          status,
          section: input.section,
        });

        const yaml = toYaml({
          project: { id: project.id, name: project.name },
          filter: { status: input.status, section: input.section ?? 'all' },
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

        return {
          content: [
            {
              type: 'text',
              text:
                stories.length === 0
                  ? `No stories found in Locus project "${project.name}" with the given filters.`
                  : yaml,
            },
          ],
        };
      }

      case 'get_story': {
        const input = GetStoryInput.parse(args);
        const projectId = api.resolveProjectId(input.project_id);
        const story = await api.getStory(projectId, input.story_id);

        if (!story) {
          return {
            content: [
              {
                type: 'text',
                text: `Story "${input.story_id}" not found in project ${projectId}.`,
              },
            ],
            isError: true,
          };
        }

        return { content: [{ type: 'text', text: toYaml(story) }] };
      }

      case 'get_active_story': {
        const input = GetActiveStoryInput.parse(args);
        const projectId = api.resolveProjectId(input.project_id);
        const { project, stories } = await api.getStories(projectId);

        // Active story: first 'partial' story, or first 'not-implemented' story if none partial
        const activeStory =
          stories.find((s) => s.status === 'partial') ??
          stories.find((s) => s.status === 'not-implemented');

        if (!activeStory) {
          const hasStories = stories.length > 0;
          const nextStep = hasStories
            ? `All ${stories.length} stories in "${project.name}" are already implemented. To start new work, create a story at https://locus.dev or add a not-implemented story to your stories.yaml file.`
            : `No stories found in Locus project "${project.name}". Create your first story at https://locus.dev or define one in a stories.yaml file — see the spec at https://locus.dev/spec/v1`;
          return {
            content: [
              {
                type: 'text',
                text: nextStep,
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

        return { content: [{ type: 'text', text: yaml }] };
      }

      case 'mark_story_status': {
        const input = MarkStoryStatusInput.parse(args);
        const projectId = api.resolveProjectId(input.project_id);

        await api.markStoryStatus(projectId, input.story_id, input.status, input.notes);

        return {
          content: [
            {
              type: 'text',
              text:
                `✓ Story ${input.story_id} marked as "${input.status}".` +
                (input.notes ? `\nNotes: ${input.notes}` : '') +
                '\nThe Locus dashboard has been updated.',
            },
          ],
        };
      }

      case 'find_stories': {
        const query = (args['query'] as string | undefined)?.toLowerCase() ?? '';
        const projectId = api.resolveProjectId(args['project_id'] as string | undefined);
        if (!query) {
          return {
            content: [{ type: 'text', text: 'Error: query parameter is required for find_stories.' }],
            isError: true,
          };
        }
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
        const yaml = toYaml({
          project: { id: project.id, name: project.name },
          query,
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
        return {
          content: [
            {
              type: 'text',
              text: matches.length === 0
                ? `No stories matched "${query}" in Locus project "${project.name}".`
                : yaml,
            },
          ],
        };
      }

      case 'get_coverage': {
        const projectId = api.resolveProjectId(args['project_id'] as string | undefined);
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
        return { content: [{ type: 'text', text: yaml }] };
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown Locus MCP tool: ${name}` }],
          isError: true,
        };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: 'text', text: `Error: ${message}` }],
      isError: true,
    };
  }
}
