CREATE DATABASE tempo_ai_dev;

CREATE SCHEMA identity;
CREATE TABLE identity.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SCHEMA ai;
CREATE TABLE ai.conversations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES identity.users(id),
    itinerary_id INT,
    session_id UUID
)
CREATE TABLE ai.messages (
    id SERIAL PRIMARY KEY,
    conversation_id INT REFERENCES ai.conversations(id),
    role VARCHAR(100) NOT NULL,
    tokens INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SCHEMA travel;
CREATE TABLE travel.itinerary (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES identity.users(id),
    title VARCHAR(255) NOT NULL,
    destination_country VARCHAR(255) NOT NULL,
    destination_city VARCHAR(255) NOT NULL,
    trip_type VARCHAR(100),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE travel.itinerary_days (
    id SERIAL PRIMARY KEY,
    itinerary_id INT REFERENCES travel.itinerary(id),
    day_number INT
);
CREATE TABLE travel.activities (
    id SERIAL PRIMARY KEY,
    itinerary_day_id INT REFERENCES travel.itinerary_days(id),
    poi_id INT NOT NULL,
    order_index INT,
    estimated_cost decimal(10,2),
    currency VARCHAR(10),
    start_time TIME,
    end_time TIME
);
CREATE TABLE travel.points_of_interest (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    address TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);