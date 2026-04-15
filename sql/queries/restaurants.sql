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
SELECT 
    id,
    place_id,
    name,
    source_url,
    rating,
    price_level,
    address,
    website,
    telephone,
    types,
    restroom,
    image_url,
    ST_AsGeoJSON(location)::jsonb AS location_json 
FROM restaurants
WHERE
    (name ILIKE '%' || sqlc.narg('name')::text || '%' OR sqlc.narg('name') IS NULL) AND
    (rating >= sqlc.narg('rating') OR sqlc.narg('rating') IS NULL) AND
    (price_level = ANY(sqlc.narg('price_levels')::int[]) OR sqlc.narg('price_levels') IS NULL) AND
    (types && sqlc.narg('types')::text[] OR sqlc.narg('types') IS NULL) AND
    (restroom = sqlc.narg('restroom') OR sqlc.narg('restroom') IS NULL)
ORDER BY rating DESC
LIMIT 9 OFFSET sqlc.narg('offset')
;

-- name: GetRestaurantsCount :one
SELECT COUNT(*) FROM restaurants
WHERE
    (name ILIKE '%' || sqlc.narg('name')::text || '%' OR sqlc.narg('name') IS NULL) AND
    (rating >= sqlc.narg('rating') OR sqlc.narg('rating') IS NULL) AND
    (price_level = ANY(sqlc.narg('price_levels')::int[]) OR sqlc.narg('price_levels') IS NULL) AND
    (types && sqlc.narg('types')::text[] OR sqlc.narg('types') IS NULL) AND
    (restroom = sqlc.narg('restroom') OR sqlc.narg('restroom') IS NULL);

-- name: GetRestaurantByID :one
SELECT 
    id,
    place_id,
    name,
    source_url,
    rating,
    price_level,
    address,
    website,
    telephone,
    types,
    restroom,
    image_url,
    ST_AsGeoJSON(location)::jsonb AS location_json 
FROM restaurants
WHERE place_id = $1;

-- name: GetRestaurantsTypes :many
SELECT DISTINCT unnest(types) AS type FROM restaurants;