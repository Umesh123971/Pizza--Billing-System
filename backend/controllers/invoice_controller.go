package controllers

import (
	"backend/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateInvoiceRequest struct {
	Items []struct {
		ItemID   uint `json:"item_id" binding:"required"`
		Quantity int  `json:"quantity" binding:"required,min=1"`
	} `json:"items" binding:"required,min=1"`
}

// GetAllInvoices retrieves all invoices with their items
func GetAllInvoices(c *gin.Context) {
	var invoices []models.Invoice

	if err := models.DB.Preload("InvoiceItems.Item").
		Order("created_at desc").
		Find(&invoices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch invoices",
		})
		return
	}

	c.JSON(http.StatusOK, invoices)
}

// CreateInvoice creates a new invoice with items
func CreateInvoice(c *gin.Context) {
	var req CreateInvoiceRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data: " + err.Error(),
		})
		return
	}

	if len(req.Items) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invoice must have at least one item",
		})
		return
	}

	var total float64 = 0
	var invoiceItems []models.InvoiceItem

	// Calculate totals and prepare invoice items
	for _, reqItem := range req.Items {
		var item models.Item
		if err := models.DB.First(&item, reqItem.ItemID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Item not found with ID: " + strconv.Itoa(int(reqItem.ItemID)),
			})
			return
		}

		if !item.Availability {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Item is not available: " + item.Name,
			})
			return
		}

		subtotal := float64(reqItem.Quantity) * item.Price
		total += subtotal

		invoiceItems = append(invoiceItems, models.InvoiceItem{
			ItemID:   reqItem.ItemID,
			Quantity: reqItem.Quantity,
			Subtotal: subtotal,
		})
	}

	// Calculate tax and grand total
	tax := total * 0.10
	grandTotal := total + tax

	// Create invoice
	invoice := models.Invoice{
		Date:         time.Now(),
		Total:        total,
		Tax:          tax,
		GrandTotal:   grandTotal,
		InvoiceItems: invoiceItems,
	}

	if err := models.DB.Create(&invoice).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create invoice",
		})
		return
	}

	// Fetch created invoice with all relations
	models.DB.Preload("InvoiceItems.Item").First(&invoice, invoice.ID)

	c.JSON(http.StatusCreated, invoice)
}

// GetInvoiceByID retrieves a specific invoice by ID
func GetInvoiceByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	var invoice models.Invoice
	if err := models.DB.Preload("InvoiceItems.Item").
		First(&invoice, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Invoice not found",
		})
		return
	}

	c.JSON(http.StatusOK, invoice)
}
