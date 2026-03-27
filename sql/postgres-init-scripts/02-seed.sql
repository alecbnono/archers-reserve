-- Archers Reserve - Seed Data (PostgreSQL)
-- All seeded users have password: password123

-- Rooms
INSERT INTO room (room_code, building, floor, capacity) VALUES
('A1904', 'Andrew Gonzales Hall', 19, 45),
('C314', 'Connon Hall', 3, 35),
('G210', 'Gokongwei Hall', 2, 30),
('G211', 'Gokongwei Hall', 2, 30),
('G302A', 'Gokongwei Hall', 3, 24),
('G302B', 'Gokongwei Hall', 3, 24),
('G304A', 'Gokongwei Hall', 3, 24),
('G304B', 'Gokongwei Hall', 3, 45),
('G306A', 'Gokongwei Hall', 3, 24),
('G306B', 'Gokongwei Hall', 3, 24),
('G404A', 'Gokongwei Hall', 4, 30),
('G404B', 'Gokongwei Hall', 4, 30),
('J212', 'St. Joseph Hall', 2, 20),
('L212', 'St. La Salle Hall', 2, 18),
('L229', 'St. La Salle Hall', 2, 48),
('L320', 'St. La Salle Hall', 3, 39),
('L335', 'St. La Salle Hall', 3, 44),
('V103', 'Velasco Hall', 1, 29),
('V205', 'Velasco Hall', 2, 24),
('V206', 'Velasco Hall', 2, 24),
('V208A', 'Velasco Hall', 2, 22),
('V208B', 'Velasco Hall', 2, 22),
('V301', 'Velasco Hall', 3, 35),
('V310', 'Velasco Hall', 3, 28),
('Y602', 'Yuchengco Hall', 6, 41);

-- Users (explicit user_id via override)
INSERT INTO "user" (user_id, username, first_name, last_name, email, password_hash, bio, profile_picture_url, is_anonymous, is_public, role) VALUES
    (10001, 'tech.ramos', 'Tech', 'Ramos', 'tech.ramos@dlsu.edu.ph',
     '$2b$10$H.K2dn7eU1HqOPvaTheXUO/VGi..Vi88.e8hD/W5PIdsgqik0sshW',
     'Senior Lab Technician. Responsible for lab maintenance and reservation management across all CCS-managed rooms.',
     '', FALSE, FALSE, 'ADMIN'),
    (10002, 'juan.delacruz', 'Juan', 'Dela Cruz', 'juan.delacruz@dlsu.edu.ph',
     '$2b$10$H.K2dn7eU1HqOPvaTheXUO/VGi..Vi88.e8hD/W5PIdsgqik0sshW',
     '3rd Year Computer Science student. Frequent user of Andrew G302 for specialized dev projects. Enthusiastic about ArcherReserve!',
     '', FALSE, TRUE, 'STUDENT'),
    (10003, 'kuya.will', 'Kuya', 'Will', 'paybtawsan@dlsu.edu.ph',
     '$2b$10$H.K2dn7eU1HqOPvaTheXUO/VGi..Vi88.e8hD/W5PIdsgqik0sshW',
     'BIGYAN YAN NG JACKET',
     '', TRUE, TRUE, 'STUDENT'),
    (10004, 'goldship', 'Goldship', 'Umamusume', 'golshi@dlsu.edu.ph',
     '$2b$10$H.K2dn7eU1HqOPvaTheXUO/VGi..Vi88.e8hD/W5PIdsgqik0sshW',
     'The well-known trickster who gets faster when the finish line is close. She is the oldest member in Team Spica.',
     '', FALSE, FALSE, 'STUDENT'),
    (10005, 'agnes.tachyon', 'Agnes', 'Tachyon', 'pennohavy@dlsu.edu.ph',
     '$2b$10$H.K2dn7eU1HqOPvaTheXUO/VGi..Vi88.e8hD/W5PIdsgqik0sshW',
     'Agnes Tachyon was a Japanese Thoroughbred racehorse and a Leading sire in Japan.',
     '', TRUE, FALSE, 'STUDENT'),
    (10006, 'erika.villon', 'Erika', 'Villon', 'erika.villon@dlsu.edu.ph',
     '$2b$10$H.K2dn7eU1HqOPvaTheXUO/VGi..Vi88.e8hD/W5PIdsgqik0sshW',
     'Assistant Professor in the Software Technology department. Primarily reserves labs for hands-on machine learning lectures.',
     '', FALSE, TRUE, 'FACULTY');

