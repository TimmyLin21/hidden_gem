package google

import "net/http"

type Client struct {
	apiKey     string
	httpClient *http.Client
}

type PriceLevel int

const (
	PRICE_LEVEL_UNSPECIFIED PriceLevel = iota
	PRICE_LEVEL_FREE
	PRICE_LEVEL_INEXPENSIVE
	PRICE_LEVEL_MODERATE
	PRICE_LEVEL_EXPENSIVE
	PRICE_LEVEL_VERY_EXPENSIVE
)

type PlacesResponse struct {
	Places []struct {
		ID          string `json:"id"`
		DisplayName struct {
			Text string `json:"text"`
		} `json:"displayName"`
		FormattedAddress string     `json:"formattedAddress"`
		Rating           float64    `json:"rating"`
		PriceLevel       PriceLevel `json:"priceLevel"`
		Location         struct {
			Latitude  float64 `json:"latitude"`
			Longitude float64 `json:"longitude"`
		} `json:"location"`
		Website   string   `json:"websiteUri"`
		Telephone string   `json:"nationalPhoneNumber"`
		Types     []string `json:"types"`
		Restroom  bool     `json:"restroom"`
	} `json:"places"`
}

type GoogleAPIError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Status  string `json:"status"`
}
