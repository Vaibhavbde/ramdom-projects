/**
 * Prototyper REST API client for the MCP server.
 * Calls Supabase Edge Functions with a user JWT in the Authorization header.
 *
 * Current backend surface used:
 *   GET  /functions/v1/stories-export?project_id=<uuid>   → StoriesExportEnvelope
 *   GET  /functions/v1/list-projects                       → Project[]  (to be added)
 *   PATCH /functions/v1/story-status                       → { ok: true }  (to be added)
 */

import type { ApiConfig, LinkPrInput, Project, Story, StoryStatus, StoriesExportEnvelope } from './types.js';

export class PrototyperApiClient {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private url(path: string): string {
    const base = this.config.supabaseUrl.replace(/\/$/, '');
    return `${base}/functions/v1/${path}`;
  }

  /**
   * List all projects the authenticated user is a member of.
   * NOTE: Requires the `list-projects` edge function to be deployed.
   * Until it exists, falls back gracefully with an informative error.
   */
  async listProjects(): Promise<Project[]> {
    const resp = await fetch(this.url('list-projects'), {
      method: 'GET',
      headers: this.headers,
    });

    if (resp.status === 404) {
      // Edge function not yet deployed — return helpful message as an error
      throw new Error(
        'list-projects endpoint not yet available. ' +
        'Set PROTOTYPER_PROJECT_ID to use a specific project, or deploy the list-projects function.'
      );
    }

    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      throw new Error(`list-projects failed (${resp.status}): ${body}`);
    }

    const data = (await resp.json()) as { projects: Project[] };
    return data.projects ?? [];
  }

  /**
   * Fetch all stories for a project using the existing stories-export endpoint.
   * Supports optional status and section filters (applied client-side, since the
   * edge function currently returns all stories; server-side filter can be added later).
   */
  async getStories(
    projectId: string,
    filters?: { status?: StoryStatus | 'all'; section?: string }
  ): Promise<{ project: Project; stories: Story[] }> {
    const resp = await fetch(
      this.url(`stories-export?project_id=${encodeURIComponent(projectId)}`),
      { method: 'GET', headers: this.headers }
    );

    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      throw new Error(`stories-export failed (${resp.status}): ${body}`);
    }

    const envelope = (await resp.json()) as StoriesExportEnvelope;
    let stories = envelope.stories;

    // Client-side filtering
    if (filters?.status && filters.status !== 'all') {
      stories = stories.filter((s) => s.status === filters.status);
    }
    if (filters?.section) {
      const sec = filters.section.toLowerCase();
      stories = stories.filter((s) => s.section.toLowerCase().includes(sec));
    }

    return { project: envelope.project, stories };
  }

  /**
   * Get a single story by story_id (e.g. "US-01").
   */
  async getStory(projectId: string, storyId: string): Promise<Story | null> {
    const { stories } = await this.getStories(projectId);
    return stories.find((s) => s.story_id === storyId) ?? null;
  }

  /**
   * Update the status (and optionally notes) of a single story.
   * NOTE: Requires the `story-status` edge function to be deployed.
   * Until it exists, returns a clear error rather than silently failing.
   */
  async markStoryStatus(
    projectId: string,
    storyId: string,
    status: StoryStatus,
    notes?: string
  ): Promise<void> {
    const resp = await fetch(this.url('story-status'), {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({ project_id: projectId, story_id: storyId, status, notes }),
    });

    if (resp.status === 404) {
      throw new Error(
        'story-status endpoint not yet deployed. ' +
        'The mark_story_status tool requires a backend PATCH endpoint — see MCP server spec for details.'
      );
    }

    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      throw new Error(`story-status update failed (${resp.status}): ${body}`);
    }
  }

  /**
   * Associate a PR with one or more stories via the link-pr edge function.
   * Falls back gracefully if the endpoint is not yet deployed.
   */
  async linkPr(input: LinkPrInput): Promise<{ linked: string[]; skipped: string[] }> {
    const resp = await fetch(this.url('link-pr'), {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(input),
    });

    if (resp.status === 404) {
      throw new Error(
        'link-pr endpoint not yet deployed. ' +
        'Deploy the link-pr edge function, or use file mode to write pr_refs directly.'
      );
    }

    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      throw new Error(`link-pr failed (${resp.status}): ${body}`);
    }

    const data = (await resp.json()) as { linked: string[]; skipped: string[] };
    return data;
  }

  /** Resolve project ID: use provided, then default, then throw. */
  resolveProjectId(explicit?: string): string {
    const id = explicit ?? this.config.defaultProjectId;
    if (!id) {
      throw new Error(
        'No project_id provided and PROTOTYPER_PROJECT_ID is not set. ' +
        'Pass project_id explicitly or set the environment variable.'
      );
    }
    return id;
  }
}
