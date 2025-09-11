-- Application users (wraps Supabase auth.users)
CREATE TABLE public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  avatar_url text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Categories (Game of the Year, etc.)
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, -- "game-of-the-year"
  name text NOT NULL,        -- "Game of the Year"
  description text,
  voting_start timestamptz,
  voting_end timestamptz,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Nominees (Games inside each category)
CREATE TABLE public.nominees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,        -- "Baldur's Gate 3"
  description text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Individual votes (one per category per user)
CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  nominee_id uuid NOT NULL REFERENCES public.nominees(id) ON DELETE CASCADE,
  is_final boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, category_id) -- one vote per category per user
);

-- Ballot (tracks user completion)
CREATE TABLE public.ballots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  is_final boolean NOT NULL DEFAULT false,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Votes: only the owner can insert/update/select
CREATE POLICY "Users manage their own votes"
ON public.votes
FOR ALL
USING (user_id = auth.uid());

-- Ballots: only the owner can see/submit
CREATE POLICY "Users manage their own ballots"
ON public.ballots
FOR ALL
USING (user_id = auth.uid());

-- Categories & nominees: everyone can read
CREATE POLICY "Everyone can read categories"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Everyone can read nominees"
ON public.nominees
FOR SELECT
USING (true);

-- Admins can manage categories/nominees
CREATE POLICY "Admins manage categories"
ON public.categories
FOR ALL
USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = true));

CREATE POLICY "Admins manage nominees"
ON public.nominees
FOR ALL
USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = true));

