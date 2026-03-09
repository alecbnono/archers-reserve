-- Archers Reserve - Seed Data (PostgreSQL)
-- All seeded users have password: password123

-- Rooms
INSERT INTO room (room_code, building_name, description) VALUES
    ('LAB-001', 'Gokongwei', ''),
    ('LAB-002', 'St. Joseph', ''),
    ('LAB-003', 'Yuchengco', ''),
    ('LAB-004', 'Andrew', ''),
    ('LAB-005', 'Velasco', '');

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

-- Seats (5 seats per room)
INSERT INTO seat (room_id, seat_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    (2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
    (3, 1), (3, 2), (3, 3), (3, 4), (3, 5),
    (4, 1), (4, 2), (4, 3), (4, 4), (4, 5),
    (5, 1), (5, 2), (5, 3), (5, 4), (5, 5);

-- Timeslots
INSERT INTO timeslot (start_time, end_time) VALUES
    ('08:00:00', '10:00:00'),
    ('10:00:00', '12:00:00'),
    ('13:00:00', '15:00:00'),
    ('15:00:00', '17:00:00');

-- Reservations
INSERT INTO reservation (user_id, seat_id, room_id, timeslot_id, request_date, is_anonymous, is_recurring) VALUES
    (10002, 1, 1, 1, '2026-03-02', FALSE, FALSE),
    (10006, 1, 2, 2, '2026-03-02', FALSE, TRUE),
    (10003, 1, 3, 3, '2026-03-02', TRUE, FALSE),
    (10004, 2, 3, 4, '2026-03-02', FALSE, FALSE);
