CREATE TABLE IF NOT EXISTS build_submissions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  contributor_name TEXT NOT NULL,
  contact TEXT,
  hero_class TEXT NOT NULL,
  spec TEXT,
  role TEXT CHECK (role IS NULL OR role IN ('DPS', 'Healer', 'Tank')),
  title TEXT NOT NULL,
  description TEXT,
  runes TEXT,
  rotation TEXT,
  gear TEXT,
  talents TEXT,
  notes TEXT,
  review_notes TEXT,
  approved_build_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  content_type_json TEXT NOT NULL DEFAULT '[]',
  image_paths_json TEXT NOT NULL DEFAULT '[]',
  image_groups_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_build_submissions_user ON build_submissions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_build_submissions_status ON build_submissions(status, created_at DESC);

CREATE TABLE IF NOT EXISTS build_edit_requests (
  id TEXT PRIMARY KEY,
  build_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  request_notes TEXT,
  review_notes TEXT,
  proposed_title TEXT,
  proposed_description TEXT,
  proposed_spec TEXT,
  proposed_role TEXT CHECK (proposed_role IS NULL OR proposed_role IN ('DPS', 'Healer', 'Tank')),
  proposed_intro_text TEXT,
  proposed_talent_tips TEXT,
  proposed_image TEXT,
  proposed_content_type_json TEXT NOT NULL DEFAULT '[]',
  proposed_images_json TEXT NOT NULL DEFAULT '{}',
  proposed_accessories TEXT,
  proposed_gear_text TEXT,
  proposed_rune_text TEXT,
  proposed_skill_text TEXT,
  proposed_refine_text TEXT,
  proposed_misc_text TEXT,
  proposed_details TEXT,
  reviewed_at TEXT,
  reviewed_by TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_build_edit_requests_user ON build_edit_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_build_edit_requests_build ON build_edit_requests(build_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_build_edit_requests_status ON build_edit_requests(status, created_at DESC);

CREATE TABLE IF NOT EXISTS content_contributions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  contributor_name TEXT NOT NULL,
  contribution_type TEXT NOT NULL CHECK (contribution_type IN ('build', 'guide', 'update')),
  source_table TEXT,
  source_id TEXT,
  title TEXT NOT NULL,
  published_url TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_contributions_status ON content_contributions(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_contributions_name ON content_contributions(contributor_name COLLATE NOCASE);
CREATE INDEX IF NOT EXISTS idx_content_contributions_user ON content_contributions(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS content_overrides (
  content_type TEXT NOT NULL CHECK (content_type IN ('guide', 'build')),
  content_id TEXT NOT NULL,
  data_json TEXT NOT NULL,
  owner_user_id TEXT,
  updated_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT NOT NULL,
  PRIMARY KEY (content_type, content_id)
);

CREATE INDEX IF NOT EXISTS idx_content_overrides_owner ON content_overrides(owner_user_id, content_type);
CREATE INDEX IF NOT EXISTS idx_content_overrides_updated ON content_overrides(updated_at DESC);
