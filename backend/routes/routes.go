package routes

import (
	"backend/controllers"
	"net/http"

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all application routes
func SetupRoutes(r *gin.Engine) {
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
