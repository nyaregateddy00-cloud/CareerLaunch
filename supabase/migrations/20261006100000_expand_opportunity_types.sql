-- Add the opportunity categories described by the product while preserving
-- all previously valid rows and the existing table/RLS behavior.
ALTER TABLE public.opportunities
  DROP CONSTRAINT IF EXISTS opportunities_type_check;

ALTER TABLE public.opportunities
  ADD CONSTRAINT opportunities_type_check
  CHECK (type IN (
    'Job', 'Internship', 'Attachment', 'Scholarship', 'Freelance',
    'Graduate Program', 'Remote', 'Competition', 'Fellowship', 'Hackathon',
    'Volunteering', 'Event'
  ));
