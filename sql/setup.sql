CREATE DATABASE IF NOT EXISTS Lab_Reservation_System;
USE Lab_Reservation_System;

CREATE TABLE IF NOT EXISTS Room (
    roomID       INT PRIMARY KEY AUTO_INCREMENT,
    roomCode     VARCHAR(10),
    buildingName VARCHAR(100),
    description  VARCHAR(280)
);
CREATE TABLE IF NOT EXISTS User (
    userID            INT PRIMARY KEY AUTO_INCREMENT,
    firstName         VARCHAR(64),
    lastName          VARCHAR(64),
    email             VARCHAR(64) NOT NULL,
    bio               VARCHAR(280),
    profilePictureURL VARCHAR(6553),
    isAnonymous       BOOLEAN,
    isPublic          BOOLEAN,
    role              ENUM('STUDENT', 'FACULTY', 'ADMIN') NOT NULL
);

CREATE TABLE IF NOT EXISTS Seat (
    roomId INT,
    seatId INT,
    PRIMARY KEY (roomId, seatId)
);

CREATE TABLE IF NOT EXISTS Reservation (
    reservationID  INT PRIMARY KEY AUTO_INCREMENT,
    userID         INT,
    seatID         INT,
    roomID         INT,
    timeslotID     INT,
    requestDate    DATE,
    requestTime    DATETIME DEFAULT CURRENT_TIMESTAMP,
    isAnonymous    BOOLEAN,
    isRecurring    BOOLEAN,
);

CREATE TABLE IF NOT EXISTS Timeslot (
    timeslotID INT PRIMARY KEY AUTO_INCREMENT,
    startTime  TIME,
    endTime    TIME
);