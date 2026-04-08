package crawler

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/gocolly/colly"
)

func StartCrawling(allowedDomain, startURL string) ([]Restaurant, error) {
	var restaurants []Restaurant
	var mutex sync.Mutex

	c := colly.NewCollector(
		colly.AllowedDomains(allowedDomain),
		colly.MaxDepth(3),
	)

	c.Limit(&colly.LimitRule{
		DomainGlob:  "*timeout.*",
		Parallelism: 2,
		RandomDelay: 5 * time.Second,
	})

	c.OnHTML("script[type='application/ld+json']", func(e *colly.HTMLElement) {
		var restaurant Restaurant
		err := json.Unmarshal([]byte(e.Text), &restaurant)
		if err != nil {
			fmt.Printf("Error parsing JSON: %s\n", err)
			return
		}
		if restaurant.Type != "Restaurant" {
			return
		}
		mutex.Lock()
		restaurants = append(restaurants, restaurant)
		mutex.Unlock()
		fmt.Printf("✅ Found: %s\n", restaurant.Name)
	})

	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		link := e.Attr("href")
		if strings.Contains(link, "/restaurants/") {
			fmt.Printf("Link found: %q -> %s\n", e.Text, link)
			e.Request.Visit(e.Request.AbsoluteURL(link))
		}
	})

	c.OnRequest(func(r *colly.Request) {
		fmt.Printf("Visiting: %s\n", r.URL.String())
	})

	c.Visit(startURL)

	return restaurants, nil
}
