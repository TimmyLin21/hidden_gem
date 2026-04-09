package main

func main() {
	// googleResponse, err := google.GetPlaceFromMessy(
	// 	"The Palomar Sydney is a genuinely exciting new addition to Oxford Street",
	// 	"1 Oxford St,NSW,2021,AU",
	// )
	// if err != nil {
	// 	panic(err)
	// }
	// println("Google Places API Response:")
	// for _, place := range googleResponse.Places {
	// 	println("ID:", place.ID)
	// 	println("Name:", place.DisplayName.Text)
	// 	println("Address:", place.FormattedAddress)
	// 	println("Rating:", place.Rating)
	// 	println("Location: (", place.Location.Latitude, ",", place.Location.Longitude, ")\n")
	// }
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
