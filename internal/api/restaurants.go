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

	limit := 9
	page := 1
	if pageStr := q.Get("page"); pageStr != "" {
		pageVal, err := strconv.Atoi(pageStr)
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Invalid page parameter", err)
			return
		}
		if pageVal > 1 {
			page = pageVal
		}
	}
	offset := int32((page - 1) * limit)

	restaurants, err := cfg.DB.GetRestaurants(r.Context(), database.GetRestaurantsParams{
		Name:        utils.ToNullString(namePtr),
		Rating:      utils.ToNullFloat64(ratingPtr),
		PriceLevels: priceLevels,
		Types:       types,
		Restroom:    utils.ToNullBool(restroomPtr),
		Offset:      utils.ToNullInt32(&offset),
	})

	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to retrieve restaurants", err)
		return
	}

	count, err := cfg.DB.GetRestaurantsCount(r.Context(), database.GetRestaurantsCountParams{
		Name:        utils.ToNullString(namePtr),
		Rating:      utils.ToNullFloat64(ratingPtr),
		PriceLevels: priceLevels,
		Types:       types,
		Restroom:    utils.ToNullBool(restroomPtr),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Failed to retrieve restaurants count", err)
		return
	}

	totalPages := (count + int64(limit) - 1) / int64(limit)

	respondWithJSON(w, http.StatusOK, RestaurantMetadataResponse{
		Data: restaurants,
		Meta: PaginationMeta{
			TotalCount:  count,
			CurrentPage: page,
			TotalPages:  totalPages,
		},
	})
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
