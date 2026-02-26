import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);
/**
 * @author Imtiaz Adar
 * @email imtiazadarofficial@gmail.com
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, color, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item._id === product._id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingItem) {
        toast.success('Item quantity updated in cart');
        return prevItems.map(item =>
          item._id === product._id && item.selectedSize === size && item.selectedColor === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast.success('Item added to cart');
      return [...prevItems, {
        ...product,
        selectedSize: size,
        selectedColor: color,
        quantity
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, size, color) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item._id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    );
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};