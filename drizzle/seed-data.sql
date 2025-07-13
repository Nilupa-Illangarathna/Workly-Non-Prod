-- Insert Users
INSERT INTO users (
  id, worklyid, firstname, lastname, nicnumber, dateofbirth, 
  phone, whatsapp, email, is_email_verified, is_phone_verified, 
  language, address, district, country, loginid, password, 
  role, status, createdat, updatedat
) VALUES
-- Admin User
('8238744b-528d-44e0-ba06-45be929e6242', 'WCS0001', 'Admin', 'User', '123456789V', 
 '2000-01-01 00:00:00', '1234567890', '1234567890', 'admin@example.com', false, false, 
 'English', '123 Main St', 'Central', 'Sri Lanka', 'admin', 
 '$2b$10$bCkqlmqc8qIzVejmrViz.e9jHQMQslZpzMtxYqeHOfWvUBDBY4VMK', 
 'admin', 'approved', '2025-03-03 21:11:30.273445+00', '2025-03-03 21:11:30.273445+00'),

-- Top Managers (Level 0)
('268e83d7-6f33-49fd-8588-2fc902586e3b', 'WCS2111', 'Top', 'Manager 1', '111111111111',
 '2000-01-01 00:00:00', '0771111111', '0771111111', 'topmanager1@gmail.com', false, false,
 'si', 'No 56/4', 'colombo', 'LKA', '0771111111',
 '$2b$10$3qay7MDvndPNk4GLSW7szugwMMtPeHQbzhkINccVTNNxJCHC0E4Fq',
 'partner', 'pending', '2025-03-03 21:21:14.73673+00', '2025-03-03 21:21:14.73673+00'),

-- Sub Companies (Level 1)
('fe918132-0471-49f8-b571-9f6a3e75ae83', 'WCS6111', 'Sub', 'Company 1', '111111222222',
 '2000-01-01 00:00:00', '0761111111', '0761111111', 'subcompany1@gmail.com', false, false,
 'si', 'No 56/4', 'colombo', 'LKA', '0761111111',
 '$2b$10$LJH1.Bd9arSKd265gATHCOCwDLoYF9etSDZrp6aw8D0dg0nGCK/H6',
 'partner', 'pending', '2025-03-03 21:24:30.353871+00', '2025-03-03 21:24:30.353871+00'),

-- Sub 1 Partners (Level 2)
('3a6dfffc-6a02-4802-bea7-f688ea0fd06e', 'WCS9111', 'Sub 1', 'Partner', '111111555555',
 '2000-01-01 00:00:00', '0781111111', '0781111111', 'sub1partner@gmail.com', false, false,
 'si', 'No 56/4', 'colombo', 'LKA', '0781111111',
 '$2b$10$xFcz4EgQcva/6ShV2Q/me.9lLlocDj2mtMSYPT9VioKttmyefvKXC',
 'partner', 'pending', '2025-03-03 21:27:21.454917+00', '2025-03-03 21:27:21.454917+00'),

-- Sub 2 Partners (Level 3)
('291ec12d-407c-4a4f-a264-a23143093028', 'WCS10222', 'Sub 2', 'Partner', '222222555555',
 '2000-01-01 00:00:00', '0782222222', '0782222222', 'sub2partner@gmail.com', false, false,
 'si', 'No 56/4', 'colombo', 'LKA', '0782222222',
 '$2b$10$fYEeGWG4/U/loF59yOJO8O9FtVxM6AfI1/1/WT.cES3F/RCOcIB06',
 'partner', 'pending', '2025-03-03 21:28:36.799608+00', '2025-03-03 21:28:36.799608+00'),

-- Sub 3 Partner (Level 4)
('24b54f83-cdce-4d93-ae8c-caf7b37989dd', 'WCS11333', 'Sub 3', 'Partner', '333333555555',
 '2000-01-01 00:00:00', '0783333333', '0783333333', 'sub3partner@gmail.com', false, false,
 'si', 'No 56/4', 'colombo', 'LKA', '0783333333',
 '$2b$10$Yfmx6u9ueTygCHlUb.3ZQOW2H5AOIsyJXKWJSMzuxnR64YezmIJ4K',
 'partner', 'pending', '2025-03-03 21:29:27.140888+00', '2025-03-03 21:29:27.140888+00'),

