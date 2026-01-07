-- Sample Data: 50 Candidates and 10 Job Openings
-- Generated: 2025-11-24
-- Note: HR users with IDs 2, 3, and 4 must exist before running this script

-- ====================================
-- JOB OPENINGS (10)
-- ====================================

INSERT INTO openings (title, department, location, positions, description, requirements, status, created_by, created_at, updated_at) VALUES
('Senior Software Engineer', 'Engineering', 'San Francisco, CA', 3, 'We are looking for experienced software engineers to join our team.', 'Java, Spring Boot, React, 5+ years experience', 'ACTIVE', 2, NOW(), NOW()),
('Product Manager', 'Product', 'New York, NY', 2, 'Lead product strategy and roadmap for our flagship products.', 'MBA, 3+ years PM experience, Agile methodology', 'ACTIVE', 2, NOW(), NOW()),
('Data Scientist', 'Data Analytics', 'Austin, TX', 2, 'Analyze complex datasets and build predictive models.', 'Python, ML/AI, Statistics, PhD preferred', 'ACTIVE', 3, NOW(), NOW()),
('DevOps Engineer', 'Engineering', 'Seattle, WA', 2, 'Build and maintain CI/CD pipelines and cloud infrastructure.', 'AWS/Azure, Docker, Kubernetes, Jenkins', 'ACTIVE', 3, NOW(), NOW()),
('UI/UX Designer', 'Design', 'Los Angeles, CA', 1, 'Create beautiful and intuitive user experiences.', 'Figma, Adobe XD, Portfolio required, 3+ years', 'ACTIVE', 2, NOW(), NOW()),
('Marketing Manager', 'Marketing', 'Chicago, IL', 1, 'Develop and execute marketing campaigns.', 'Digital marketing, SEO/SEM, 5+ years experience', 'ACTIVE', 4, NOW(), NOW()),
('Sales Representative', 'Sales', 'Boston, MA', 5, 'Drive sales growth and build client relationships.', 'B2B sales, CRM experience, excellent communication', 'ACTIVE', 4, NOW(), NOW()),
('HR Business Partner', 'Human Resources', 'Remote', 1, 'Strategic HR partner for business units.', 'SHRM-CP, 5+ years HR experience, HRIS knowledge', 'ACTIVE', 2, NOW(), NOW()),
('Full Stack Developer', 'Engineering', 'Denver, CO', 3, 'Build end-to-end web applications.', 'Node.js, React, MongoDB, REST APIs', 'ACTIVE', 3, NOW(), NOW()),
('Quality Assurance Lead', 'Engineering', 'Portland, OR', 1, 'Lead QA team and ensure product quality.', 'Selenium, Test automation, Agile, 4+ years', 'ACTIVE', 2, NOW(), NOW());

-- ====================================
-- CANDIDATES (50)
-- ====================================

-- Batch 1: Candidates 1-10 (Created by HR ID 2)
INSERT INTO candidates (first_name, last_name, email, phone, company, profile, experience, resume_url, status, source_hr_id, created_at, updated_at) VALUES
('John', 'Smith', 'john.smith@email.com', '415-555-0101', 'Tech Corp', 'Senior Software Engineer', '7 years', 'resume_john_smith.pdf', 'CONTACTED', 2, '2025-11-01 09:00:00', '2025-11-01 09:00:00'),
('Emily', 'Johnson', 'emily.johnson@email.com', '415-555-0102', 'Innovate Inc', 'Product Manager', '5 years', 'resume_emily_johnson.pdf', 'INTERESTED', 2, '2025-11-02 10:15:00', '2025-11-02 10:15:00'),
('Michael', 'Williams', 'michael.williams@email.com', '415-555-0103', 'Data Solutions', 'Data Scientist', '4 years', 'resume_michael_williams.pdf', 'PENDING', 2, '2025-11-03 11:30:00', '2025-11-03 11:30:00'),
('Sarah', 'Brown', 'sarah.brown@email.com', '415-555-0104', 'Cloud Systems', 'DevOps Engineer', '6 years', 'resume_sarah_brown.pdf', 'CONTACTED', 2, '2025-11-04 14:20:00', '2025-11-04 14:20:00'),
('David', 'Jones', 'david.jones@email.com', '415-555-0105', 'Design Studio', 'UI/UX Designer', '5 years', 'resume_david_jones.pdf', 'INTERESTED', 2, '2025-11-05 09:45:00', '2025-11-05 09:45:00'),
('Jessica', 'Garcia', 'jessica.garcia@email.com', '415-555-0106', 'Marketing Pro', 'Marketing Manager', '8 years', 'resume_jessica_garcia.pdf', 'OFFERED', 2, '2025-11-06 13:00:00', '2025-11-06 13:00:00'),
('James', 'Martinez', 'james.martinez@email.com', '415-555-0107', 'Sales Force', 'Sales Representative', '4 years', 'resume_james_martinez.pdf', 'CONTACTED', 2, '2025-11-07 10:30:00', '2025-11-07 10:30:00'),
('Jennifer', 'Rodriguez', 'jennifer.rodriguez@email.com', '415-555-0108', 'HR Solutions', 'HR Business Partner', '6 years', 'resume_jennifer_rodriguez.pdf', 'HIRED', 2, '2025-11-08 15:15:00', '2025-11-08 15:15:00'),
('Robert', 'Wilson', 'robert.wilson@email.com', '415-555-0109', 'Web Dev Co', 'Full Stack Developer', '5 years', 'resume_robert_wilson.pdf', 'INTERESTED', 2, '2025-11-09 11:00:00', '2025-11-09 11:00:00'),
('Lisa', 'Anderson', 'lisa.anderson@email.com', '415-555-0110', 'QA Masters', 'QA Lead', '7 years', 'resume_lisa_anderson.pdf', 'PENDING', 2, '2025-11-10 09:20:00', '2025-11-10 09:20:00');

