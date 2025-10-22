import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { itemsApi, invoicesApi } from '../services/api';
import { Item } from '../app/types';

interface CartItem {
  item: Item;
  quantity: number;
}

const CreateInvoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemsApi.getAll();
      setItems(response.data.filter((item) => item.availability));
    } catch (error) {
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: Item) => {
    const existingItem = cart.find((cartItem) => cartItem.item.id === item.id);
    
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { item, quantity: 1 }]);
    }
    
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (itemId: number, change: number) => {
    setCart(
      cart
        .map((cartItem) =>
          cartItem.item.id === itemId
            ? { ...cartItem, quantity: Math.max(0, cartItem.quantity + change) }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  const removeFromCart = (itemId: number) => {
    setCart(cart.filter((cartItem) => cartItem.item.id !== itemId));
    toast.success('Item removed from cart');
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCreateInvoice = async () => {
    if (cart.length === 0) {
      toast.error('Please add items to cart');
      return;
    }

    try {
      setCreating(true);
      const invoiceData = {
        items: cart.map((cartItem) => ({
          item_id: cartItem.item.id,
          quantity: cartItem.quantity,
        })),
      };

      const response = await invoicesApi.create(invoiceData);
      toast.success('Invoice created successfully!');
      navigate(`/invoices/${response.data.id}`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create invoice';
      toast.error(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const categories = ['All', 'Pizza', 'Topping', 'Beverage'];

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
        <button
          onClick={() => navigate('/invoices')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Invoices
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Create New Invoice</h1>
        <p className="text-gray-600 mt-1">Select items and create an invoice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Items</h2>

            {/* Search and Filter */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      categoryFilter === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  No items available
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        Rs {item.price.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full mt-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} className="mr-1" />
                      Add to Cart
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <div className="flex items-center mb-4">
              <ShoppingCart className="mr-2 text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-800">Cart</h2>
              <span className="ml-auto bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm font-semibold">
                {cart.length} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart size={48} className="mx-auto mb-2 text-gray-300" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {cartItem.item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            Rs {cartItem.item.price.toFixed(2)} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartItem.item.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, -1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold w-8 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(cartItem.item.id, 1)}
                            className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <span className="font-bold text-blue-600">
                          Rs {(cartItem.item.price * cartItem.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">Rs {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%):</span>
                    <span className="font-semibold">Rs {calculateTax().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-green-600">Rs {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCreateInvoice}
                  disabled={creating}
                  className={`w-full mt-4 py-3 rounded-lg font-semibold transition-colors ${
                    creating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {creating ? 'Creating...' : 'Create Invoice'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoicePage;