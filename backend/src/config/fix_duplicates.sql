USE weightogo_db;

-- Step 1: Remove duplicate assessments (keep only the first per child+month+year)
DELETE a1 FROM assessments a1
INNER JOIN assessments a2
WHERE a1.id > a2.id
  AND a1.child_id = a2.child_id
  AND a1.month = a2.month
  AND a1.year = a2.year;

-- Step 2: Remove assessments for children that don't exist
DELETE FROM assessments WHERE child_id NOT IN (SELECT id FROM children);

-- Step 3: Remove duplicate children (keep the one with the lowest id per name+barangay)
DELETE c1 FROM children c1
INNER JOIN children c2
WHERE c1.name = c2.name
  AND c1.barangay = c2.barangay
  AND c1.id > c2.id;
