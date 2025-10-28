package routes

import (
	"backend/controllers"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all application routes
func SetupRoutes(r *gin.Engine) {
	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{
		"http://localhost:3000",                       // Local development
		"https://pizza-billing-frontend.onrender.com", // Production frontend
	}

	// Allow additional origins from environment variable if set
	if frontendURL := os.Getenv("FRONTEND_URL"); frontendURL != "" {
		config.AllowOrigins = append(config.AllowOrigins, frontendURL)
	}

	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true

	r.Use(cors.New(config))

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "21C Care Pizza Billing API is running",
		})
	})

	// API group
	api := r.Group("/api")
	{
		// Item routes
		items := api.Group("/items")
		{
			items.GET("", controllers.GetAllItems)
			items.POST("", controllers.CreateItem)
			items.PUT("/:id", controllers.UpdateItem)
			items.DELETE("/:id", controllers.DeleteItem)
		}

		// Invoice routes
		invoices := api.Group("/invoices")
		{
			invoices.GET("", controllers.GetAllInvoices)
			invoices.POST("", controllers.CreateInvoice)
			invoices.GET("/:id", controllers.GetInvoiceByID)
		}
	}
}
