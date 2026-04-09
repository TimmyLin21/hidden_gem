-- +goose Up
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE restaurants (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    -- Identification
    place_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    source_url TEXT NOT NULL UNIQUE,
    -- Metadata
    rating FLOAT NOT NULL,
    price_level INT NOT NULL,
    address TEXT NOT NULL,
    website TEXT,
    telephone TEXT,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    types TEXT[] NOT NULL,
    restroom BOOLEAN NOT NULL,
    image_url TEXT
);

-- +goose Down
DROP TABLE restaurants;
DROP EXTENSION IF EXISTS postgis;