-- Batch 2: Candidates 11-20 (Created by HR ID 3)
INSERT INTO candidates (first_name, last_name, email, phone, company, profile, experience, resume_url, status, source_hr_id, created_at, updated_at) VALUES
('William', 'Taylor', 'william.taylor@email.com', '512-555-0201', 'StartUp Labs', 'Software Engineer', '3 years', 'resume_william_taylor.pdf', 'CONTACTED', 3, '2025-11-11 10:00:00', '2025-11-11 10:00:00'),
('Mary', 'Thomas', 'mary.thomas@email.com', '512-555-0202', 'Analytics Corp', 'Data Analyst', '4 years', 'resume_mary_thomas.pdf', 'INTERESTED', 3, '2025-11-11 14:30:00', '2025-11-11 14:30:00'),
('Christopher', 'Moore', 'christopher.moore@email.com', '512-555-0203', 'Mobile Apps', 'Mobile Developer', '5 years', 'resume_christopher_moore.pdf', 'PENDING', 3, '2025-11-12 09:15:00', '2025-11-12 09:15:00'),
('Patricia', 'Jackson', 'patricia.jackson@email.com', '512-555-0204', 'Security Inc', 'Security Engineer', '6 years', 'resume_patricia_jackson.pdf', 'CONTACTED', 3, '2025-11-12 13:45:00', '2025-11-12 13:45:00'),
('Daniel', 'White', 'daniel.white@email.com', '512-555-0205', 'Frontend Studio', 'Frontend Developer', '4 years', 'resume_daniel_white.pdf', 'INTERESTED', 3, '2025-11-13 10:30:00', '2025-11-13 10:30:00'),
('Nancy', 'Harris', 'nancy.harris@email.com', '512-555-0206', 'Backend Systems', 'Backend Developer', '5 years', 'resume_nancy_harris.pdf', 'NOT_INTERESTED', 3, '2025-11-13 15:00:00', '2025-11-13 15:00:00'),
('Matthew', 'Martin', 'matthew.martin@email.com', '512-555-0207', 'AI Research', 'Machine Learning Engineer', '4 years', 'resume_matthew_martin.pdf', 'TELL_LATER', 3, '2025-11-14 11:20:00', '2025-11-14 11:20:00'),
('Betty', 'Thompson', 'betty.thompson@email.com', '512-555-0208', 'Product Co', 'Product Owner', '3 years', 'resume_betty_thompson.pdf', 'CONTACTED', 3, '2025-11-14 14:00:00', '2025-11-14 14:00:00'),
('Charles', 'Garcia', 'charles.garcia@email.com', '512-555-0209', 'Engineering Firm', 'Systems Engineer', '6 years', 'resume_charles_garcia.pdf', 'OFFERED', 3, '2025-11-15 09:45:00', '2025-11-15 09:45:00'),
('Dorothy', 'Martinez', 'dorothy.martinez@email.com', '512-555-0210', 'Testing Labs', 'QA Engineer', '3 years', 'resume_dorothy_martinez.pdf', 'PENDING', 3, '2025-11-15 13:30:00', '2025-11-15 13:30:00');

