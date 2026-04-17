package api

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/TimmyLin21/hidden_gem/internal/crawler"
	"github.com/TimmyLin21/hidden_gem/internal/database"
	"github.com/TimmyLin21/hidden_gem/internal/google"
	"github.com/google/uuid"
)

func (cfg *Config) HandlerCrawl(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	params := CrawlRequestParams{}
	if err := decoder.Decode(&params); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload", err)
		return
	}
	defer r.Body.Close()

	domain, err := crawler.GetDomain(params.StartURL)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid start URL", err)
		return
	}
	googleClient := google.NewClient(params.GoogleMapsApiKey)

	// Verify user provided a valid GoogleMapsApiKey
	_, err = googleClient.GetPlaceFromMessy(context.Background(), "Palomar", "1 Oxford St, NSW, 2021, AU")
	if err != nil {
		var googleErr *google.GoogleAPIError

		if errors.As(err, &googleErr) {
			if googleErr.Status == "PERMISSION_DENIED" || googleErr.Code == 403 {
				respondWithError(w, http.StatusBadRequest, "Invalid Google Maps API key or API not enabled", nil)
				return
			}
			respondWithError(w, http.StatusInternalServerError, googleErr.Message, nil)
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Could not crawl restaurants", err)
		return
	}

	crawlJob, err := cfg.DB.CreateCrawlJob(context.Background(), database.CreateCrawlJobParams{
		Status:       "pending",
		StartUrl:     params.StartURL,
		ErrorMessage: sql.NullString{Valid: false},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not create crawl job", err)
		return
	}

	go cfg.runBackgroundCrawl(context.Background(), domain, params.StartURL, googleClient, crawlJob.ID)

	respondWithJSON(w, http.StatusOK, CrawlJobResponse{
		Message:    "Crawl started. Checks logs for progress.",
		CrawlJobID: crawlJob.ID.String(),
	})
}

func (cfg *Config) runBackgroundCrawl(ctx context.Context, domain, startURL string, googleClient *google.Client, crawlJobID uuid.UUID) {
	log.Printf("Starting background crawl for URL: %s\n", startURL)
	err := cfg.DB.UpdateCrawlJobStatus(ctx, database.UpdateCrawlJobStatusParams{
		ID:           crawlJobID,
		Status:       "in_progress",
		ErrorMessage: sql.NullString{Valid: false},
	})
	if err != nil {
		log.Printf("Could not update crawl job status to in_progress: %v", err)
		return
	}

	restaurants, err := crawler.StartCrawling(
		domain,
		startURL,
	)
	if err != nil {
		log.Printf("Could not crawl restaurants: %v", err)
		err := cfg.DB.UpdateCrawlJobStatus(ctx, database.UpdateCrawlJobStatusParams{
			ID:           crawlJobID,
			Status:       "failed",
			ErrorMessage: sql.NullString{Valid: true, String: err.Error()},
		})
		if err != nil {
			log.Printf("Could not update crawl job status to failed: %v", err)
		}
		return
	}

	for _, restaurant := range restaurants {

		cfg.processSingleRestaurant(ctx, restaurant, googleClient)
	}
	log.Printf("Successfully completed crawl for URL: %s\n", startURL)
	err = cfg.DB.UpdateCrawlJobStatus(ctx, database.UpdateCrawlJobStatusParams{
		ID:           crawlJobID,
		Status:       "completed",
		ErrorMessage: sql.NullString{Valid: false},
	})
	if err != nil {
		log.Printf("Could not update crawl job status to completed: %v", err)
		return
	}
}

func (cfg *Config) processSingleRestaurant(ctx context.Context, restaurant crawler.Restaurant, googleClient *google.Client) {
	restaurantDB, err := cfg.DB.GetRestaurantBySourceURL(ctx, restaurant.Review.URL)
	if err == nil {
		log.Printf("Restaurant already exists in database, skipping: %s\n", restaurantDB.Name)
		return
	}
	googleResponse, err := googleClient.GetPlaceFromMessy(
		ctx,
		restaurant.Name,
		fmt.Sprintf(
			"%s,%s,%s,%s",
			restaurant.Address.StreetAddress,
			restaurant.Address.AddressLocality,
			restaurant.Address.PostalCode,
			restaurant.Address.AddressCountry,
		),
	)
	if err != nil {
		log.Printf("Error fetching place data from Google for restaurant %s: %s\n", restaurant.Name, err)
		return
	}
	if len(googleResponse.Places) == 0 {
		log.Printf("No Google Places data found for restaurant: %s", restaurant.Name)
		return
	}
	restaurantData := googleResponse.Places[0]
	restaurantDB, err = cfg.DB.CreateRestaurant(
		ctx,
		database.CreateRestaurantParams{
			PlaceID:    restaurantData.ID,
			Name:       restaurantData.DisplayName.Text,
			SourceUrl:  restaurant.Review.URL,
			Rating:     restaurantData.Rating,
			PriceLevel: int32(restaurantData.PriceLevel),
			Address:    restaurantData.FormattedAddress,
			Website: sql.NullString{
				String: restaurantData.Website,
				Valid:  restaurantData.Website != "",
			},
			Telephone: sql.NullString{
				String: restaurantData.Telephone,
				Valid:  restaurantData.Telephone != "",
			},
			Location: fmt.Sprintf("POINT(%f %f)", restaurantData.Location.Longitude, restaurantData.Location.Latitude),
			Types:    restaurantData.Types,
			Restroom: restaurantData.Restroom,
			ImageUrl: sql.NullString{
				String: restaurant.Image,
				Valid:  restaurant.Image != "",
			},
		},
	)
	if err != nil {
		log.Printf("Error creating restaurant in database for %s: %s\n", restaurant.Name, err)
		return
	}
	fmt.Printf("✅ Created restaurant in database: %s\n", restaurantDB.Name)
}

func (cfg *Config) HandlerCrawlJobsGet(w http.ResponseWriter, r *http.Request) {
	crawlJobIDStr := r.PathValue("crawlJobID")
	crawlJobID, err := uuid.Parse(crawlJobIDStr)
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid crawl job ID", err)
		return
	}

	crawlJob, err := cfg.DB.GetCrawlJobByID(context.Background(), crawlJobID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			respondWithError(w, http.StatusNotFound, "Crawl job not found", nil)
			return
		}
		respondWithError(w, http.StatusInternalServerError, "Could not retrieve crawl job", err)
		return
	}
	respondWithJSON(w, http.StatusOK, crawlJob)
}
