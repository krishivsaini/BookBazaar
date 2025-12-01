import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../utils/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      setCart(null);
      return;
    }
    try {
      const response = await axios.get('/cart');
      const items = response.data.items || [];
      const count = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (bookId, quantity = 1) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return false;
    }
    try {
      await axios.post('/cart', { bookId, quantity });
      await fetchCart();
      toast.success('Book added to cart!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      await axios.delete(`/cart/${bookId}`);
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error removing item');
    }
  };

  const updateQuantity = async (bookId, quantity) => {
    try {
      await axios.put(`/cart/${bookId}`, { quantity });
      await fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating quantity');
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/cart');
      await fetchCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error clearing cart');
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      fetchCart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};
