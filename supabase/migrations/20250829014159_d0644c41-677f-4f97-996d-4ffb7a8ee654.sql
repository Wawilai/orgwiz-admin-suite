-- Create master_data_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.master_data_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type_name TEXT NOT NULL UNIQUE,
  type_name_en TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create master_data_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.master_data_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type_id UUID NOT NULL REFERENCES public.master_data_types(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  name_en TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  organization_id UUID REFERENCES public.organizations(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(type_id, code)
);

-- Enable RLS
ALTER TABLE public.master_data_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_data_items ENABLE ROW LEVEL SECURITY;

-- Create policies for master_data_types
CREATE POLICY "Master data types are viewable by authenticated users" 
ON public.master_data_types 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create policies for master_data_items
CREATE POLICY "Master data items are viewable by authenticated users" 
ON public.master_data_items 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Insert default master data types
INSERT INTO public.master_data_types (type_name, type_name_en, description) VALUES
('ประเภทองค์กร', 'Organization Types', 'ประเภทขององค์กร เช่น บริษัทจำกัด ห้างหุ้นส่วน'),
('แผนก', 'Departments', 'แผนกต่างๆ ในองค์กร'),
('ตำแหน่ง', 'Positions', 'ตำแหน่งงานต่างๆ'),
('บทบาทผู้ใช้', 'User Roles', 'บทบาทของผู้ใช้ในระบบ'),
('ประเทศ', 'Countries', 'รายชื่อประเทศ'),
('ประเภทของผู้ติดต่อ', 'Contact Types', 'ประเภทของผู้ติดต่อ เช่น ลูกค้า ผู้จำหน่าย'),
('ประเภทใบอนุญาต', 'License Types', 'ประเภทของใบอนุญาต'),
('สถานะใบอนุญาต', 'License Status', 'สถานะของใบอนุญาต'),
('สกุลเงิน', 'Currencies', 'สกุลเงินต่างๆ'),
('ภาษา', 'Languages', 'ภาษาที่รองรับในระบบ')
ON CONFLICT (type_name) DO NOTHING;

-- Insert some default master data items
WITH type_ids AS (
  SELECT id, type_name FROM public.master_data_types
)
INSERT INTO public.master_data_items (type_id, code, name, name_en, sort_order) VALUES
-- Organization Types
((SELECT id FROM type_ids WHERE type_name = 'ประเภทองค์กร'), 'CORP', 'บริษัทจำกัด', 'Corporation', 1),
((SELECT id FROM type_ids WHERE type_name = 'ประเภทองค์กร'), 'PART', 'ห้างหุ้นส่วน', 'Partnership', 2),
-- Departments
((SELECT id FROM type_ids WHERE type_name = 'แผนก'), 'IT', 'ฝ่ายไอที', 'IT Department', 1),
((SELECT id FROM type_ids WHERE type_name = 'แผนก'), 'HR', 'ฝ่ายทรัพยากรบุคคล', 'Human Resources', 2),
((SELECT id FROM type_ids WHERE type_name = 'แผนก'), 'FIN', 'ฝ่ายการเงิน', 'Finance Department', 3),
-- Positions
((SELECT id FROM type_ids WHERE type_name = 'ตำแหน่ง'), 'MGR', 'ผู้จัดการ', 'Manager', 1),
((SELECT id FROM type_ids WHERE type_name = 'ตำแหน่ง'), 'DEV', 'นักพัฒนา', 'Developer', 2),
((SELECT id FROM type_ids WHERE type_name = 'ตำแหน่ง'), 'ADMIN', 'ผู้ดูแลระบบ', 'System Administrator', 3),
-- User Roles
((SELECT id FROM type_ids WHERE type_name = 'บทบาทผู้ใช้'), 'ADMIN', 'ผู้ดูแลระบบ', 'Administrator', 1),
((SELECT id FROM type_ids WHERE type_name = 'บทบาทผู้ใช้'), 'USER', 'ผู้ใช้งาน', 'User', 2),
-- Countries
((SELECT id FROM type_ids WHERE type_name = 'ประเทศ'), 'TH', 'ไทย', 'Thailand', 1),
((SELECT id FROM type_ids WHERE type_name = 'ประเทศ'), 'US', 'สหรัฐอเมริกา', 'United States', 2),
-- Languages
((SELECT id FROM type_ids WHERE type_name = 'ภาษา'), 'TH', 'ไทย', 'Thai', 1),
((SELECT id FROM type_ids WHERE type_name = 'ภาษา'), 'EN', 'อังกฤษ', 'English', 2),
-- Currencies
((SELECT id FROM type_ids WHERE type_name = 'สกุลเงิน'), 'THB', 'บาท', 'Thai Baht', 1),
((SELECT id FROM type_ids WHERE type_name = 'สกุลเงิน'), 'USD', 'ดอลลาร์สหรัฐ', 'US Dollar', 2)
ON CONFLICT (type_id, code) DO NOTHING;