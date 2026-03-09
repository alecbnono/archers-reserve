-- Archers Reserve - PostgreSQL Schema

CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_code VARCHAR(10),
    building TEXT,
    floor INT,
    capacity INT
);


CREATE TABLE IF NOT EXISTS "users" (
    user_id            SERIAL PRIMARY KEY,
    username           VARCHAR(50) NOT NULL UNIQUE,
    first_name         VARCHAR(64) NOT NULL,
    last_name          VARCHAR(64) NOT NULL,
    email              VARCHAR(64) NOT NULL UNIQUE,
    password_hash      TEXT NOT NULL,
    bio                VARCHAR(280) DEFAULT '',
    profile_picture_url VARCHAR(2048) DEFAULT '',
    is_anonymous       BOOLEAN DEFAULT FALSE,
    is_public          BOOLEAN DEFAULT TRUE,
    role               VARCHAR(10) NOT NULL CHECK (role IN ('STUDENT', 'FACULTY', 'ADMIN')),
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seats (
    room_id INT NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    seat_id INT NOT NULL,
    PRIMARY KEY (room_id, seat_id)
);

CREATE TABLE IF NOT EXISTS timeslots (
    timeslot_id SERIAL PRIMARY KEY,
    start_time  TIME NOT NULL,
    end_time    TIME NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations (
    reservation_id SERIAL PRIMARY KEY,
    user_id        INT NOT NULL REFERENCES "users"(user_id) ON DELETE CASCADE,
    seat_id        INT NOT NULL,
    room_id        INT NOT NULL,
    timeslot_id    INT NOT NULL REFERENCES timeslots(timeslot_id) ON DELETE CASCADE,
    request_date   DATE NOT NULL,
    request_time   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_anonymous   BOOLEAN DEFAULT FALSE,
    is_recurring   BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (room_id, seat_id) REFERENCES seats(room_id, seat_id) ON DELETE CASCADE
);
