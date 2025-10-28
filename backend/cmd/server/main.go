package main

import (
	"backend/models"
	"backend/routes"
	"backend/seed"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found")
	}

	// Initialize database connection
	models.InitDB()

	// Seed initial data (run once or check if data already exists)
	seed.SeedData()

	// Initialize Gin router
	r := gin.Default()

	// Setup routes (includes CORS configuration)
	routes.SetupRoutes(r)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("🚀 Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
