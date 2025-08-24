-- Remove department_en column from profiles table
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS department_en;

-- Add comment to clarify that department names (including English) should be retrieved via organization_units table
COMMENT ON COLUMN public.profiles.organization_unit_id IS 'References organization_units table. Use organization_units.name for Thai name and organization_units.name_en for English name';