-- Schema for the ArabyVoice-style TTS clone. Postgres on Supabase.
-- Access: row level security on every table. Credit changes only through
-- the security definer functions at the bottom, never from the client.
-- Units: audio is metered in whole seconds. Money is integer minor units.

create extension if not exists pgcrypto;

create type dialect as enum (
  'ar-MA','ar-DZ','ar-TN','ar-LY','ar-MR',          -- Maghreb
  'ar-EG',                                          -- Egypt
  'ar-SA','ar-AE','ar-KW','ar-QA','ar-BH','ar-OM',  -- Gulf
  'ar-IQ','ar-JO','ar-LB','ar-PS',                  -- Levant, Iraq
  'ar-fusha'                                        -- Modern Standard
);

create or replace function touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

-- 1. profiles: one row per auth user
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'ar' check (locale in ('ar','fr','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. free-trial claims: survives account deletion, so a re-signup with the
-- same email gets no second free minute. Stores a hash, not the email.
create table trial_claims (
  email_hash bytea primary key,           -- sha256(lower(trim(email)) || pepper)
  claimed_at timestamptz not null default now()
);

-- 3. purchases: one per paid order
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete restrict,  -- kept for accounting
  pack text not null check (pack in ('starter','creator','studio')),
  seconds_granted int not null check (seconds_granted > 0),
  amount_minor int not null check (amount_minor >= 0),
  currency char(3) not null,              -- USD, MAD, SAR, EGP ...
  provider text not null,                 -- stripe | paddle | lemonsqueezy
  provider_ref text not null,
  status text not null default 'pending'
    check (status in ('pending','paid','refunded','failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_ref)
);
create index on purchases (user_id, created_at desc);

-- 4. credit lots: each grant of seconds, spent soonest-expiring first
create table credit_lots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  source text not null check (source in ('trial','purchase','admin','refund')),
  purchase_id uuid references purchases(id) on delete set null,
  seconds_total int not null check (seconds_total > 0),
  seconds_left int not null check (seconds_left >= 0),
  expires_at timestamptz,                 -- null = never expires
  created_at timestamptz not null default now(),
  constraint left_le_total check (seconds_left <= seconds_total)
);
create index on credit_lots (user_id, expires_at) where seconds_left > 0;
create index on credit_lots (purchase_id);

-- 5. voices: stock voices from the TTS provider, plus users' cloned voices
create table voices (
  id uuid primary key default gen_random_uuid(),
  provider text not null,                 -- the TTS engine id, see architecture.md
  provider_voice_id text not null,
  name text not null,                     -- our own names, never the original's
  dialect dialect not null,
  gender text check (gender in ('female','male')),
  use_case text check (use_case in ('documentary','ads','education','dialogue','podcast','stories')),
  is_premium boolean not null default false,
  owner_id uuid references profiles(id) on delete cascade,  -- null = stock voice
  visibility text not null default 'public' check (visibility in ('private','public')),
  consent_at timestamptz,                 -- required for cloned voices
  status text not null default 'ready' check (status in ('processing','ready','failed','removed')),
  sample_path text,                       -- preview clip in storage
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_voice_id),
  constraint cloned_needs_consent check (owner_id is null or consent_at is not null)
);
create index on voices (dialect, use_case) where status = 'ready';
create index on voices (owner_id);

-- 6. api keys
create table api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  prefix text not null,                   -- first 8 chars, shown in the UI
  key_hash bytea not null unique,         -- sha256 of the full key; the key is shown once
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index on api_keys (user_id);

-- 7. generations: speech and sound effects
create table generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  kind text not null default 'tts' check (kind in ('tts','sfx')),
  voice_id uuid references voices(id) on delete set null,
  dialect dialect,
  input_text text not null,               -- with inline emotion tags
  char_count int not null check (char_count > 0),
  word_count int not null check (word_count > 0),
  status text not null default 'queued'
    check (status in ('queued','running','done','failed','expired')),
  seconds_reserved int not null default 0 check (seconds_reserved >= 0),
  seconds_charged int check (seconds_charged >= 0),
  audio_path text,                        -- storage key
  error text,
  source text not null default 'web' check (source in ('web','api')),
  api_key_id uuid references api_keys(id) on delete set null,
  regenerated_from uuid references generations(id) on delete set null,
  is_free_regen boolean not null default false,
  expires_at timestamptz not null default now() + interval '7 days',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tts_needs_voice check (kind = 'sfx' or (voice_id is not null and dialect is not null))
);
create index on generations (user_id, created_at desc);
create index on generations (expires_at) where status <> 'expired';
create index on generations (voice_id);
create index on generations (api_key_id);
create index on generations (regenerated_from);
-- one free regeneration per original, enforced by the database
create unique index one_free_regen on generations (regenerated_from) where is_free_regen;