-- Reset user_id sequence to avoid conflicts with future inserts
SELECT setval(pg_get_serial_sequence('"user"', 'user_id'), (SELECT MAX(user_id) FROM "user"));

-- Seats (Automatically generated depending on capacity)
INSERT INTO seat (room_id, seat_id)
SELECT
    r.room_id,
    generate_series(1, r.capacity)
FROM room r;

-- Timeslots (30-minute intervals from 7:00 AM to 6:00 PM)
INSERT INTO timeslot (start_time, end_time) VALUES
    ('07:00:00', '07:30:00'),
    ('07:30:00', '08:00:00'),
    ('08:00:00', '08:30:00'),
    ('08:30:00', '09:00:00'),
    ('09:00:00', '09:30:00'),
    ('09:30:00', '10:00:00'),
    ('10:00:00', '10:30:00'),
    ('10:30:00', '11:00:00'),
    ('11:00:00', '11:30:00'),
    ('11:30:00', '12:00:00'),
    ('12:00:00', '12:30:00'),
    ('12:30:00', '13:00:00'),
    ('13:00:00', '13:30:00'),
    ('13:30:00', '14:00:00'),
    ('14:00:00', '14:30:00'),
    ('14:30:00', '15:00:00'),
    ('15:00:00', '15:30:00'),
    ('15:30:00', '16:00:00'),
    ('16:00:00', '16:30:00'),
    ('16:30:00', '17:00:00'),
    ('17:00:00', '17:30:00'),
    ('17:30:00', '18:00:00');

-- Reservations
INSERT INTO reservation (user_id, seat_id, room_id, timeslot_id, request_date, is_anonymous, is_recurring) VALUES
    (10002, 1, 1, 1, '2026-03-02', FALSE, FALSE),
    (10006, 1, 2, 2, '2026-03-02', FALSE, TRUE),
    (10003, 1, 3, 3, '2026-03-02', TRUE, FALSE),
    (10004, 2, 3, 4, '2026-03-02', FALSE, FALSE);

-- Made to test if filters room with max capacity
INSERT INTO reservation (
  user_id, seat_id, room_id, timeslot_id, request_date, is_anonymous, is_recurring
)
SELECT
  10002,
  s.seat_id,
  s.room_id,
  t.timeslot_id,
  DATE '2026-03-20',
  FALSE,
  FALSE
FROM seat s
JOIN room r ON r.room_id = s.room_id
CROSS JOIN timeslot t
WHERE r.room_code = 'L212';

-- Made to test if filters room with max capacity at given time range
INSERT INTO reservation (
user_id, seat_id, room_id, timeslot_id, request_date, is_anonymous, is_recurring
)
SELECT
10002,
s.seat_id,
s.room_id,
t.timeslot_id,
DATE '2026-03-20',
FALSE,
FALSE
FROM seat s
JOIN room r ON r.room_id = s.room_id
JOIN timeslot t ON TRUE
LEFT JOIN reservation x
ON x.room_id = s.room_id
AND x.seat_id = s.seat_id
AND x.timeslot_id = t.timeslot_id
AND x.request_date = DATE '2026-03-20'
AND x.cancelled_at IS NULL
WHERE r.room_code = 'L229'
AND t.start_time >= TIME '12:00:00'
AND t.start_time < TIME '15:00:00'
AND x.reservation_id IS NULL;

