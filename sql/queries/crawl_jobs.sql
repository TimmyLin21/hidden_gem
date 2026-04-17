-- name: CreateCrawlJob :one
INSERT INTO crawl_jobs (id, status, start_url, error_message)
VALUES (
    gen_random_uuid(),
    $1, $2, $3
)
RETURNING *;

-- name: GetCrawlJobByID :one
SELECT * FROM crawl_jobs WHERE id = $1;

-- name: UpdateCrawlJobStatus :exec
UPDATE crawl_jobs
SET status = $2, updated_at = NOW(), error_message = $3
WHERE id = $1;