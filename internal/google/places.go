package google

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func GetPlaceFromMessy(messyName, address string) (PlacesResponse, error) {
	err := godotenv.Load()
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("Error loading .env file: %s", err)
	}
	apiKey := os.Getenv("GOOGLE_MAPS_API_KEY")
	const URL = "https://places.googleapis.com/v1/places:searchText"
	if apiKey == "" {
		return PlacesResponse{}, fmt.Errorf("⚠️  Warning: GOOGLE_MAPS_API_KEY not set in environment variables.")
	}

	fmt.Println("✅ GOOGLE_MAPS_API_KEY loaded successfully.")

	payload := map[string]string{
		"textQuery": fmt.Sprintf("%s, %s", messyName, address),
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("Error marshaling payload: %s", err)
	}

	req, err := http.NewRequest("POST", URL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("Error creating request: %s", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Goog-Api-Key", apiKey)
	req.Header.Set("X-Goog-FieldMask", "places.id,places.displayName,places.formattedAddress,places.rating,places.location")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("Error making API request: %s", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return PlacesResponse{}, fmt.Errorf("API request failed with status: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("Error reading response body: %s", err)
	}
	var placesResponse PlacesResponse
	err = json.Unmarshal(body, &placesResponse)
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("Error unmarshaling response: %s", err)
	}

	return placesResponse, nil
}