-- ------------------------------------------------------------
-- 1) 5 STUDENT user profiles
-- ------------------------------------------------------------
INSERT INTO "user" (
  username, first_name, last_name, email, password_hash, role, bio, is_public, is_anonymous
) VALUES
  ('stud_anna',  'Anna',  'Reyes',    'anna.reyes@dlsu.edu.ph',  '$2b$10$mockhashstudent00000000000000000000000000000000000001', 'STUDENT', 'Mock student profile', TRUE, FALSE),
  ('stud_ben',   'Ben',   'Cruz',     'ben.cruz@dlsu.edu.ph',    '$2b$10$mockhashstudent00000000000000000000000000000000000002', 'STUDENT', 'Mock student profile', TRUE, FALSE),
  ('stud_carla', 'Carla', 'Santos',   'carla.santos@dlsu.edu.ph','$2b$10$mockhashstudent00000000000000000000000000000000000003', 'STUDENT', 'Mock student profile', TRUE, FALSE),
  ('stud_diego', 'Diego', 'Lim',      'diego.lim@dlsu.edu.ph',   '$2b$10$mockhashstudent00000000000000000000000000000000000004', 'STUDENT', 'Mock student profile', TRUE, FALSE),
  ('stud_ella',  'Ella',  'Navarro',  'ella.navarro@dlsu.edu.ph','$2b$10$mockhashstudent00000000000000000000000000000000000005', 'STUDENT', 'Mock student profile', TRUE, FALSE)
ON CONFLICT (email) DO NOTHING;

-- ------------------------------------------------------------
-- 2) 5 ADMIN user profiles
-- ------------------------------------------------------------
INSERT INTO "user" (
  username, first_name, last_name, email, password_hash, role, bio, is_public, is_anonymous
) VALUES
  ('admin_ian',   'Ian',   'Gonzales', 'ian.gonzales@dlsu.edu.ph',   '$2b$10$mockhashadmin000000000000000000000000000000000000001', 'ADMIN', 'Mock admin profile', TRUE, FALSE),
  ('admin_jane',  'Jane',  'Lopez',    'jane.lopez@dlsu.edu.ph',     '$2b$10$mockhashadmin000000000000000000000000000000000000002', 'ADMIN', 'Mock admin profile', TRUE, FALSE),
  ('admin_karl',  'Karl',  'Tan',      'karl.tan@dlsu.edu.ph',       '$2b$10$mockhashadmin000000000000000000000000000000000000003', 'ADMIN', 'Mock admin profile', TRUE, FALSE),
  ('admin_lisa',  'Lisa',  'Mendoza',  'lisa.mendoza@dlsu.edu.ph',   '$2b$10$mockhashadmin000000000000000000000000000000000000004', 'ADMIN', 'Mock admin profile', TRUE, FALSE),
  ('admin_miguel','Miguel','Aquino',   'miguel.aquino@dlsu.edu.ph',  '$2b$10$mockhashadmin000000000000000000000000000000000000005', 'ADMIN', 'Mock admin profile', TRUE, FALSE)
ON CONFLICT (email) DO NOTHING;

-- ------------------------------------------------------------
-- Extra: Ensure one FACULTY exists to own reservations
-- ------------------------------------------------------------
INSERT INTO "user" (
  username, first_name, last_name, email, password_hash, role, bio, is_public, is_anonymous
) VALUES
  ('faculty_goko', 'Rainer', 'Gonzaga', 'rainer_gonzaga@dlsu.edu.ph',
   '$2b$10$mockhashfaculty00000000000000000000000000000000000001',
   'FACULTY', 'Mock faculty reservation owner', TRUE, FALSE)
ON CONFLICT (email) DO NOTHING;

