package controllers

import (
	"backend/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetAllItems retrieves all items from database
func GetAllItems(c *gin.Context) {
	var items []models.Item

	if err := models.DB.Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch items",
		})
		return
	}

	c.JSON(http.StatusOK, items)
}

// CreateItem creates a new item
func CreateItem(c *gin.Context) {
	var item models.Item

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data: " + err.Error(),
		})
		return
	}

	// Validation
	if item.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Item name is required"})
		return
	}
	if item.Category == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Category is required"})
		return
	}
	if item.Price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price must be greater than 0"})
		return
	}

	if err := models.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create item",
		})
		return
	}

	c.JSON(http.StatusCreated, item)
}

// UpdateItem updates an existing item
func UpdateItem(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}

	var item models.Item
	if err := models.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	var updateData models.Item
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request data: " + err.Error(),
		})
		return
	}

	// Update fields
	if updateData.Name != "" {
		item.Name = updateData.Name
	}
	if updateData.Category != "" {
		item.Category = updateData.Category
	}
	if updateData.Price > 0 {
		item.Price = updateData.Price
	}
	item.Availability = updateData.Availability

	if err := models.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update item",
		})
		return
	}

	c.JSON(http.StatusOK, item)
}

// DeleteItem deletes an item
func DeleteItem(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
		return
	}

	var item models.Item
	if err := models.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if err := models.DB.Delete(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete item",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Item deleted successfully",
	})
}
