import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  FileText, 
  TrendingUp,
  Calendar,
  Package
} from 'lucide-react';
import toast from 'react-hot-toast';
import { itemsApi, invoicesApi } from '../services/api';
import { Item, Invoice } from '../app/types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, invoicesRes] = await Promise.all([
        itemsApi.getAll(),
        invoicesApi.getAll(),
      ]);
      setItems(itemsRes.data);
      setInvoices(invoicesRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grand_total, 0);
  const todayInvoices = invoices.filter(
    (inv) => new Date(inv.date).toDateString() === new Date().toDateString()
  ).length;
  const availableItems = items.filter(item => item.availability).length;

  const getCategoryCount = (category: string) => {
    return items.filter(item => item.category === category).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to 21C Care Pizza Billing System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Items</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{items.length}</p>
              <p className="text-green-600 text-sm mt-1">{availableItems} available</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <ShoppingBag size={32} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Invoices</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{invoices.length}</p>
              <p className="text-blue-600 text-sm mt-1">All time</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FileText size={32} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                Rs {totalRevenue.toFixed(2)}
              </p>
              <p className="text-yellow-600 text-sm mt-1">Total earnings</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-yellow-600">₨</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Today's Sales</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{todayInvoices}</p>
              <p className="text-purple-600 text-sm mt-1">Invoices today</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp size={32} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Package className="mr-2 text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Items by Category</h2>
          </div>
          <div className="space-y-4">
            {['Pizza', 'Topping', 'Beverage'].map((category) => {
              const count = getCategoryCount(category);
              const percentage = items.length > 0 ? (count / items.length) * 100 : 0;
              return (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm font-medium text-gray-700">{count} items</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calendar className="mr-2 text-green-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Recent Invoices</h2>
            </div>
            <button
              onClick={() => navigate('/invoices')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No invoices yet</p>
            ) : (
              invoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/invoices/${invoice.id}`)}
                >
                  <div>
                    <p className="font-semibold text-gray-800">Invoice #{invoice.id}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString()} at{' '}
                      {new Date(invoice.date).toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {invoice.invoice_items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 text-lg">
                       Rs {invoice.grand_total.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/items')}
            className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <ShoppingBag className="mr-2 text-blue-600" size={20} />
            <span className="font-medium text-blue-600">Manage Items</span>
          </button>
          <button
            onClick={() => navigate('/invoices/create')}
            className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <FileText className="mr-2 text-green-600" size={20} />
            <span className="font-medium text-green-600">Create Invoice</span>
          </button>
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <Calendar className="mr-2 text-purple-600" size={20} />
            <span className="font-medium text-purple-600">View Invoices</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;