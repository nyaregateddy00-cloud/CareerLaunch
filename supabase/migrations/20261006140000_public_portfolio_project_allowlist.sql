-- Keep the public portfolio RPC's project payload explicitly allow-listed.
-- This prevents future private project fields from being exposed by SELECT *.
CREATE OR REPLACE FUNCTION public.get_public_portfolio(p_slug TEXT)
RETURNS JSONB
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT jsonb_build_object(
    'profile', jsonb_build_object(
      'fullName', pr.full_name,
      'headline', CASE WHEN po.custom_sections #>> '{publicSections,headline}' = 'true' THEN COALESCE(po.headline, '') ELSE '' END,
      'bio', CASE WHEN po.custom_sections #>> '{publicSections,bio}' = 'true' THEN COALESCE(po.bio, '') ELSE '' END,
      'location', CASE WHEN po.custom_sections #>> '{publicSections,location}' = 'true' THEN COALESCE(pr.location, '') ELSE '' END,
      'avatarUrl', CASE WHEN po.custom_sections #>> '{publicSections,photo}' = 'true' THEN pr.avatar_url ELSE NULL END,
      'email', CASE WHEN po.custom_sections #>> '{publicSections,email}' = 'true' THEN COALESCE(po.social_links->>'email', '') ELSE '' END,
      'githubUrl', CASE WHEN po.custom_sections #>> '{publicSections,socialLinks}' = 'true' THEN po.social_links->>'github' ELSE NULL END,
      'linkedinUrl', CASE WHEN po.custom_sections #>> '{publicSections,socialLinks}' = 'true' THEN po.social_links->>'linkedin' ELSE NULL END,
      'twitterUrl', CASE WHEN po.custom_sections #>> '{publicSections,socialLinks}' = 'true' THEN po.social_links->>'twitter' ELSE NULL END,
      'websiteUrl', CASE WHEN po.custom_sections #>> '{publicSections,socialLinks}' = 'true' THEN po.social_links->>'website' ELSE NULL END
    ),
    'projects', CASE WHEN po.custom_sections #>> '{publicSections,projects}' = 'true' THEN COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', item->>'id', 'title', item->>'title', 'description', item->>'description',
        'link', item->>'link', 'githubLink', item->>'githubLink', 'imageUrl', item->>'imageUrl',
        'tags', COALESCE(item->'tags', '[]'::jsonb), 'isFeatured', item->'isFeatured'
      ))
      FROM jsonb_array_elements(COALESCE(ws.payload->'careerlaunch_projects', '[]'::jsonb)) AS entries(item)
      WHERE (po.custom_sections->'featuredProjectIds') ? (item->>'id')
    ), '[]'::jsonb) ELSE '[]'::jsonb END,
    'experience', CASE WHEN po.custom_sections #>> '{publicSections,experience}' = 'true' THEN COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', item->>'id', 'userId', po.user_id, 'company', item->>'company',
        'position', item->>'position', 'employmentType', item->>'employmentType',
        'location', item->>'location', 'startDate', item->>'startDate',
        'endDate', item->>'endDate', 'isCurrent', item->'isCurrent', 'description', item->>'description'
      )) FROM jsonb_array_elements(COALESCE(ws.payload->'careerlaunch_experience', '[]'::jsonb)) AS entries(item)
    ), '[]'::jsonb) ELSE '[]'::jsonb END,
    'education', CASE WHEN po.custom_sections #>> '{publicSections,education}' = 'true' THEN COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', item->>'id', 'userId', po.user_id, 'institution', item->>'institution',
        'degree', item->>'degree', 'fieldOfStudy', item->>'fieldOfStudy',
        'startDate', item->>'startDate', 'endDate', item->>'endDate', 'isCurrent', item->'isCurrent'
      )) FROM jsonb_array_elements(COALESCE(ws.payload->'careerlaunch_education', '[]'::jsonb)) AS entries(item)
    ), '[]'::jsonb) ELSE '[]'::jsonb END,
    'skills', CASE WHEN po.custom_sections #>> '{publicSections,skills}' = 'true' THEN COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', item->>'id', 'userId', po.user_id, 'skillName', item->>'skillName',
        'category', item->>'category', 'proficiencyLevel', item->>'proficiencyLevel',
        'yearsOfExperience', item->'yearsOfExperience'
      )) FROM jsonb_array_elements(COALESCE(ws.payload->'careerlaunch_user_skills', '[]'::jsonb)) AS entries(item)
    ), '[]'::jsonb) ELSE '[]'::jsonb END
  )
  FROM public.portfolios po
  JOIN public.profiles pr ON pr.id = po.user_id
  LEFT JOIN public.workspace_snapshots ws ON ws.user_id = po.user_id
  WHERE po.slug = p_slug AND po.is_published = TRUE
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_portfolio(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_portfolio(TEXT) TO anon, authenticated;
