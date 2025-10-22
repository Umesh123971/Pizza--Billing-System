package seed

import (
	"backend/models"
	"log"
)

// SeedData inserts initial sample data into database
func SeedData() {
	log.Println("🌱 Starting database seeding...")

	// Check if data already exists
	var count int64
	models.DB.Model(&models.Item{}).Count(&count)
	if count > 0 {
		log.Println("✓ Database already seeded, skipping...")
		return
	}

	items := []models.Item{
		{Name: "Margherita Pizza", Category: "Pizza", Price: 8.99, Availability: true},
		{Name: "Pepperoni Pizza", Category: "Pizza", Price: 10.99, Availability: true},
		{Name: "Hawaiian Pizza", Category: "Pizza", Price: 11.99, Availability: true},
		{Name: "Veggie Supreme", Category: "Pizza", Price: 11.99, Availability: true},
		{Name: "BBQ Chicken Pizza", Category: "Pizza", Price: 12.99, Availability: true},
		{Name: "Meat Lovers Pizza", Category: "Pizza", Price: 13.99, Availability: true},
		{Name: "Four Cheese Pizza", Category: "Pizza", Price: 10.99, Availability: true},

		{Name: "Extra Cheese", Category: "Topping", Price: 1.50, Availability: true},
		{Name: "Mushrooms", Category: "Topping", Price: 1.00, Availability: true},
		{Name: "Olives", Category: "Topping", Price: 1.00, Availability: true},
		{Name: "Peppers", Category: "Topping", Price: 1.00, Availability: true},
		{Name: "Onions", Category: "Topping", Price: 0.75, Availability: true},
		{Name: "Jalapeños", Category: "Topping", Price: 1.25, Availability: true},

		{Name: "Coca Cola", Category: "Beverage", Price: 2.50, Availability: true},
		{Name: "Sprite", Category: "Beverage", Price: 2.50, Availability: true},
		{Name: "Fanta", Category: "Beverage", Price: 2.50, Availability: true},
		{Name: "Water", Category: "Beverage", Price: 1.50, Availability: true},
		{Name: "Iced Tea", Category: "Beverage", Price: 2.75, Availability: true},
	}

	result := models.DB.Create(&items)
	if result.Error != nil {
		log.Fatal("❌ Failed to seed data:", result.Error)
	}

	log.Printf("✓ Successfully seeded %d items\n", len(items))
}
