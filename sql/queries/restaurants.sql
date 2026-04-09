-- name: CreateRestaurant :one
INSERT INTO restaurants (id, created_at, updated_at, place_id, name, source_url, rating, price_level, address, website, telephone, location, types, restroom, image_url)
VALUES (
    gen_random_uuid(),
    NOW(),
    NOW(),
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
)
RETURNING *;

-- name: GetRestaurantBySourceURL :one
SELECT * FROM restaurants WHERE source_url = $1;

-- name: GetRestaurants :many
SELECT * FROM restaurants;

-- name: GetRestaurantByID :one
SELECT * FROM restaurants WHERE place_id = $1;