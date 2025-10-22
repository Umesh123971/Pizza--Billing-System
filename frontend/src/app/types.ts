export interface Item {
  id: number;
  name: string;
  category: string;
  price: number;
  availability: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  item_id: number;
  quantity: number;
  subtotal: number;
  item: Item;
  created_at?: string;
  updated_at?: string;
}

export interface Invoice {
  id: number;
  date: string;
  total: number;
  tax: number;
  grand_total: number;
  invoice_items: InvoiceItem[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateInvoiceRequest {
  items: {
    item_id: number;
    quantity: number;
  }[];
}

export interface ApiError {
  error: string;
}