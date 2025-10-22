package models

import (
    "fmt"
    "log"
    "os"

    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDatabase establishes connection to PostgreSQL
func ConnectDatabase() {
    host := os.Getenv("DB_HOST")
    user := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    dbname := os.Getenv("DB_NAME")
    port := os.Getenv("DB_PORT")

    dsn := fmt.Sprintf(
        "host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
        host, user, password, dbname, port,
    )

    database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database:", err)
    }

    DB = database
    log.Println("✓ Database connected successfully")
}

// MigrateDB runs automatic migrations
func MigrateDB() {
    err := DB.AutoMigrate(&Item{}, &Invoice{}, &InvoiceItem{})
    if err != nil {
        log.Fatal("Failed to migrate database:", err)
    }
    log.Println("✓ Database migration completed")
}