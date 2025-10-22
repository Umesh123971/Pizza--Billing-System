import axios, { AxiosError } from 'axios';
import { Item, Invoice, CreateInvoiceRequest } from '../app/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Item API endpoints
export const itemsApi = {
  getAll: () => api.get<Item[]>('/items'),
  getById: (id: number) => api.get<Item>(`/items/${id}`),
  create: (item: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Item>('/items', item),
  update: (id: number, item: Partial<Item>) => 
    api.put<Item>(`/items/${id}`, item),
  delete: (id: number) => api.delete(`/items/${id}`),
};

// Invoice API endpoints
export const invoicesApi = {
  getAll: () => api.get<Invoice[]>('/invoices'),
  getById: (id: number) => api.get<Invoice>(`/invoices/${id}`),
  create: (invoice: CreateInvoiceRequest) => 
    api.post<Invoice>('/invoices', invoice),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;