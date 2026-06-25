/**
 * File-based client for the Locus MCP server.
 *
 * Reads stories directly from a stories.yaml (or stories.json) file in the repo.
 * No credentials, no cloud, no account required.
 *
 * File discovery order:
 *   1. LOCUS_STORIES_PATH env var (explicit path)
 *   2. stories.yaml in cwd
 *   3. Walk up directory tree to find stories.yaml at repo root
 *   4. stories.json (same search order)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import type { LinkPrInput, Project, PRRef, Story, StoryStatus } from './types.js';

interface StoriesFile {
  version?: string;
  project?: { id?: string; name?: string };
  stories: RawStory[];
}

interface RawPRRef {
  pr_url: string;
  pr_number: number;
  pr_title?: string | null;
  repo?: string;
  link_type?: string;
  state?: string;
  merged_at?: string | null;
}

interface RawStory {
  id: string;
  title: string;
  description?: string;
  section?: string;
  status?: StoryStatus;
  priority?: number;
  acceptance_criteria?: string[];
  depends_on?: string[];
  design_ref?: string;
  test_refs?: string[];
  pr_refs?: RawPRRef[];
  file_refs?: string[];
  [key: string]: unknown;
}

function findStoriesFile(): string {
  // 1. Explicit env var
  const envPath = process.env['LOCUS_STORIES_PATH'];
  if (envPath) {
    const resolved = resolve(envPath);
    if (existsSync(resolved)) return resolved;
    throw new Error(`LOCUS_STORIES_PATH is set but file not found: ${resolved}`);
  }

  // 2. Walk up from cwd looking for stories.yaml or stories.json
  let dir = process.cwd();
  const maxDepth = 10;

  for (let i = 0; i < maxDepth; i++) {
    for (const name of ['stories.yaml', 'stories.yml', 'stories.json']) {
      const candidate = join(dir, name);
      if (existsSync(candidate)) return candidate;
    }
    // Stop at filesystem root or when dirname doesn't change
    const parent = dirname(dir);
    if (parent === dir) break;
    // Stop at git root
    if (existsSync(join(dir, '.git'))) break;
    dir = parent;
  }

  throw new Error(
    'No stories.yaml found. Create one in your project root, or set LOCUS_STORIES_PATH.\n' +
    'See https://locus.dev/spec/v1 for the format.'
  );
}

function readStoriesFile(filePath: string): StoriesFile {
  const raw = readFileSync(filePath, 'utf-8');
  if (filePath.endsWith('.json')) {
    return JSON.parse(raw) as StoriesFile;
  }
  return parseYaml(raw) as StoriesFile;
}

function normaliseStory(raw: RawStory, index: number): Story {
  return {
    id: raw.id ?? `story-${index}`,
    story_id: raw.id ?? `story-${index}`,
    title: raw.title ?? '(untitled)',
    description: raw.description ?? '',
    section: raw.section ?? 'General',
    status: (raw.status ?? 'not-implemented') as StoryStatus,
    priority: raw.priority ?? index,
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    acceptance_criteria: raw.acceptance_criteria ?? null,
    depends_on: raw.depends_on ?? null,
    design_ref: raw.design_ref ?? null,
    test_refs: raw.test_refs ?? null,
    pr_refs: [],
    file_refs: raw.file_refs ?? null,
  };
}

export class FileApiClient {
  private filePath: string;

  constructor(filePath?: string) {
    this.filePath = filePath ?? findStoriesFile();
    process.stderr.write(`[locus-mcp] Using stories file: ${this.filePath}\n`);
  }

  async getStories(
    _projectId: string,
    filters?: { status?: StoryStatus | 'all'; section?: string }
  ): Promise<{ project: Project; stories: Story[] }> {
    const file = readStoriesFile(this.filePath);
    let stories = (file.stories ?? []).map(normaliseStory);

    if (filters?.status && filters.status !== 'all') {
      stories = stories.filter((s) => s.status === filters.status);
    }
    if (filters?.section) {
      const sec = filters.section.toLowerCase();
      stories = stories.filter((s) => s.section.toLowerCase().includes(sec));
    }

    const project: Project = {
      id: file.project?.id ?? 'local',
      name: file.project?.name ?? this.filePath.split('/').slice(-2).join('/'),
      created_at: new Date().toISOString(),
    };

    return { project, stories };
  }

  async getStory(_projectId: string, storyId: string): Promise<Story | null> {
    const { stories } = await this.getStories('local');
    return stories.find((s) => s.story_id === storyId) ?? null;
  }

  async markStoryStatus(
    _projectId: string,
    storyId: string,
    status: StoryStatus,
    notes?: string
  ): Promise<void> {
    const raw = readFileSync(this.filePath, 'utf-8');
    const file = parseYaml(raw) as StoriesFile;

    const story = file.stories.find((s) => s.id === storyId);
    if (!story) {
      throw new Error(`Story "${storyId}" not found in ${this.filePath}`);
    }

    story.status = status;
    if (notes) {
      (story as Record<string, unknown>)['notes'] = notes;
    }

    const updated = stringifyYaml(file, { lineWidth: 120 });
    writeFileSync(this.filePath, updated, 'utf-8');
    process.stderr.write(`[locus-mcp] Updated ${storyId} → ${status} in ${this.filePath}\n`);
  }

  async createStory(story: Partial<RawStory> & { id: string; title: string }): Promise<void> {
    const raw = readFileSync(this.filePath, 'utf-8');
    const file = parseYaml(raw) as StoriesFile;
    file.stories = file.stories ?? [];
    file.stories.push({
      id: story.id,
      title: story.title,
      description: story.description ?? '',
      section: story.section ?? 'General',
      status: (story.status ?? 'not-implemented') as StoryStatus,
      ...(story.acceptance_criteria ? { acceptance_criteria: story.acceptance_criteria } : {}),
      ...(story.depends_on ? { depends_on: story.depends_on } : {}),
      ...(story.file_refs ? { file_refs: story.file_refs } : {}),
    });
    writeFileSync(this.filePath, stringifyYaml(file, { lineWidth: 120 }), 'utf-8');
    process.stderr.write(`[locus-mcp] Created story ${story.id} in ${this.filePath}\n`);
  }

  /**
   * Write pr_refs to each of the given story IDs in stories.yaml.
   * Deduplicates by pr_url so re-running is safe.
   */
  async linkPr(input: LinkPrInput): Promise<{ linked: string[]; skipped: string[] }> {
    const raw = readFileSync(this.filePath, 'utf-8');
    const file = parseYaml(raw) as StoriesFile;
    const linked: string[] = [];
    const skipped: string[] = [];

    for (const storyId of input.story_ids) {
      const story = file.stories.find((s) => s.id === storyId);
      if (!story) {
        skipped.push(storyId);
        continue;
      }
      story.pr_refs = story.pr_refs ?? [];
      // Deduplicate: if the same pr_url already exists, update it in place
      const existing = story.pr_refs.findIndex((r) => r.pr_url === input.pr_url);
      const ref: RawPRRef = {
        pr_url: input.pr_url,
        pr_number: input.pr_number,
        pr_title: input.pr_title ?? null,
        repo: input.repo ?? new URL(input.pr_url).pathname.split('/').slice(1, 3).join('/'),
        link_type: input.link_type ?? 'implements',
        state: input.state ?? 'open',
        merged_at: input.merged_at ?? null,
      };
      if (existing >= 0) {
        story.pr_refs[existing] = ref;
      } else {
        story.pr_refs.push(ref);
      }
      linked.push(storyId);
    }

    if (linked.length > 0) {
      writeFileSync(this.filePath, stringifyYaml(file, { lineWidth: 120 }), 'utf-8');
      process.stderr.write(`[locus-mcp] link_pr: wrote pr_refs for PR #${input.pr_number} to stories [${linked.join(', ')}]\n`);
    }

    return { linked, skipped };
  }

  /** File mode has no project concept — just return a synthetic ID */
  resolveProjectId(_explicit?: string): string {
    return 'local';
  }

  listProjects(): Promise<Project[]> {
    return Promise.resolve([{
      id: 'local',
      name: this.filePath.split('/').slice(-2).join('/'),
      created_at: new Date().toISOString(),
    }]);
  }
}
