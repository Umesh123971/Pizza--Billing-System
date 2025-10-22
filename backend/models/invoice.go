package models

import (
	"time"

	"gorm.io/gorm"
)

type Invoice struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
	Date         time.Time      `json:"date" gorm:"not null"`
	Total        float64        `json:"total" gorm:"not null;type:decimal(10,2)"`
	Tax          float64        `json:"tax" gorm:"not null;type:decimal(10,2)"`
	GrandTotal   float64        `json:"grand_total" gorm:"not null;type:decimal(10,2)"`
	InvoiceItems []InvoiceItem  `json:"invoice_items" gorm:"foreignKey:InvoiceID;constraint:OnDelete:CASCADE"`
}

type InvoiceItem struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	InvoiceID uint           `json:"invoice_id" gorm:"not null;index"`
	ItemID    uint           `json:"item_id" gorm:"not null;index"`
	Quantity  int            `json:"quantity" gorm:"not null"`
	Subtotal  float64        `json:"subtotal" gorm:"not null;type:decimal(10,2)"`
	Item      Item           `json:"item" gorm:"foreignKey:ItemID"`
}

// TableName specifies the table name for Invoice model
func (Invoice) TableName() string {
	return "invoices"
}

// TableName specifies the table name for InvoiceItem model
func (InvoiceItem) TableName() string {
	return "invoice_items"
}