-- ------------------------------------------------------------
-- 3) 10 reservations for EACH Room in Gokongwei
--    made by the FACULTY user, up to March 29, 2026
-- ------------------------------------------------------------
-- Optional cleanup: remove previous mock reservations for this faculty in Gokongwei
DELETE FROM reservation r
USING room rm, "user" u
WHERE r.room_id = rm.room_id
  AND r.user_id = u.user_id
  AND rm.building ILIKE '%gokongwei%'
  AND u.email = 'rainer_gonzaga@dlsu.edu.ph'
  AND r.request_date <= DATE '2026-03-29';

WITH faculty_user AS (
  SELECT user_id
  FROM "user"
  WHERE email = 'rainer_gonzaga@dlsu.edu.ph'
  LIMIT 1
),
gokongwei_rooms AS (
  SELECT room_id, room_code
  FROM room
  WHERE building ILIKE '%gokongwei%'
),
candidate_slots AS (
  SELECT
    gr.room_id,
    gr.room_code,
    s.seat_id,
    t.timeslot_id,
    gs::date AS request_date,
    ROW_NUMBER() OVER (
      PARTITION BY gr.room_id
      ORDER BY gs::date, t.timeslot_id, s.seat_id
    ) AS rn
  FROM gokongwei_rooms gr
  JOIN seat s
    ON s.room_id = gr.room_id
  JOIN timeslot t
    ON TRUE
  JOIN generate_series(
    DATE '2026-03-20',
    DATE '2026-03-29',
    INTERVAL '1 day'
  ) gs
    ON TRUE
),
picked AS (
  SELECT room_id, seat_id, timeslot_id, request_date
  FROM candidate_slots
  WHERE rn <= 10
)
INSERT INTO reservation (
  reservation_batch_id,
  user_id,
  seat_id,
  room_id,
  timeslot_id,
  request_date,
  is_anonymous,
  is_recurring
)
SELECT
  NULL,
  fu.user_id,
  p.seat_id,
  p.room_id,
  p.timeslot_id,
  p.request_date,
  FALSE,
  FALSE
FROM picked p
CROSS JOIN faculty_user fu
LEFT JOIN reservation r
  ON r.room_id = p.room_id
 AND r.seat_id = p.seat_id
 AND r.timeslot_id = p.timeslot_id
 AND r.request_date = p.request_date
 AND r.cancelled_at IS NULL
WHERE r.reservation_id IS NULL;

-- ------------------------------------------------------------
-- 4) Full timeslot coverage for Gokongwei rooms (Mar 28-29)
--    10 reservations per room per timeslot per day (seats 1-10)
-- ------------------------------------------------------------
WITH faculty_user AS (
  SELECT user_id
  FROM "user"
  WHERE email = 'rainer_gonzaga@dlsu.edu.ph'
  LIMIT 1
),
gokongwei_rooms AS (
  SELECT room_id
  FROM room
  WHERE building ILIKE '%gokongwei%'
),
target_dates AS (
  SELECT gs::date AS request_date
  FROM generate_series(
    DATE '2026-03-28',
    DATE '2026-03-29',
    INTERVAL '1 day'
  ) gs
),
seat_pool AS (
  SELECT s.room_id, s.seat_id
  FROM seat s
  JOIN gokongwei_rooms gr ON gr.room_id = s.room_id
  WHERE s.seat_id <= 10
)
INSERT INTO reservation (
  reservation_batch_id,
  user_id,
  seat_id,
  room_id,
  timeslot_id,
  request_date,
  is_anonymous,
  is_recurring
)
SELECT
  NULL,
  fu.user_id,
  sp.seat_id,
  sp.room_id,
  t.timeslot_id,
  d.request_date,
  FALSE,
  FALSE
FROM faculty_user fu
CROSS JOIN seat_pool sp
CROSS JOIN timeslot t
CROSS JOIN target_dates d
LEFT JOIN reservation r
  ON r.room_id = sp.room_id
 AND r.seat_id = sp.seat_id
 AND r.timeslot_id = t.timeslot_id
 AND r.request_date = d.request_date
 AND r.cancelled_at IS NULL
WHERE r.reservation_id IS NULL;