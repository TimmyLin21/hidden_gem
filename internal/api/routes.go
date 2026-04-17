package api

import (
	"net/http"
)

func RegisterRoutes(mux *http.ServeMux, cfg *Config) {
	mux.HandleFunc("GET /api/healthz", HandlerReadiness)
	mux.HandleFunc("GET /api/restaurants", cfg.HandlerRestaurantsGet)
	mux.HandleFunc("GET /api/restaurants/types", cfg.HandlerRestaurantsGetTypes)
	mux.HandleFunc("POST /api/crawl", cfg.HandlerCrawl)
	mux.HandleFunc("GET /api/crawl-jobs/{crawlJobID}", cfg.HandlerCrawlJobsGet)
}
