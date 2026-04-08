package main

import (
	"fmt"
	"os"
)

func main() {
	googleMapsAPIKey := os.Getenv("GOOGLE_MAPS_API_KEY")
	if googleMapsAPIKey == "" {
		fmt.Println("⚠️  Warning: GOOGLE_MAPS_API_KEY not set in environment variables.")
	} else {
		fmt.Println("✅ GOOGLE_MAPS_API_KEY loaded successfully.")
	}

	// restaurants, err := crawler.StartCrawling(
	// 	"www.timeout.com",
	// 	"https://www.timeout.com/sydney/food-drink",
	// )
	// if err != nil {
	// 	fmt.Printf("Error during crawling: %s\n", err)
	// 	return
	// }

	// fmt.Println("\n💾 Saving results to local file...")

	// 1. Convert the slice to "Pretty Printed" JSON
	// fileData, err := json.MarshalIndent(restaurants, "", "  ")
	// if err != nil {
	// 	fmt.Printf("Error marshaling to JSON: %s\n", err)
	// 	return
	// }

	// 2. Write to a file named restaurants.json
	// 0644 gives read/write permissions to the user
	// err = os.WriteFile("restaurants.json", fileData, 0644)
	// if err != nil {
	// 	fmt.Printf("Error writing file: %s\n", err)
	// 	return
	// }

	// fmt.Printf("✅ Success! Saved %d restaurants to restaurants.json\n", len(restaurants))
}
