# Supabase setup (accounts)

The game already has the login flow (Google, Discord, e-mail, guest). Until the keys below exist it runs in
"local mode": only the guest login works, stored in the browser. As soon as the two variables are set at build
time, the same screens talk to Supabase — no code change.

## 1. Create the project
1. https://supabase.com → New project (the free plan is enough). Save the database password somewhere safe.
2. Project Settings → API: copy the **Project URL** and the **anon public** key. Both are public (they end up in the
   site's JavaScript); never use the `service_role` key here.

## 2. Turn on the logins (Authentication → Sign In / Providers)
- **Anonymous sign-ins**: on (this is the "Jogar como convidado" button).
- **Email**: on. For quick tests you can switch off "Confirm email"; leave it on for release.
- **Google**: create an OAuth client at console.cloud.google.com → APIs & Services → Credentials → OAuth client ID
  (type "Web application"). Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
  (Supabase shows the exact URL on the Google provider page). Paste the Client ID and Secret into Supabase.
- **Discord**: discord.com/developers/applications → New Application → OAuth2. Add the same redirect URI
  (`https://<your-project-ref>.supabase.co/auth/v1/callback`), copy Client ID and Secret into Supabase.

## 3. Tell Supabase where the game lives (Authentication → URL Configuration)
- **Site URL**: `https://peterpedrons-maker.github.io/priceofwar/`
- **Redirect URLs** (add all): `https://peterpedrons-maker.github.io/priceofwar/` and, for local tests,
  `http://localhost:5173/` and `http://localhost:4173/priceofwar/`.

## 4. Give the build the two values
GitHub repo → Settings → Secrets and variables → Actions → **Variables** tab → New repository variable:
- `VITE_SUPABASE_URL` = the Project URL
- `VITE_SUPABASE_ANON_KEY` = the anon public key

Push (or re-run the "Deploy to GitHub Pages" workflow). For local development copy `.env.example` to `.env.local`
and fill the same two values.

## 5. Tables (next step — not used by the game yet)
Run in SQL Editor when we wire up profile syncing. Each player can only read and change their own row; the name is
unique (case-insensitive).

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  avatar_id text not null default 'batedora',
  level int not null default 1,
  xp int not null default 0,
  coroas int not null default 0,
  created_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[A-Za-zÀ-ÿ0-9 _.-]{3,16}$')
);
create unique index profiles_username_key on public.profiles (lower(username));
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "create own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
```