-- 8. credit ledger: append-only audit of every change in seconds
create table credit_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  lot_id uuid references credit_lots(id) on delete set null,
  generation_id uuid references generations(id) on delete set null,
  purchase_id uuid references purchases(id) on delete set null,
  delta_seconds int not null check (delta_seconds <> 0),
  reason text not null check (reason in ('grant','reserve','settle','release','expire','refund')),
  created_at timestamptz not null default now()
);
create index on credit_ledger (user_id, created_at desc);
create index on credit_ledger (lot_id);
create index on credit_ledger (generation_id);
create index on credit_ledger (purchase_id);

-- 9. webhook events: idempotency for payment webhooks
create table webhook_events (
  provider text not null,
  event_id text not null,
  received_at timestamptz not null default now(),
  primary key (provider, event_id)
);

create trigger t_profiles before update on profiles for each row execute function touch_updated_at();
create trigger t_purchases before update on purchases for each row execute function touch_updated_at();
create trigger t_voices before update on voices for each row execute function touch_updated_at();
create trigger t_generations before update on generations for each row execute function touch_updated_at();

-- Row level security. Users read their own rows. All writes that touch
-- money or credits go through the server with the service role or the
-- functions below.
alter table profiles enable row level security;
alter table trial_claims enable row level security;   -- no policies: server only
alter table purchases enable row level security;
alter table credit_lots enable row level security;
alter table voices enable row level security;
alter table api_keys enable row level security;
alter table generations enable row level security;
alter table credit_ledger enable row level security;
alter table webhook_events enable row level security; -- no policies: server only

create policy own_profile_read on profiles for select using (id = auth.uid());
create policy own_profile_update on profiles for update using (id = auth.uid());
create policy own_purchases on purchases for select using (user_id = auth.uid());
create policy own_lots on credit_lots for select using (user_id = auth.uid());
create policy own_ledger on credit_ledger for select using (user_id = auth.uid());
create policy own_generations on generations for select using (user_id = auth.uid());
create policy own_keys on api_keys for select using (user_id = auth.uid());
create policy voices_visible on voices for select
  using (status = 'ready' and (owner_id is null or visibility = 'public' or owner_id = auth.uid()));

-- Balance: unexpired seconds left.
create or replace view balances with (security_invoker = true) as
  select user_id, coalesce(sum(seconds_left), 0)::int as seconds_left,
         min(expires_at) as next_expiry
  from credit_lots
  where seconds_left > 0 and (expires_at is null or expires_at > now())
  group by user_id;

-- Reserve seconds for a generation, soonest-expiring lots first.
-- Row locks stop two parallel generations from spending the same seconds.
create or replace function reserve_credits(p_generation uuid, p_seconds int)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_user uuid; need int := p_seconds; lot record; take int;
begin
  select user_id into v_user from generations where id = p_generation for update;
  if (select coalesce(sum(seconds_left),0) from credit_lots
        where user_id = v_user and seconds_left > 0
          and (expires_at is null or expires_at > now())) < p_seconds then
    return false;
  end if;
  for lot in
    select id, seconds_left from credit_lots
    where user_id = v_user and seconds_left > 0
      and (expires_at is null or expires_at > now())
    order by expires_at nulls last, created_at
    for update
  loop
    exit when need = 0;
    take := least(lot.seconds_left, need);
    update credit_lots set seconds_left = seconds_left - take where id = lot.id;
    insert into credit_ledger (user_id, lot_id, generation_id, delta_seconds, reason)
      values (v_user, lot.id, p_generation, -take, 'reserve');
    need := need - take;
  end loop;
  update generations set seconds_reserved = p_seconds where id = p_generation;
  return true;
end $$;

-- Release reserved seconds back to the lots they came from
-- (failed generation, or reserved more than the audio used).
create or replace function release_credits(p_generation uuid, p_seconds int)
returns void language plpgsql security definer set search_path = public as $$
declare v_user uuid; need int := p_seconds; r record; give int;
begin
  select user_id into v_user from generations where id = p_generation for update;
  for r in
    select l.lot_id, sum(-l.delta_seconds)::int as taken
    from credit_ledger l join credit_lots c on c.id = l.lot_id
    where l.generation_id = p_generation and l.reason in ('reserve','release')
    group by l.lot_id, c.expires_at having sum(-l.delta_seconds) > 0
    order by c.expires_at desc nulls first   -- give back to the longest-lived lot
  loop
    exit when need = 0;
    give := least(r.taken, need);
    update credit_lots set seconds_left = seconds_left + give where id = r.lot_id;
    insert into credit_ledger (user_id, lot_id, generation_id, delta_seconds, reason)
      values (v_user, r.lot_id, p_generation, give, 'release');
    need := need - give;
  end loop;
end $$;

revoke all on function reserve_credits(uuid, int) from public, anon, authenticated;
revoke all on function release_credits(uuid, int) from public, anon, authenticated;