-- Students
('7e504708-47f8-4452-80a1-186b4643cb23', 'WCS12933', 'Chamod', 'Rashmika', '200027302985',
 '2000-09-29 00:00:00', '0772684933', '0772684933', 'cnilwakka@gmail.com', false, false,
 'si', 'No 56/4', 'colombo', 'LKA', '0772684933',
 '$2b$10$Bb8HBWTp4Iy6TRxkkBbxT.oD42QYyKfuPqforkwplsHujJX5q6KES',
 'student', 'pending', '2025-03-03 21:30:31.611885+00', '2025-03-03 23:50:52.671+00');

-- Insert Partners
INSERT INTO partners (
  id, worklyid, status, level, commissionrate, pendingamount, 
  withdrawableamount, createdat, updatedat
) VALUES
('a93b80d3-8815-4e2b-bce8-8c7dac20ed57', '268e83d7-6f33-49fd-8588-2fc902586e3b', 'pending', 0, '0.00', '0.00', '0.00',
 '2025-03-03 21:21:14.831686+00', '2025-03-03 21:21:14.831686+00'),

('aa822e6a-54d5-4d9a-8c5f-a553a8fe7c0d', 'fe918132-0471-49f8-b571-9f6a3e75ae83', 'pending', 1, '0.00', '0.00', '0.00',
 '2025-03-03 21:24:30.552835+00', '2025-03-03 21:24:30.552835+00'),

('99f56b5d-3390-40d5-b30a-6aa60bb15328', '3a6dfffc-6a02-4802-bea7-f688ea0fd06e', 'pending', 2, '0.00', '0.00', '0.00',
 '2025-03-03 21:27:21.652751+00', '2025-03-03 21:27:21.652751+00'),

('583e18cc-f8f1-459a-b40b-b4d59d4c9b48', '291ec12d-407c-4a4f-a264-a23143093028', 'pending', 3, '0.00', '0.00', '0.00',
 '2025-03-03 21:28:36.972548+00', '2025-03-03 21:28:36.972548+00'),

('6110efae-22b2-434b-8c60-a984165f3567', '24b54f83-cdce-4d93-ae8c-caf7b37989dd', 'pending', 4, '0.00', '0.00', '0.00',
 '2025-03-03 21:29:27.342852+00', '2025-03-03 21:29:27.342852+00');

-- Insert Referrals
INSERT INTO referrals (
  id, referrerid, referredid, createdat, updatedat
) VALUES
('40ae4bde-cd4a-4e9d-a773-5765354f77ff', '268e83d7-6f33-49fd-8588-2fc902586e3b', 'fe918132-0471-49f8-b571-9f6a3e75ae83', 
 '2025-03-03 21:24:30.631909+00', '2025-03-03 21:24:30.631909+00'),
('3b91af9a-358c-4769-9063-dbc9e2cc24de', 'fe918132-0471-49f8-b571-9f6a3e75ae83', '3a6dfffc-6a02-4802-bea7-f688ea0fd06e', 
 '2025-03-03 21:27:21.742781+00', '2025-03-03 21:27:21.742781+00'),
('88cb9342-aa08-4a75-927c-c95f3a370a33', '3a6dfffc-6a02-4802-bea7-f688ea0fd06e', '291ec12d-407c-4a4f-a264-a23143093028', 
 '2025-03-03 21:28:37.061555+00', '2025-03-03 21:28:37.061555+00'),
('3945c4e3-da82-4c99-b5ab-69957c1f9c07', '291ec12d-407c-4a4f-a264-a23143093028', '24b54f83-cdce-4d93-ae8c-caf7b37989dd', 
 '2025-03-03 21:29:27.429824+00', '2025-03-03 21:29:27.429824+00'),