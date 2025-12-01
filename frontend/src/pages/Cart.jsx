import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaShoppingBag } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, fetchCart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cart) {
      setLoading(false);
    } else {
      fetchCart().then(() => setLoading(false));
    }
  }, [cart, fetchCart]);

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(bookId, newQuantity);
  };

  const handleRemoveItem = async (bookId) => {
    await removeFromCart(bookId);
  };

  const handleClearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    await clearCart();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4 pt-24">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-200 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 text-4xl">
            <FaShoppingBag />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any books yet.</p>
          <button 
            onClick={() => navigate('/books')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalPrice || 0;
  const tax = subtotal * 0.1;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
          <button 
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-700 font-medium text-sm hover:underline transition-all"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.book._id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-6 items-center transition-all hover:shadow-md">
                <div 
                  className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/books/${item.book._id}`)}
                >
                  <img 
                    src={item.book.image || 'https://via.placeholder.com/300x450?text=No+Cover'} 
                    alt={item.book.title} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/300x450?text=No+Cover';
                    }}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="flex-1 text-center sm:text-left w-full">
                  <h3 
                    className="text-lg font-bold text-gray-900 mb-1 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => navigate(`/books/${item.book._id}`)}
                  >
                    {item.book.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">{item.book.author}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => handleUpdateQuantity(item.book._id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.book._id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>
                    <button 
                      onClick={() => handleRemoveItem(item.book._id)}
                      className="text-red-400 hover:text-red-600 p-2 transition-colors"
                      title="Remove Item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-400">${item.price} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg text-center">
                    Add ${(500 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-extrabold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-gray-900 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/30 group"
              >
                Proceed to Checkout
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
