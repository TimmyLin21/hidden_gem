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

	mux := http.NewServeMux()

	api.RegisterRoutes(mux, &config)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	log.Printf("🚀 Starting server on port %s...\n", port)
	log.Fatal(server.ListenAndServe())
}
