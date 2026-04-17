-- +goose Up
CREATE TABLE crawl_jobs (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL,       -- 'pending', 'processing', 'completed', 'failed'
    start_url TEXT NOT NULL,
    error_message TEXT
);

-- +goose Down
DROP TABLE crawl_jobs;