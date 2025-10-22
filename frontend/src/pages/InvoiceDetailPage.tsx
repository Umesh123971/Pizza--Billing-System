import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Package, Printer } from 'lucide-react';
import toast from 'react-hot-toast';
import { invoicesApi } from '../services/api';
import { Invoice } from '../app/types';

const InvoiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInvoice(parseInt(id));
    }
  }, [id]);

  const fetchInvoice = async (invoiceId: number) => {
    try {
      setLoading(true);
      const response = await invoicesApi.getById(invoiceId);
      setInvoice(response.data);
    } catch (error) {
      toast.error('Failed to fetch invoice details');
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Invoice not found</p>
        <button
          onClick={() => navigate('/invoices')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Invoices
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Printer size={20} className="mr-2" />
          Print Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">21C Care Pizza</h1>
              <p className="text-gray-600 mt-1">Billing System</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-blue-600">INVOICE</h2>
              <p className="text-gray-600 mt-1">#{invoice.id}</p>
            </div>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Calendar className="mr-2 text-blue-600" size={20} />
              <span className="font-semibold text-gray-700">Date</span>
            </div>
            <p className="text-gray-800">{new Date(invoice.date).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">{new Date(invoice.date).toLocaleTimeString()}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Package className="mr-2 text-green-600" size={20} />
              <span className="font-semibold text-gray-700">Total Items</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {invoice.invoice_items.length}
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="text-2xl font-bold text-yellow-600 mr-2">₨</span>
              <span className="font-semibold text-gray-700">Grand Total</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              Rs {invoice.grand_total.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Invoice Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.invoice_items.map((invoiceItem) => (
                  <tr key={invoiceItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{invoiceItem.item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {invoiceItem.item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">
                      Rs {invoiceItem.item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="font-semibold text-gray-900">{invoiceItem.quantity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                      Rs {invoiceItem.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/3 space-y-2">
            <div className="flex justify-between text-gray-700 pb-2">
              <span className="font-medium">Subtotal:</span>
              <span className="font-semibold">Rs {invoice.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 pb-2">
              <span className="font-medium">Tax (10%):</span>
              <span className="font-semibold">Rs {invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2 border-gray-300">
              <span>Grand Total:</span>
              <span className="text-green-600">Rs {invoice.grand_total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-600">
          <p className="text-sm">Thank you for your business!</p>
          <p className="text-xs mt-2">21C Care Pizza Billing System | Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;