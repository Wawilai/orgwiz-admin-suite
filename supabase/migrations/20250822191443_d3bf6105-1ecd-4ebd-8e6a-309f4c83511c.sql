-- Update profiles table to support additional user information
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE,
ADD COLUMN first_name_en TEXT,
ADD COLUMN last_name_en TEXT,
ADD COLUMN national_id TEXT UNIQUE,
ADD COLUMN backup_email TEXT,
ADD COLUMN phone_office TEXT,
ADD COLUMN phone_mobile TEXT,
ADD COLUMN department_en TEXT,
ADD COLUMN user_type TEXT NOT NULL DEFAULT 'user';

-- Create index for performance
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_national_id ON public.profiles(national_id);

-- Update existing phone column to phone_mobile for consistency
UPDATE public.profiles SET phone_mobile = phone WHERE phone IS NOT NULL;

-- Create groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_name TEXT NOT NULL,
  group_email TEXT NOT NULL UNIQUE,
  description TEXT,
  organization_id UUID NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Create policies for groups
CREATE POLICY "Users can view organization groups"
ON public.groups 
FOR SELECT 
USING (organization_id = get_current_user_organization_id());

CREATE POLICY "Users can create organization groups"
ON public.groups 
FOR INSERT 
WITH CHECK (
  organization_id = get_current_user_organization_id() 
  AND created_by = auth.uid()
);

CREATE POLICY "Group creators can update their groups"
ON public.groups 
FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Group creators can delete their groups"
ON public.groups 
FOR DELETE 
USING (created_by = auth.uid());

CREATE POLICY "Organization admins can manage organization groups"
ON public.groups 
FOR ALL 
USING (
  organization_id = get_current_user_organization_id() 
  AND is_organization_admin(auth.uid(), organization_id)
);

CREATE POLICY "Super admins can manage all groups"
ON public.groups 
FOR ALL 
USING (is_super_admin());

-- Create group_members table
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL,
  user_id UUID, -- For internal members
  external_email TEXT, -- For external members
  added_by UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE,
  CONSTRAINT chk_member_type CHECK (
    (user_id IS NOT NULL AND external_email IS NULL) OR 
    (user_id IS NULL AND external_email IS NOT NULL)
  )
);

-- Enable RLS on group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Create policies for group_members
CREATE POLICY "Users can view group members of accessible groups"
ON public.group_members 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.groups g 
    WHERE g.id = group_members.group_id 
    AND g.organization_id = get_current_user_organization_id()
  )
);

CREATE POLICY "Users can add members to their groups"
ON public.group_members 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.groups g 
    WHERE g.id = group_members.group_id 
    AND (g.created_by = auth.uid() OR is_organization_admin(auth.uid(), g.organization_id))
  )
  AND added_by = auth.uid()
);

CREATE POLICY "Users can remove members from their groups"
ON public.group_members 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.groups g 
    WHERE g.id = group_members.group_id 
    AND (g.created_by = auth.uid() OR is_organization_admin(auth.uid(), g.organization_id))
  )
);

CREATE POLICY "Organization admins can manage group members"
ON public.group_members 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.groups g 
    WHERE g.id = group_members.group_id 
    AND is_organization_admin(auth.uid(), g.organization_id)
  )
);

CREATE POLICY "Super admins can manage all group members"
ON public.group_members 
FOR ALL 
USING (is_super_admin());

-- Create indexes for performance
CREATE INDEX idx_groups_organization_id ON public.groups(organization_id);
CREATE INDEX idx_groups_created_by ON public.groups(created_by);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_group_members_external_email ON public.group_members(external_email);

-- Create trigger for updating timestamps
CREATE TRIGGER update_groups_updated_at
BEFORE UPDATE ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.groups IS 'Email groups and distribution lists';
COMMENT ON TABLE public.group_members IS 'Members of email groups (internal users and external emails)';
COMMENT ON COLUMN public.group_members.user_id IS 'Internal user reference (mutually exclusive with external_email)';
COMMENT ON COLUMN public.group_members.external_email IS 'External email address (mutually exclusive with user_id)';

-- Sample master data for user_type
INSERT INTO public.master_data_items (type_id, organization_id, code, name, description, sort_order, is_active)
SELECT 
  (SELECT id FROM public.master_data_types WHERE type_name = 'user_roles'),
  NULL, -- System-wide data
  'admin',
  'ผู้ดูแลระบบ',
  'ผู้ดูแลระบบทั่วไป',
  1,
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.master_data_items mdi
  JOIN public.master_data_types mdt ON mdi.type_id = mdt.id
  WHERE mdt.type_name = 'user_roles' AND mdi.code = 'admin'
);