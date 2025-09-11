-- RLS Policies

-- Users: Users can only see and update their own profile
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Categories: Everyone can read, only admins can manage
CREATE POLICY "Everyone can read categories"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.is_admin = true
  )
);

-- Nominees: Everyone can read, only admins can manage
CREATE POLICY "Everyone can read nominees"
ON public.nominees
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage nominees"
ON public.nominees
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.is_admin = true
  )
);

-- Votes: Users can only manage their own votes
CREATE POLICY "Users can view own votes"
ON public.votes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own votes"
ON public.votes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
ON public.votes
FOR UPDATE
USING (auth.uid() = user_id AND is_final = false);

-- Admins can view all votes for results
CREATE POLICY "Admins can view all votes"
ON public.votes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.is_admin = true
  )
);

-- Ballots: Users can only manage their own ballot
CREATE POLICY "Users can view own ballot"
ON public.ballots
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ballot"
ON public.ballots
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ballot"
ON public.ballots
FOR UPDATE
USING (auth.uid() = user_id);

-- Admins can view all ballots for admin purposes
CREATE POLICY "Admins can view all ballots"
ON public.ballots
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users u 
    WHERE u.id = auth.uid() AND u.is_admin = true
  )
);
