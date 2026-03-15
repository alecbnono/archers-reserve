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
  10002,           -- existing seeded user
  s.seat_id,
  s.room_id,
  1,               -- timeslot_id (07:00-07:30 from seed)
  DATE '2026-03-20',
  FALSE,
  FALSE
FROM seat s
JOIN room r ON r.room_id = s.room_id
WHERE r.room_code = 'L212';
