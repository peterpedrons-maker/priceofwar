-- ============================================================
-- Price of War — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. User profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    TEXT UNIQUE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  suffix INT := 0;
BEGIN
  base_username := COALESCE(
    NULLIF(trim(NEW.raw_user_meta_data->>'username'), ''),
    split_part(NEW.email, '@', 1)
  );
  final_username := base_username;

  -- Handle duplicate usernames by appending a number
  LOOP
    BEGIN
      INSERT INTO profiles (id, username)
      VALUES (NEW.id, final_username)
      ON CONFLICT (id) DO NOTHING;
      EXIT; -- success, exit loop
    EXCEPTION WHEN unique_violation THEN
      suffix := suffix + 1;
      final_username := base_username || suffix::TEXT;
    END;
  END LOOP;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never let a profile error block user creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Lobby (players waiting for match)
CREATE TABLE IF NOT EXISTS lobby (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  username      TEXT NOT NULL,
  selected_deck TEXT NOT NULL DEFAULT 'deck1',
  status        TEXT NOT NULL DEFAULT 'available', -- 'available' | 'challenged' | 'in_game'
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Challenges
CREATE TABLE IF NOT EXISTS challenges (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenger_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenger_username TEXT NOT NULL,
  challenger_deck     TEXT NOT NULL DEFAULT 'deck1',
  challenged_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenged_username TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'accepted' | 'declined'
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Games (synced game state)
CREATE TABLE IF NOT EXISTS games (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id        UUID REFERENCES profiles(id),
  player2_id        UUID REFERENCES profiles(id),
  player1_username  TEXT NOT NULL,
  player2_username  TEXT NOT NULL,
  player1_deck      TEXT NOT NULL DEFAULT 'deck1',
  player2_deck      TEXT NOT NULL DEFAULT 'deck1',
  -- Board state (absolute: p1 = player1's field, p2 = player2's field)
  p1_slots          JSONB NOT NULL DEFAULT '[]',
  p2_slots          JSONB NOT NULL DEFAULT '[]',
  p1_hp             INT NOT NULL DEFAULT 20,
  p2_hp             INT NOT NULL DEFAULT 20,
  p1_mana           INT NOT NULL DEFAULT 15,
  p2_mana           INT NOT NULL DEFAULT 15,
  p1_hand_count     INT NOT NULL DEFAULT 0,
  p2_hand_count     INT NOT NULL DEFAULT 0,
  p1_graveyard      JSONB NOT NULL DEFAULT '[]',
  p2_graveyard      JSONB NOT NULL DEFAULT '[]',
  -- Turn state
  active_player     TEXT NOT NULL DEFAULT 'p1', -- 'p1' | 'p2'
  turn_phase        TEXT NOT NULL DEFAULT 'command',
  turn_number       INT NOT NULL DEFAULT 1,
  -- Last played tactic (for opponent animation)
  last_action       JSONB,
  -- Result
  status            TEXT NOT NULL DEFAULT 'active', -- 'active' | 'finished'
  winner_id         UUID,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS) Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lobby ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- profiles: anyone can read, only owner can write
CREATE POLICY "profiles_read_all"  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_write_own" ON profiles FOR ALL  USING (auth.uid() = id);

-- lobby: anyone can read; insert/update/delete only own row
CREATE POLICY "lobby_read_all"    ON lobby FOR SELECT USING (true);
CREATE POLICY "lobby_write_own"   ON lobby FOR ALL    USING (auth.uid() = user_id);

-- challenges: challenger or challenged can read/write
CREATE POLICY "challenges_visible" ON challenges FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);
CREATE POLICY "challenges_insert"  ON challenges FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "challenges_update"  ON challenges FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = challenged_id);

-- games: players in the game can read/write
CREATE POLICY "games_visible" ON games FOR SELECT
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);
CREATE POLICY "games_insert"  ON games FOR INSERT
  WITH CHECK (auth.uid() = player1_id);
CREATE POLICY "games_update"  ON games FOR UPDATE
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- ============================================================
-- Realtime: enable for lobby, challenges, games
-- ============================================================
-- Run these to enable realtime:
-- ALTER PUBLICATION supabase_realtime ADD TABLE lobby;
-- ALTER PUBLICATION supabase_realtime ADD TABLE challenges;
-- ALTER PUBLICATION supabase_realtime ADD TABLE games;

-- ============================================================
-- IMPORTANT: In Supabase Dashboard → Authentication → Settings
-- Disable "Enable email confirmations" for instant sign-in
-- ============================================================