-- Batch 3: Candidates 21-30 (Created by HR ID 4)
INSERT INTO candidates (first_name, last_name, email, phone, company, profile, experience, resume_url, status, source_hr_id, created_at, updated_at) VALUES
('Thomas', 'Robinson', 'thomas.robinson@email.com', '312-555-0301', 'Consulting Group', 'Business Analyst', '5 years', 'resume_thomas_robinson.pdf', 'CONTACTED', 4, '2025-11-16 10:00:00', '2025-11-16 10:00:00'),
('Sandra', 'Clark', 'sandra.clark@email.com', '312-555-0302', 'Project Management', 'Project Manager', '7 years', 'resume_sandra_clark.pdf', 'INTERESTED', 4, '2025-11-16 14:15:00', '2025-11-16 14:15:00'),
('Joseph', 'Rodriguez', 'joseph.rodriguez@email.com', '312-555-0303', 'Sales Dynamics', 'Account Executive', '4 years', 'resume_joseph_rodriguez.pdf', 'HIRED', 4, '2025-11-17 09:30:00', '2025-11-17 09:30:00'),
('Karen', 'Lewis', 'karen.lewis@email.com', '312-555-0304', 'Content Agency', 'Content Writer', '3 years', 'resume_karen_lewis.pdf', 'PENDING', 4, '2025-11-17 11:45:00', '2025-11-17 11:45:00'),
('Steven', 'Lee', 'steven.lee@email.com', '312-555-0305', 'Graphics Design', 'Graphic Designer', '5 years', 'resume_steven_lee.pdf', 'CONTACTED', 4, '2025-11-18 10:20:00', '2025-11-18 10:20:00'),
('Susan', 'Walker', 'susan.walker@email.com', '312-555-0306', 'Video Production', 'Video Editor', '4 years', 'resume_susan_walker.pdf', 'INTERESTED', 4, '2025-11-18 13:00:00', '2025-11-18 13:00:00'),
('Paul', 'Hall', 'paul.hall@email.com', '312-555-0307', 'Network Systems', 'Network Engineer', '6 years', 'resume_paul_hall.pdf', 'TELL_LATER', 4, '2025-11-19 09:15:00', '2025-11-19 09:15:00'),
('Margaret', 'Allen', 'margaret.allen@email.com', '312-555-0308', 'Database Solutions', 'Database Administrator', '5 years', 'resume_margaret_allen.pdf', 'CONTACTED', 4, '2025-11-19 14:30:00', '2025-11-19 14:30:00'),
('Mark', 'Young', 'mark.young@email.com', '312-555-0309', 'Finance Tech', 'Financial Analyst', '4 years', 'resume_mark_young.pdf', 'OFFERED', 4, '2025-11-20 10:45:00', '2025-11-20 10:45:00'),
('Linda', 'Hernandez', 'linda.hernandez@email.com', '312-555-0310', 'Legal Services', 'Legal Counsel', '8 years', 'resume_linda_hernandez.pdf', 'NOT_INTERESTED', 4, '2025-11-20 15:00:00', '2025-11-20 15:00:00');

-- Batch 4: Candidates 31-40 (Created by HR ID 2)
INSERT INTO candidates (first_name, last_name, email, phone, company, profile, experience, resume_url, status, source_hr_id, created_at, updated_at) VALUES
('Donald', 'King', 'donald.king@email.com', '617-555-0401', 'Tech Innovations', 'Solutions Architect', '8 years', 'resume_donald_king.pdf', 'CONTACTED', 2, '2025-11-21 09:00:00', '2025-11-21 09:00:00'),
('Barbara', 'Wright', 'barbara.wright@email.com', '617-555-0402', 'Customer Success', 'Customer Success Manager', '5 years', 'resume_barbara_wright.pdf', 'INTERESTED', 2, '2025-11-21 11:30:00', '2025-11-21 11:30:00'),
('George', 'Lopez', 'george.lopez@email.com', '617-555-0403', 'Operations Hub', 'Operations Manager', '6 years', 'resume_george_lopez.pdf', 'PENDING', 2, '2025-11-21 14:00:00', '2025-11-21 14:00:00'),
('Helen', 'Hill', 'helen.hill@email.com', '617-555-0404', 'Training Institute', 'Training Specialist', '4 years', 'resume_helen_hill.pdf', 'CONTACTED', 2, '2025-11-22 09:30:00', '2025-11-22 09:30:00'),
('Kenneth', 'Scott', 'kenneth.scott@email.com', '617-555-0405', 'Compliance Corp', 'Compliance Officer', '7 years', 'resume_kenneth_scott.pdf', 'INTERESTED', 2, '2025-11-22 13:15:00', '2025-11-22 13:15:00'),
('Angela', 'Green', 'angela.green@email.com', '617-555-0406', 'Supply Chain Co', 'Supply Chain Analyst', '5 years', 'resume_angela_green.pdf', 'HIRED', 2, '2025-11-22 15:45:00', '2025-11-22 15:45:00'),
('Brian', 'Adams', 'brian.adams@email.com', '617-555-0407', 'Research Lab', 'Research Scientist', '6 years', 'resume_brian_adams.pdf', 'TELL_LATER', 2, '2025-11-23 10:00:00', '2025-11-23 10:00:00'),
('Deborah', 'Baker', 'deborah.baker@email.com', '617-555-0408', 'Education Tech', 'Instructional Designer', '4 years', 'resume_deborah_baker.pdf', 'CONTACTED', 2, '2025-11-23 12:30:00', '2025-11-23 12:30:00'),
('Edward', 'Gonzalez', 'edward.gonzalez@email.com', '617-555-0409', 'Healthcare IT', 'Healthcare Analyst', '5 years', 'resume_edward_gonzalez.pdf', 'OFFERED', 2, '2025-11-23 14:15:00', '2025-11-23 14:15:00'),
('Sharon', 'Nelson', 'sharon.nelson@email.com', '617-555-0410', 'Cloud Services', 'Cloud Architect', '7 years', 'resume_sharon_nelson.pdf', 'PENDING', 2, '2025-11-23 16:00:00', '2025-11-23 16:00:00');

