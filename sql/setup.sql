CREATE DATABASE IF NOT EXISTS Lab_Reservation_System;
USE Lab_Reservation_System;

CREATE TABLE Labs(
    labID VARCHAR(7) PRIMARY KEY,
    building VARCHAR(15),
    roomNumber INT,
    status ENUM('OPEN', 'CLOSED'),
    totalSeats INT,
    occupiedSeats INT
);

CREATE TABLE Lab_Seats(
    seatID INT PRIMARY KEY AUTO_INCREMENT,
    seatRow VARCHAR(1),
    seatCol INT,
    isReserved BOOL NOT NULL DEFAULT FALSE, 
    labID VARCHAR(7),
    reservationID INT
);

CREATE TABLE Reservation_Logs(
    reservationID INT PRIMARY KEY AUTO_INCREMENT,
    requestTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    startTime TIMESTAMP,
    userID INT FOREIGN KEY
);

CREATE TABLE Users(
    userID INT PRIMARY KEY AUTO_INCREMENT,
    firstName VARCHAR(15),
    lastName VARCHAR(15),
    accPassword VARCHAR(8),
    email VARCHAR(25),
    role ENUM('STUDENT', 'ADMIN', 'FACULTY'),
    bio TINYTEXT,
    profilePicture BLOB
);