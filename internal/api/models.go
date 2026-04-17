package api

import (
	"github.com/TimmyLin21/hidden_gem/internal/database"
)

type Config struct {
	DB *database.Queries
}

type PaginationMeta struct {
	TotalCount  int64 `json:"total_count"`
	TotalPages  int64 `json:"total_pages"`
	CurrentPage int   `json:"current_page"`
}

type RestaurantMetadataResponse struct {
	Data []database.GetRestaurantsRow `json:"data"`
	Meta PaginationMeta               `json:"meta"`
}

type CrawlRequestParams struct {
	StartURL         string `json:"start_url"`
	GoogleMapsApiKey string `json:"google_maps_api_key"`
}

type CrawlJobResponse struct {
	CrawlJobID string `json:"crawl_job_id"`
	Message    string `json:"message"`
}
