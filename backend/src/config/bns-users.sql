USE weightogo_db;

-- One BNS user per barangay
-- Brgy. Navotas already has a BNS user (bns@health.gov.ph)
-- Password for all: BNSBalayan2026!

INSERT INTO users (role, email, password, assigned_barangay) VALUES
('Barangay Nutrition Scholar', 'bns.barangay1@health.gov.ph',       'BNSBalayan2026!', 'Barangay 1'),
('Barangay Nutrition Scholar', 'bns.barangay2@health.gov.ph',       'BNSBalayan2026!', 'Barangay 2'),
('Barangay Nutrition Scholar', 'bns.barangay3@health.gov.ph',       'BNSBalayan2026!', 'Barangay 3'),
('Barangay Nutrition Scholar', 'bns.caloocan@health.gov.ph',        'BNSBalayan2026!', 'Brgy. Caloocan'),
('Barangay Nutrition Scholar', 'bns.lanatan@health.gov.ph',         'BNSBalayan2026!', 'Brgy. Lanatan'),
('Barangay Nutrition Scholar', 'bns.uno@health.gov.ph',             'BNSBalayan2026!', 'Brgy. Uno'),
('Barangay Nutrition Scholar', 'bns.ermita@health.gov.ph',          'BNSBalayan2026!', 'Brgy. Ermita'),
('Barangay Nutrition Scholar', 'bns.gumamela@health.gov.ph',        'BNSBalayan2026!', 'Brgy. Gumamela'),
('Barangay Nutrition Scholar', 'bns.palikpikan@health.gov.ph',      'BNSBalayan2026!', 'Brgy. Palikpikan'),
('Barangay Nutrition Scholar', 'bns.sampaga@health.gov.ph',         'BNSBalayan2026!', 'Brgy. Sampaga'),
('Barangay Nutrition Scholar', 'bns.santol@health.gov.ph',          'BNSBalayan2026!', 'Brgy. Santol'),
('Barangay Nutrition Scholar', 'bns.dilao@health.gov.ph',           'BNSBalayan2026!', 'Brgy. Dilao'),
('Barangay Nutrition Scholar', 'bns.dalig@health.gov.ph',           'BNSBalayan2026!', 'Brgy. Dalig'),
('Barangay Nutrition Scholar', 'bns.langgangan@health.gov.ph',      'BNSBalayan2026!', 'Brgy. Langgangan'),
('Barangay Nutrition Scholar', 'bns.canda@health.gov.ph',           'BNSBalayan2026!', 'Brgy. Canda'),
('Barangay Nutrition Scholar', 'bns.pooc@health.gov.ph',            'BNSBalayan2026!', 'Brgy. Pooc'),
('Barangay Nutrition Scholar', 'bns.tanggoy@health.gov.ph',         'BNSBalayan2026!', 'Brgy. Tanggoy');
