-- Function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get vote results (for admins and after voting ends)
CREATE OR REPLACE FUNCTION public.get_vote_results(category_slug text DEFAULT NULL)
RETURNS TABLE (
  category_id uuid,
  category_name text,
  category_slug text,
  nominee_id uuid,
  nominee_name text,
  vote_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as category_id,
    c.name as category_name,
    c.slug as category_slug,
    n.id as nominee_id,
    n.name as nominee_name,
    COUNT(v.id) as vote_count
  FROM public.categories c
  LEFT JOIN public.nominees n ON c.id = n.category_id
  LEFT JOIN public.votes v ON n.id = v.nominee_id AND v.is_final = true
  WHERE (category_slug IS NULL OR c.slug = category_slug)
    AND c.is_active = true
  GROUP BY c.id, c.name, c.slug, n.id, n.name
  ORDER BY c.display_order, vote_count DESC, n.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if voting is active for a category
CREATE OR REPLACE FUNCTION public.is_voting_active(category_id uuid)
RETURNS boolean AS $$
DECLARE
  voting_start timestamptz;
  voting_end timestamptz;
BEGIN
  SELECT c.voting_start, c.voting_end 
  INTO voting_start, voting_end
  FROM public.categories c 
  WHERE c.id = category_id AND c.is_active = true;
  
  IF voting_start IS NULL AND voting_end IS NULL THEN
    RETURN true; -- No time restrictions
  END IF;
  
  IF voting_start IS NOT NULL AND now() < voting_start THEN
    RETURN false; -- Voting hasn't started
  END IF;
  
  IF voting_end IS NOT NULL AND now() > voting_end THEN
    RETURN false; -- Voting has ended
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to finalize a user's ballot
CREATE OR REPLACE FUNCTION public.finalize_ballot(p_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Update all user's votes to final
  UPDATE public.votes 
  SET is_final = true 
  WHERE user_id = p_user_id;
  
  -- Update or insert ballot as final
  INSERT INTO public.ballots (user_id, is_final, submitted_at)
  VALUES (p_user_id, true, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    is_final = true, 
    submitted_at = now(),
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
