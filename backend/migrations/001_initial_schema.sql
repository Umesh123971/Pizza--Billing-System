-- This is optional - GORM AutoMigrate handles this
-- Use this if you want manual control over migrations

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    availability BOOLEAN DEFAULT true
);

CREATE INDEX idx_items_deleted_at ON items(deleted_at);
CREATE INDEX idx_items_category ON items(category);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    grand_total DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_invoices_deleted_at ON invoices(deleted_at);
CREATE INDEX idx_invoices_date ON invoices(date);

CREATE TABLE IF NOT EXISTS invoice_items (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id),
    quantity INTEGER NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_invoice_items_deleted_at ON invoice_items(deleted_at);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_item_id ON invoice_items(item_id);