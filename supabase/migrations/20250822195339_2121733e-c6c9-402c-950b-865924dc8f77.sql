-- Add English name field to organization_units table
ALTER TABLE public.organization_units 
ADD COLUMN name_en text;

-- Add comment for the new column
COMMENT ON COLUMN public.organization_units.name_en IS 'English name of the organization unit/department';

-- Update existing records with English names
UPDATE public.organization_units 
SET name_en = CASE 
  WHEN code = 'IT' THEN 'Information Technology Department'
  WHEN code = 'HR' THEN 'Human Resources Department' 
  WHEN code = 'FIN' THEN 'Finance Department'
  ELSE name_en
END
WHERE code IN ('IT', 'HR', 'FIN');