-- Optimized PostgreSQL function for voting data
-- This fetches all voting-related data in a single query using JSON aggregation

CREATE OR REPLACE FUNCTION get_optimized_voting_data(
  user_id_param UUID,
  current_slug_param TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'categories', categories_data,
    'currentCategory', current_category_data,
    'currentIndex', current_index,
    'userVotes', user_votes_data,
    'ballot', ballot_data,
    'currentVote', current_vote_data,
    '_meta', json_build_object(
      'user_id', user_id_param,
      'fetched_at', NOW(),
      'cache_key', 'voting-optimized-' || COALESCE(current_slug_param, 'start') || '-' || user_id_param::text,
      'optimized', true
    )
  ) INTO result
  FROM (
    -- All categories with nominees
    SELECT json_agg(
      json_build_object(
        'id', c.id,
        'slug', c.slug,
        'name', c.name,
        'description', c.description,
        'display_order', c.display_order,
        'nominees', c.nominees,
        'hasVote', CASE WHEN uv.category_id IS NOT NULL THEN true ELSE false END
      ) ORDER BY c.display_order
    ) as categories_data,
    
    -- Current category (if slug provided)
    (
      SELECT json_build_object(
        'id', c.id,
        'slug', c.slug,
        'name', c.name,
        'description', c.description,
        'display_order', c.display_order,
        'nominees', c.nominees
      )
      FROM (
        SELECT 
          cat.id, cat.slug, cat.name, cat.description, cat.display_order,
          json_agg(
            json_build_object(
              'id', n.id,
              'name', n.name,
              'description', n.description,
              'image_url', n.image_url,
              'display_order', n.display_order
            ) ORDER BY n.display_order
          ) as nominees
        FROM categories cat
        LEFT JOIN nominees n ON cat.id = n.category_id
        WHERE cat.is_active = true 
          AND (current_slug_param IS NULL OR cat.slug = current_slug_param)
        GROUP BY cat.id, cat.slug, cat.name, cat.description, cat.display_order
        ORDER BY cat.display_order
        LIMIT 1
      ) c
    ) as current_category_data,
    
    -- Current index
    (
      SELECT COALESCE(
        (SELECT position - 1 
         FROM (
           SELECT ROW_NUMBER() OVER (ORDER BY display_order) as position, slug
           FROM categories 
           WHERE is_active = true
         ) ranked 
         WHERE slug = current_slug_param), 
        0
      )
    ) as current_index,
    
    -- User votes as object
    (
      SELECT json_object_agg(v.category_id::text, 
        json_build_object(
          'id', v.id,
          'category_id', v.category_id,
          'nominee_id', v.nominee_id,
          'is_final', v.is_final,
          'created_at', v.created_at
        )
      )
      FROM votes v
      WHERE v.user_id = user_id_param
    ) as user_votes_data,
    
    -- User ballot
    (
      SELECT json_build_object(
        'id', b.id,
        'is_final', b.is_final,
        'submitted_at', b.submitted_at
      )
      FROM ballots b
      WHERE b.user_id = user_id_param
      LIMIT 1
    ) as ballot_data,
    
    -- Current vote (if current category specified)
    (
      SELECT json_build_object(
        'id', v.id,
        'category_id', v.category_id,
        'nominee_id', v.nominee_id,
        'is_final', v.is_final,
        'created_at', v.created_at
      )
      FROM votes v
      JOIN categories c ON v.category_id = c.id
      WHERE v.user_id = user_id_param 
        AND c.slug = current_slug_param
      LIMIT 1
    ) as current_vote_data
    
  FROM (
    SELECT 
      cat.id, cat.slug, cat.name, cat.description, cat.display_order,
      json_agg(
        json_build_object(
          'id', n.id,
          'name', n.name,
          'description', n.description,
          'image_url', n.image_url,
          'display_order', n.display_order
        ) ORDER BY n.display_order
      ) as nominees
    FROM categories cat
    LEFT JOIN nominees n ON cat.id = n.category_id
    WHERE cat.is_active = true
    GROUP BY cat.id, cat.slug, cat.name, cat.description, cat.display_order
  ) c
  LEFT JOIN votes uv ON c.id = uv.category_id AND uv.user_id = user_id_param
  ) sub;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_optimized_voting_data(UUID, TEXT) TO authenticated;

-- Create additional optimized indexes for this function
CREATE INDEX IF NOT EXISTS idx_votes_user_category_optimized 
ON votes(user_id, category_id) INCLUDE (id, nominee_id, is_final, created_at);

CREATE INDEX IF NOT EXISTS idx_nominees_category_optimized 
ON nominees(category_id, display_order) INCLUDE (id, name, description, image_url);

CREATE INDEX IF NOT EXISTS idx_categories_active_optimized 
ON categories(is_active, display_order) INCLUDE (id, slug, name, description)
WHERE is_active = true;

-- Update table statistics for better query planning
ANALYZE categories;
ANALYZE nominees; 
ANALYZE votes;
ANALYZE ballots;
