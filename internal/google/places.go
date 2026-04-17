package google

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

func NewClient(apiKey string) *Client {
	return &Client{
		apiKey:     apiKey,
		httpClient: &http.Client{},
	}
}

func (e *GoogleAPIError) Error() string {
	return fmt.Sprintf("Google API error: code=%d, status=%s, message=%s", e.Code, e.Status, e.Message)
}

func (p *PriceLevel) UnmarshalJSON(b []byte) error {
	var s string
	if err := json.Unmarshal(b, &s); err != nil {
		return fmt.Errorf("Error unmarshaling price level: %s", err)
	}

	switch strings.ToUpper(s) {
	case "PRICE_LEVEL_FREE":
		*p = PRICE_LEVEL_FREE
	case "PRICE_LEVEL_INEXPENSIVE":
		*p = PRICE_LEVEL_INEXPENSIVE
	case "PRICE_LEVEL_MODERATE":
		*p = PRICE_LEVEL_MODERATE
	case "PRICE_LEVEL_EXPENSIVE":
		*p = PRICE_LEVEL_EXPENSIVE
	case "PRICE_LEVEL_VERY_EXPENSIVE":
		*p = PRICE_LEVEL_VERY_EXPENSIVE
	default:
		*p = PRICE_LEVEL_UNSPECIFIED
	}
	return nil
}

func (c *Client) GetPlaceFromMessy(ctx context.Context, messyName, address string) (PlacesResponse, error) {
	const URL = "https://places.googleapis.com/v1/places:searchText"

	payload := map[string]string{
		"textQuery": fmt.Sprintf("%s, %s", messyName, address),
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("Error marshaling payload: %s", err)
	}

	req, err := http.NewRequestWithContext(ctx, "POST", URL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("Error creating request: %s", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Goog-Api-Key", c.apiKey)
	req.Header.Set("X-Goog-FieldMask", "places.id,places.displayName,places.formattedAddress,places.rating,places.priceLevel,places.location,places.websiteUri,places.nationalPhoneNumber,places.types,places.restroom")

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("Error making API request: %s", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		var errorWrapper struct {
			Error GoogleAPIError `json:"error"`
		}
		body, _ := io.ReadAll(resp.Body)
		if err := json.Unmarshal(body, &errorWrapper); err != nil {
			return PlacesResponse{}, fmt.Errorf("failed to decode error: %w", err)
		}
		return PlacesResponse{}, &errorWrapper.Error
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
