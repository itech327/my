-- Base D1 du tableau de bord enseignant.
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  cls TEXT NOT NULL DEFAULT '',
  sid TEXT NOT NULL,
  type TEXT NOT NULL,
  app TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  data TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS events_cls_ts ON events (cls, ts);
CREATE INDEX IF NOT EXISTS events_sid ON events (sid);

-- Jeu « الباب الموالي » : événements anonymes (aucune colonne de nom, par construction).
CREATE TABLE IF NOT EXISTS bab_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  cls TEXT NOT NULL CHECK (length(cls) BETWEEN 3 AND 12),
  sid TEXT NOT NULL CHECK (length(sid) BETWEEN 6 AND 20),
  chapter TEXT NOT NULL CHECK (length(chapter) BETWEEN 3 AND 40),
  type TEXT NOT NULL CHECK (type IN ('listen','start','frag','miss','key','done','chest')),
  door INTEGER NOT NULL CHECK (door BETWEEN 0 AND 3)
);
CREATE INDEX IF NOT EXISTS bab_events_cls_chapter_ts ON bab_events (cls, chapter, ts);
CREATE INDEX IF NOT EXISTS bab_events_ts ON bab_events (ts);
