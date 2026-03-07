INSERT INTO Room (roomCode, buildingName, description) VALUES (
    ('LAB-001', 'Gokongiwei',''),
    ('LAB-002', 'St. Joseph', ''),
    ('LAB-003', 'Yuchenco', ''),
    ('LAB-004', 'Andrew', ''),
    ('LAB-005', 'Velasco', '')
);

INSERT INTO User (userID,firstName, lastName, email, bio, profilePictureURL, isAnonymous, isPublic, role) VALUES (
    (
        10001,
        'Tech',
        'Ramos',
        'tech.ramos@dlsu.edu.ph',
        'Senior Lab Technician. Responsible for lab maintenance and reservation management across all CCS-managed rooms.',
        'https://example.com/profile_pictures/tech.jpg',
        FALSE,
        FALSE,
        'ADMIN'
    ),
    (
        10002,
        'Juan', 
        'Dela Cruz', 
        'juan.delacruz@dlsu.edu.ph', 
        '3rd Year Computer Science student. Frequent user of Andrew G302 for specialized dev projects. Enthusiastic about ArcherReserve!',
        'https://example.com/profile_pictures/juan.jpg',
        FALSE,
        TRUE,
        'STUDENT'
    ),
    (
        10003,
        'Kuya',
        'Will',
        'paybtawsan@dlsu.edu.ph',
        'BIGYAN YAN NG JACKET',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8hhODiiKJ6C6_v7tjhnTvbiHEqRkFt5CQeQ&s',
        TRUE,
        TRUE,
        'STUDENT'
    ),
    (
        10004,
        'Goldship',
        'Umamusume',
        'golshi@dlsu.edu.ph',
        'The well-known trickster who gets faster when the finish line is close. She is the oldest member in Team Spica.',
        'https://static.wikia.nocookie.net/virtualyoutuber/images/d/dd/GoldShip.jpg/revision/latest/thumbnail/width/360/height/360?cb=20180527013533',
        FALSE,
        FALSE,
        'STUDENT'
    ),
    (
        10005,
        'Agnes',
        'Tachyon',
        'pennohavy@dlsu.edu.ph',
        'Agnes Tachyon was a Japanese Thoroughbred racehorse and a Leading sire in Japan.',
        'https://media.tenor.com/9LH4AwWJB2oAAAAe/agnes-tachyon-uma-musume.png',
        TRUE,
        FALSE,
        'STUDENT'
    ),
    (
        10006,
        'Erika', 
        'Villon',
        'erika.villon@dlsu.edu.ph',
        'Assistant Professor in the Software Technology department. Primarily reserves labs for hands-on machine learning lectures.',
        'https://example.com/profile_pictures/erika.jpg',
        FALSE,
        TRUE,
        'FACULTY' 
    )
);

INSERT INTO Seat (roomId, seatId) VALUES (
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
    (2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
    (3, 1), (3, 2), (3, 3), (3, 4), (3, 5),
    (4, 1), (4, 2), (4, 3), (4, 4), (4, 5),
    (5, 1), (5, 2), (5, 3), (5, 4), (5, 5)
);

INSERT INTO Timeslot (startTime, endTime) VALUES (
    ('08:00:00', '10:00:00'),
    ('10:00:00', '12:00:00'),
    ('13:00:00', '15:00:00'),
    ('15:00:00', '17:00:00')
);

INSERT INTO Reservation (userID, seatID, roomID, timeslotID, requestDate, isAnonymous, isRecurring) VALUES (
    (10002, 1, 1, 1, '2026-03-02', FALSE, FALSE),
    (10006, 6, 2, 2, '2026-03-02', FALSE, TRUE),
    (10003, 11, 3, 3, '2026-03-02', TRUE, FALSE),
    (10004, 12, 3, 4, '2026-03-02', FALSE, FALSE)
);

