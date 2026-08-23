export type PromptItem = {
  id: string;
  title: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  prompt_text: string;
  tool_slug?: string | null;
  tool_name?: string | null;
  level?: string | null;
  variables?: string[] | null;
  example_input?: string | null;
  example_output?: string | null;
  tips?: string[] | null;
  tags?: string[] | null;
  faq?: Array<{question?: string; answer?: string}> | null;
  featured?: boolean | null;
  status?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  view_count?: number | null;
  copy_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PromptListItem = Pick<
  PromptItem,
  | "id"
  | "title"
  | "slug"
  | "category"
  | "description"
  | "tool_slug"
  | "tool_name"
  | "level"
  | "variables"
  | "tags"
  | "featured"
>;
