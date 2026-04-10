package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/TimmyLin21/hidden_gem/internal/api"
	"github.com/TimmyLin21/hidden_gem/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	const port = "8080"

	err := godotenv.Load()
	if err != nil {
		log.Fatal(fmt.Errorf("Error loading .env file: %s", err))
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal(fmt.Errorf("⚠️  Warning: DB_URL not set in environment variables."))
	}
	fmt.Println("✅ DB_URL loaded successfully.")

	dbConn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(fmt.Errorf("Error opening database connection: %s", err))
	}
	defer dbConn.Close()
	dbQueries := database.New(dbConn)

	config := api.Config{
		DB: dbQueries,
	}

	// apiKey := os.Getenv("GOOGLE_MAPS_API_KEY")
	// if apiKey == "" {
	// 	log.Fatal(fmt.Errorf("⚠️  Warning: GOOGLE_MAPS_API_KEY not set in environment variables."))
	// }
	// fmt.Println("✅ GOOGLE_MAPS_API_KEY loaded successfully.")
	// googleClient := google.NewClient(apiKey)

	// home, err := os.UserHomeDir()
	// if err != nil {
	// 	log.Fatal(fmt.Errorf("Error getting user home directory: %s", err))
	// }

	// fullPath := filepath.Join(home, "Desktop/workspace/hidden_gem/test.json")

	// file, err := os.Open(fullPath)
	// if err != nil {
	// 	log.Fatal(fmt.Errorf("Error opening settings file: %s", err))
	// }
	// defer file.Close()

	// decoder := json.NewDecoder(file)
	// restaurants := []crawler.Restaurant{}
	// err = decoder.Decode(&restaurants)
	// if err != nil {
	// 	log.Fatal(fmt.Errorf("Error decoding JSON: %s", err))
	// }

	// for _, restaurant := range restaurants {
	// 	restaurantDB, err := config.db.GetRestaurantBySourceURL(context.Background(), restaurant.Review.URL)
	// 	if err == nil {
	// 		log.Printf("Restaurant already exists in database, skipping: %s\n", restaurantDB.Name)
	// 		continue
	// 	}
	// 	googleResponse, err := googleClient.GetPlaceFromMessy(
	// 		restaurant.Name,
	// 		fmt.Sprintf(
	// 			"%s,%s,%s,%s",
	// 			restaurant.Address.StreetAddress,
	// 			restaurant.Address.AddressLocality,
	// 			restaurant.Address.PostalCode,
	// 			restaurant.Address.AddressCountry,
	// 		),
	// 	)
	// 	if err != nil {
	// 		log.Fatal(fmt.Errorf("Error fetching Google Places data: %s", err))
	// 	}
	// 	if len(googleResponse.Places) == 0 {
	// 		log.Printf("No Google Places data found for restaurant: %s", restaurant.Name)
	// 		continue
	// 	}
	// 	restaurantData := googleResponse.Places[0]
	// 	restaurantDB, err = config.db.CreateRestaurant(
	// 		context.Background(),
	// 		database.CreateRestaurantParams{
	// 			PlaceID:    restaurantData.ID,
	// 			Name:       restaurantData.DisplayName.Text,
	// 			SourceUrl:  restaurant.Review.URL,
	// 			Rating:     restaurantData.Rating,
	// 			PriceLevel: int32(restaurantData.PriceLevel),
	// 			Address:    restaurantData.FormattedAddress,
	// 			Website: sql.NullString{
	// 				String: restaurantData.Website,
	// 				Valid:  restaurantData.Website != "",
	// 			},
	// 			Telephone: sql.NullString{
	// 				String: restaurantData.Telephone,
	// 				Valid:  restaurantData.Telephone != "",
	// 			},
	// 			Location: fmt.Sprintf("POINT(%f %f)", restaurantData.Location.Longitude, restaurantData.Location.Latitude),
	// 			Types:    restaurantData.Types,
	// 			Restroom: restaurantData.Restroom,
	// 			ImageUrl: sql.NullString{
	// 				String: restaurant.Image,
	// 				Valid:  restaurant.Image != "",
	// 			},
	// 		},
	// 	)
	// 	if err != nil {
	// 		log.Fatal(fmt.Errorf("Error creating restaurant in database: %s", err))
	// 	}
	// 	fmt.Printf("✅ Created restaurant in database: %s\n", restaurantDB.Name)
	// }

	mux := http.NewServeMux()

	api.RegisterRoutes(mux, &config)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("🚀 Starting server on port %s...\n", port)
	log.Fatal(server.ListenAndServe())

	// restaurants, err := crawler.StartCrawling(
	// 	"www.timeout.com",
	// 	"https://www.timeout.com/sydney/food-drink",
	// )
	// if err != nil {
	// 	fmt.Printf("Error during crawling: %s\n", err)
	// 	return
	// }

	// fmt.Println("\n💾 Saving results to local file...")

	// fileData, err := json.MarshalIndent(restaurants, "", "  ")
	// if err != nil {
	// 	fmt.Printf("Error marshaling to JSON: %s\n", err)
	// 	return
	// }

	// err = os.WriteFile("restaurants.json", fileData, 0644)
	// if err != nil {
	// 	fmt.Printf("Error writing file: %s\n", err)
	// 	return
	// }

	// fmt.Printf("✅ Success! Saved %d restaurants to restaurants.json\n", len(restaurants))
}
