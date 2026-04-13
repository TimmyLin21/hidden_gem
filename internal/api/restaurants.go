package api

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/TimmyLin21/hidden_gem/internal/database"
	"github.com/TimmyLin21/hidden_gem/internal/utils"
)

func (cfg *Config) HandlerRestaurantsGet(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()

	var namePtr *string
	if name := q.Get("query"); name != "" {
		namePtr = &name
	}

	var ratingPtr *float64
	if ratingStr := q.Get("rating"); ratingStr != "" {
		ratingVal, err := strconv.ParseFloat(ratingStr, 64)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid rating parameter", err)
			return
		}
		ratingPtr = &ratingVal
	}

	var priceLevels []int32
	if priceLevelsStr := q.Get("price_level"); priceLevelsStr != "" {
		for _, priceLevelStr := range strings.Split(priceLevelsStr, ",") {
			priceLevel, err := strconv.Atoi(priceLevelStr)
			if err != nil {
				respondWithError(w, http.StatusBadRequest, "Invalid price_level parameter", err)
				return
			}
			priceLevels = append(priceLevels, int32(priceLevel))
		}
	}

	var types []string
	if typesStr := q.Get("types"); typesStr != "" {
		types = strings.Split(typesStr, ",")
	}

	var restroomPtr *bool
	if restroomStr := q.Get("restroom"); restroomStr != "" {
		val := restroomStr == "true"
		restroomPtr = &val
	}

	restaurants, err := cfg.DB.GetRestaurants(r.Context(), database.GetRestaurantsParams{
		Name:        utils.ToNullString(namePtr),
		Rating:      utils.ToNullFloat64(ratingPtr),
		PriceLevels: priceLevels,
		Types:       types,
		Restroom:    utils.ToNullBool(restroomPtr),
	})

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to retrieve restaurants", err)
		return
	}
	respondWithJSON(w, http.StatusOK, restaurants)
}

func (cfg *Config) HandlerRestaurantsGetByID(w http.ResponseWriter, r *http.Request) {
	placeID := r.PathValue("placeID")

	restaurant, err := cfg.DB.GetRestaurantByID(r.Context(), placeID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			respondWithError(w, http.StatusNotFound, "Restaurant not found", nil)
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Failed to retrieve restaurant", err)
		return
	}
	respondWithJSON(w, http.StatusOK, restaurant)
}

func (cfg *Config) HandlerRestaurantsGetTypes(w http.ResponseWriter, r *http.Request) {
	types, err := cfg.DB.GetRestaurantsTypes(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to retrieve restaurant types", err)
		return
	}
	respondWithJSON(w, http.StatusOK, types)
}
