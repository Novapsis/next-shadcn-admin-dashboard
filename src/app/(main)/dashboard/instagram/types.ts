export interface InstagramEntry {
  id: number;
  search_term: string;
  username: string;
  profile_url: string;
  full_name: string;
  biography: string;
  external_urls: { url: string }[]; // JSONB array of objects with a 'url' property
  followers_count: number;
  score: number;
  reason: string;
  created_at: string;
}
