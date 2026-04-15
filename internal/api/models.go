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