-- Batch 5: Candidates 41-50 (Created by HR ID 3)
INSERT INTO candidates (first_name, last_name, email, phone, company, profile, experience, resume_url, status, source_hr_id, created_at, updated_at) VALUES
('Jason', 'Carter', 'jason.carter@email.com', '206-555-0501', 'Agile Consulting', 'Scrum Master', '5 years', 'resume_jason_carter.pdf', 'CONTACTED', 3, '2025-11-24 09:00:00', '2025-11-24 09:00:00'),
('Michelle', 'Mitchell', 'michelle.mitchell@email.com', '206-555-0502', 'User Research', 'UX Researcher', '4 years', 'resume_michelle_mitchell.pdf', 'INTERESTED', 3, '2025-11-24 10:15:00', '2025-11-24 10:15:00'),
('Kevin', 'Perez', 'kevin.perez@email.com', '206-555-0503', 'API Gateway', 'API Developer', '3 years', 'resume_kevin_perez.pdf', 'PENDING', 3, '2025-11-24 11:30:00', '2025-11-24 11:30:00'),
('Laura', 'Roberts', 'laura.roberts@email.com', '206-555-0504', 'Brand Strategy', 'Brand Manager', '6 years', 'resume_laura_roberts.pdf', 'CONTACTED', 3, '2025-11-24 12:45:00', '2025-11-24 12:45:00'),
('Ryan', 'Turner', 'ryan.turner@email.com', '206-555-0505', 'Performance Team', 'Performance Engineer', '4 years', 'resume_ryan_turner.pdf', 'HIRED', 3, '2025-11-24 13:00:00', '2025-11-24 13:00:00'),
('Amy', 'Phillips', 'amy.phillips@email.com', '206-555-0506', 'Integration Systems', 'Integration Specialist', '5 years', 'resume_amy_phillips.pdf', 'INTERESTED', 3, '2025-11-24 14:15:00', '2025-11-24 14:15:00'),
('Eric', 'Campbell', 'eric.campbell@email.com', '206-555-0507', 'Blockchain Tech', 'Blockchain Developer', '3 years', 'resume_eric_campbell.pdf', 'NOT_INTERESTED', 3, '2025-11-24 15:30:00', '2025-11-24 15:30:00'),
('Kimberly', 'Parker', 'kimberly.parker@email.com', '206-555-0508', 'Social Media', 'Social Media Manager', '4 years', 'resume_kimberly_parker.pdf', 'TELL_LATER', 3, '2025-11-24 16:00:00', '2025-11-24 16:00:00'),
('Jeffrey', 'Evans', 'jeffrey.evans@email.com', '206-555-0509', 'Automation Inc', 'Automation Engineer', '5 years', 'resume_jeffrey_evans.pdf', 'CONTACTED', 3, '2025-11-24 16:30:00', '2025-11-24 16:30:00'),
('Rebecca', 'Edwards', 'rebecca.edwards@email.com', '206-555-0510', 'Analytics Platform', 'Business Intelligence Analyst', '6 years', 'resume_rebecca_edwards.pdf', 'OFFERED', 3, '2025-11-24 17:00:00', '2025-11-24 17:00:00');

-- ====================================
-- VERIFICATION QUERIES
-- ====================================
-- Run these to verify the data was inserted:
-- SELECT COUNT(*) as total_openings FROM openings;
-- SELECT COUNT(*) as total_candidates FROM candidates;
-- SELECT source_hr_id, COUNT(*) as count FROM candidates GROUP BY source_hr_id ORDER BY source_hr_id;
-- SELECT created_by, COUNT(*) as count FROM openings GROUP BY created_by ORDER BY created_by;
