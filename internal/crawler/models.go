package crawler

type Restaurant struct {
	Type    string `json:"@type"`
	Name    string `json:"name"`
	Address struct {
		StreetAddress   string `json:"streetAddress"`
		AddressLocality string `json:"addressLocality"`
		PostalCode      string `json:"postalCode"`
		AddressCountry  string `json:"addressCountry"`
	}
	ServesCuisine string `json:"servesCuisine"`
	Telephone     string `json:"telephone"`
	Review        struct {
		ReviewRating struct {
			RatingValue float64 `json:"ratingValue"`
		} `json:"reviewRating"`
	} `json:"review"`
	PriceRange string `json:"priceRange"`
	Geo        struct {
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	} `json:"geo"`
}
