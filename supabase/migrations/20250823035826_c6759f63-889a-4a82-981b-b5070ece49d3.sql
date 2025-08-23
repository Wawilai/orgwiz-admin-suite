-- Remove duplicate organization types, keeping the ones with better codes
-- Remove duplicates with uppercase codes, keep lowercase/underscore versions

DELETE FROM master_data_items 
WHERE type_id = (SELECT id FROM master_data_types WHERE type_name = 'ประเภทองค์กร')
AND id IN (
  'ee6290b6-9e40-4b5b-8e1a-8b73efb2d6ab', -- duplicate บริษัทจำกัด (keep LIMITED)
  '5e7ceb3e-833f-4944-b4ee-6e2e98e770d3', -- duplicate บริษัทมหาชน (keep public_limited) 
  'd45c1301-6a28-4581-a9ee-61141eff5e03'  -- duplicate ห้างหุ้นส่วน (keep partnership)
);

-- Update sort orders to be sequential
UPDATE master_data_items 
SET sort_order = 1 
WHERE type_id = (SELECT id FROM master_data_types WHERE type_name = 'ประเภทองค์กร')
AND code = 'LIMITED';

UPDATE master_data_items 
SET sort_order = 2 
WHERE type_id = (SELECT id FROM master_data_types WHERE type_name = 'ประเภทองค์กร')
AND code = 'public_limited';

UPDATE master_data_items 
SET sort_order = 3 
WHERE type_id = (SELECT id FROM master_data_types WHERE type_name = 'ประเภทองค์กร')
AND code = 'partnership';

UPDATE master_data_items 
SET sort_order = 4 
WHERE type_id = (SELECT id FROM master_data_types WHERE type_name = 'ประเภทองค์กร')
AND code = 'government';