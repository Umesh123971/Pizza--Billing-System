import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import ItemsPage from '../pages/ItemsPage';
import InvoicesPage from '../pages/InvoicesPage';
import CreateInvoicePage from '../pages/CreateInvoicePage';
import InvoiceDetailPage from '../pages/InvoiceDetailPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/items" element={<ItemsPage />} />
      <Route path="/invoices" element={<InvoicesPage />} />
      <Route path="/invoices/create" element={<CreateInvoicePage />} />
      <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;