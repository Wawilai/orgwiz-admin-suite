-- เพิ่ม unique constraint สำหรับ master_data_items
ALTER TABLE public.master_data_items 
ADD CONSTRAINT unique_master_data_items_type_code 
UNIQUE (type_id, code);

-- เพิ่ม Foreign Key constraints ที่จำเป็น
ALTER TABLE public.master_data_items 
ADD CONSTRAINT fk_master_data_items_type_id 
FOREIGN KEY (type_id) REFERENCES public.master_data_types(id) 
ON DELETE CASCADE;

ALTER TABLE public.profiles 
ADD CONSTRAINT fk_profiles_organization_unit_id 
FOREIGN KEY (organization_unit_id) REFERENCES public.organization_units(id) 
ON DELETE SET NULL;