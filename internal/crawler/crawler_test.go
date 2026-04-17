package crawler

import "testing"

func TestGetDomain(t *testing.T) {
	tests := []struct {
		url      string
		wantErr  bool
		expected string
	}{
		{
			url:      "https://www.timeout.com/sydney/food-drink",
			wantErr:  false,
			expected: "www.timeout.com",
		},
		{
			url:      "http://example.com/path",
			wantErr:  false,
			expected: "example.com",
		},
		{
			url:      "invalid-url",
			wantErr:  true,
			expected: "",
		},
	}

	for _, tt := range tests {
		t.Run(tt.url, func(t *testing.T) {
			domain, err := GetDomain(tt.url)
			if (err != nil) != tt.wantErr {
				t.Errorf("GetDomain(%q) error = %v, wantErr %v", tt.url, err, tt.wantErr)
				return
			}
			if domain != tt.expected {
				t.Errorf("GetDomain(%q) = %v, want %v", tt.url, domain, tt.expected)
			}
		})
	}
}
