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
