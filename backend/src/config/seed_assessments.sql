USE weightogo_db;

-- Inserts assessment records for every child that has checkup_status = 'Checked Up'
-- Uses the child's existing weight, height, and nutritional status
INSERT INTO assessments (child_id, month, year, weight, height, wfa_status, hfa_status, wfhl_status, classification, assessed_by, created_at)
SELECT
  c.id,
  'Jul',
  2026,
  c.weight,
  c.height,
  c.wfa_status,
  c.hfa_status,
  c.wfhl_status,
  c.classification,
  NULL,
  NOW()
FROM children c
WHERE c.checkup_status = 'Checked Up';
