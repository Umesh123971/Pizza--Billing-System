package models

import (
	"time"

	"gorm.io/gorm"
)

type Item struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
	Name         string         `json:"name" gorm:"not null"`
	Category     string         `json:"category" gorm:"not null"`
	Price        float64        `json:"price" gorm:"not null;type:decimal(10,2)"`
	Availability bool           `json:"availability" gorm:"default:true"`
}

// TableName specifies the table name for Item model
func (Item) TableName() string {
	return "items"
}
