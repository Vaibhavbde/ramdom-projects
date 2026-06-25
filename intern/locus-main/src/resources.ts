/**
 * MCP Resources for the Prototyper MCP server.
 *
 * Resources are read-only data Claude Code ingests as context.
 *
 * URI scheme:
 *   prototyper://projects                                   → project list
 *   prototyper://projects/{project_id}/stories              → all stories (YAML)
 *   prototyper://projects/{project_id}/stories/{story_id}   → single story (YAML)
 */

import { stringify as toYaml } from 'yaml';
import type { PrototyperApiClient } from './api.js';

// URI patterns
const URI_PROJECTS = 'prototyper://projects';
const URI_STORIES_ALL = /^prototyper:\/\/projects\/([^/]+)\/stories$/;
const URI_STORY_SINGLE = /^prototyper:\/\/projects\/([^/]+)\/stories\/([^/]+)$/;
const URI_STORIES_STATUS = /^prototyper:\/\/projects\/([^/]+)\/stories\?status=([^&]+)$/;

export interface McpResource {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
}

export interface McpResourceContent {
  uri: string;
  mimeType: string;
  text: string;
}

/**
 * Returns the static resource list (what Claude Code sees in the resource panel).
 * Project-specific resources are discovered dynamically at read time.
 */
export function listResources(defaultProjectId?: string): McpResource[] {
  const resources: McpResource[] = [
    {
      uri: URI_PROJECTS,
      name: 'Prototyper Projects',
      description: 'All projects in the connected Prototyper account.',
      mimeType: 'application/json',
    },
  ];

  if (defaultProjectId) {
    resources.push(
      {
        uri: `prototyper://projects/${defaultProjectId}/stories`,
        name: 'Stories (default project)',
        description:
          'All user stories for the default Prototyper project. Use this as implementation context.',
        mimeType: 'text/yaml',
      },
      {
        uri: `prototyper://projects/${defaultProjectId}/stories?status=not-implemented`,
        name: 'Unimplemented Stories (default project)',
        description:
          'Stories not yet built — the most useful context for a new implementation session.',
        mimeType: 'text/yaml',
      }
    );
  }

  return resources;
}

/**
 * Read a resource by URI. Returns content for any valid prototyper:// URI.
 */
export async function readResource(
  uri: string,
  api: PrototyperApiClient
): Promise<McpResourceContent> {
  // prototyper://projects
  if (uri === URI_PROJECTS) {
    const projects = await api.listProjects();
    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(projects, null, 2),
    };
  }

  // prototyper://projects/{id}/stories?status=<status>
  const statusMatch = URI_STORIES_STATUS.exec(uri);
  if (statusMatch) {
    const projectId = statusMatch[1];
    const status = statusMatch[2] as 'not-implemented' | 'partial' | 'implemented';
    const { project, stories } = await api.getStories(projectId, { status });
    const yaml = toYaml({
      schema_version: '1.1',
      project: { id: project.id, name: project.name },
      filter: { status },
      stories,
    });
    return { uri, mimeType: 'text/yaml', text: yaml };
  }

  // prototyper://projects/{id}/stories/{story_id}
  const singleMatch = URI_STORY_SINGLE.exec(uri);
  if (singleMatch) {
    const projectId = singleMatch[1];
    const storyId = decodeURIComponent(singleMatch[2]);
    const story = await api.getStory(projectId, storyId);
    if (!story) {
      throw new Error(`Story ${storyId} not found in project ${projectId}`);
    }
    return { uri, mimeType: 'text/yaml', text: toYaml(story) };
  }

  // prototyper://projects/{id}/stories
  const allMatch = URI_STORIES_ALL.exec(uri);
  if (allMatch) {
    const projectId = allMatch[1];
    const { project, stories } = await api.getStories(projectId);
    const yaml = toYaml({
      schema_version: '1.1',
      project: { id: project.id, name: project.name },
      stories,
    });
    return { uri, mimeType: 'text/yaml', text: yaml };
  }

  throw new Error(`Unknown Prototyper resource URI: ${uri}`);
}
