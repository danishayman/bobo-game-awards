-- Update get_vote_results function to include nominee image_url and description
-- Drop existing function first since we're changing the return type
DROP FUNCTION IF EXISTS public.get_vote_results(text);

CREATE OR REPLACE FUNCTION public.get_vote_results(p_category_slug text DEFAULT NULL)
RETURNS TABLE (
  category_id uuid,
  category_name text,
  category_slug text,
  category_description text,
  nominee_id uuid,
  nominee_name text,
  nominee_image_url text,
  nominee_description text,
  vote_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as category_id,
    c.name as category_name,
    c.slug as category_slug,
    c.description as category_description,
    n.id as nominee_id,
    n.name as nominee_name,
    n.image_url as nominee_image_url,
    n.description as nominee_description,
    COUNT(v.id) as vote_count
  FROM public.categories c
  LEFT JOIN public.nominees n ON c.id = n.category_id
  LEFT JOIN public.votes v ON n.id = v.nominee_id AND v.is_final = true
  WHERE (p_category_slug IS NULL OR c.slug = p_category_slug)
    AND c.is_active = true
  GROUP BY c.id, c.name, c.slug, c.description, n.id, n.name, n.image_url, n.description
  ORDER BY c.display_order, vote_count DESC, n.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
