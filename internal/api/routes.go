package api

import (
	"net/http"
)

func RegisterRoutes(mux *http.ServeMux, cfg *Config) {
	mux.HandleFunc("GET /api/healthz", HandlerReadiness)
	mux.HandleFunc("GET /api/restaurants", cfg.HandlerRestaurantsGet)
	mux.HandleFunc("GET /api/restaurants/types", cfg.HandlerRestaurantsGetTypes)
}
