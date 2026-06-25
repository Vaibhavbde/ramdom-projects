// Prototyper story schema types — mirrors database.ts in the web package

export type StoryStatus = 'not-implemented' | 'partial' | 'implemented' | 'stale' | 'deprecated';

export interface Story {
  id: string;
  story_id: string;
  title: string;
  description: string;
  section: string;
  status: StoryStatus;
  priority: number;
  version?: number;
  created_at: string;
  updated_at: string;
  pr_refs?: PRRef[];
  // v1.1 spec fields
  acceptance_criteria?: string[] | null;
  depends_on?: string[] | null;
  design_ref?: string | null;
  test_refs?: string[] | null;
  notes?: string | null;
  assignee?: string | null;
  reviewer?: string | null;
  jira_key?: string | null;
  // v1.1.8 — cross-cutting tags
  tags?: string[] | null;
  // v1.3 — deterministic audit triggering
  file_refs?: string[] | null;
}

export interface LinkPrInput {
  pr_url: string;
  pr_number: number;
  pr_title?: string | null;
  repo?: string | null;
  story_ids: string[];
  link_type?: 'implements' | 'partial' | 'refs';
  state?: 'open' | 'merged' | 'closed';
  merged_at?: string | null;
}

export interface PRRef {
  pr_url: string;
  pr_number: number;
  pr_title: string | null;
  repo: string;
  link_type: 'implements' | 'partial' | 'refs';
  state: 'open' | 'merged' | 'closed';
  merged_at: string | null;
}

export interface Project {
  id: string;
  name: string;
  created_at: string;
}

export interface StoriesExportEnvelope {
  schema_version: string;
  project: Project;
  exported_at: string;
  stories: Story[];
}

export interface ApiConfig {
  /** Supabase project URL — e.g. https://xyz.supabase.co */
  supabaseUrl: string;
  /** User JWT or service-role key for authenticating requests */
  apiKey: string;
  /** Optional default project ID — avoids passing project_id every call */
  defaultProjectId?: string;
}
