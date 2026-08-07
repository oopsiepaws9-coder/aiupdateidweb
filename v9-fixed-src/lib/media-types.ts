export type MediaItem = {
  id: string;
  file_name: string;
  file_path: string;
  public_url: string;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  photographer: string | null;
  source: string | null;
  folder: string | null;
  created_at: string;
  updated_at: string;
};
