-- Sada on Cloudflare D1 (SQLite). Same rules as replica/schema.sql (Postgres):
-- credit lots spent soonest-expiring first, reserve before synthesis, release the
-- unused part, one free regeneration, one free trial per email ever.
-- Times are milliseconds since epoch (INTEGER). Ids are UUID text.
-- Apply: npx wrangler d1 migrations apply sada --remote

CREATE TABLE users (
  id           TEXT PRIMARY KEY,
  email        TEXT NOT NULL UNIQUE COLLATE NOCASE,
  pass_hash    TEXT NOT NULL,
  display_name TEXT,
  created_at   INTEGER NOT NULL
);

-- Only a SHA-256 of each session token is stored, so a database leak gives no sessions.
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX sessions_user ON sessions(user_id);

-- Kept after account deletion on purpose: no second free minute for the same email.
CREATE TABLE trial_claims (
  email_hash TEXT PRIMARY KEY,
  claimed_at INTEGER NOT NULL
);

-- seconds_left can never go negative: a concurrent spend makes the whole batch fail.
CREATE TABLE credit_lots (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source       TEXT NOT NULL CHECK (source IN ('trial', 'purchase')),
  seconds_total INTEGER NOT NULL CHECK (seconds_total > 0),
  seconds_left INTEGER NOT NULL CHECK (seconds_left >= 0 AND seconds_left <= seconds_total),
  expires_at   INTEGER,
  created_at   INTEGER NOT NULL
);
CREATE INDEX credit_lots_user ON credit_lots(user_id, expires_at);

CREATE TABLE generations (
  id                TEXT PRIMARY KEY,
  user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind              TEXT NOT NULL DEFAULT 'tts',
  voice_id          TEXT NOT NULL,
  dialect           TEXT NOT NULL,
  input_text        TEXT NOT NULL,
  char_count        INTEGER NOT NULL,
  word_count        INTEGER NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('queued', 'done', 'failed')),
  seconds_reserved  INTEGER NOT NULL DEFAULT 0,
  seconds_charged   INTEGER,
  error             TEXT,
  regenerated_from  TEXT REFERENCES generations(id) ON DELETE SET NULL,
  is_free_regen     INTEGER NOT NULL DEFAULT 0,
  style             TEXT,
  delivery          TEXT,
  pace              TEXT,
  register          TEXT,
  audio_mime        TEXT,
  expires_at        INTEGER NOT NULL,
  created_at        INTEGER NOT NULL
);
CREATE INDEX generations_user ON generations(user_id, created_at DESC);
-- At most one free regeneration per original.
CREATE UNIQUE INDEX generations_one_free_regen ON generations(regenerated_from) WHERE is_free_regen = 1;

-- Every reserve (negative) and release (positive), per lot and generation.
CREATE TABLE credit_ledger (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lot_id        TEXT NOT NULL REFERENCES credit_lots(id) ON DELETE CASCADE,
  generation_id TEXT NOT NULL,
  delta         INTEGER NOT NULL,
  created_at    INTEGER NOT NULL
);
CREATE INDEX credit_ledger_generation ON credit_ledger(generation_id);
