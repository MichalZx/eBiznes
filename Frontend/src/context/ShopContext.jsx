import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export const useCart = () => useContext(ShopContext);

export function CartProvider({ children }) {
  const [cartId, setCartId] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <ShopContext.Provider
      value={{ cartId, setCartId, cartProducts, setCartProducts, totalPrice, setTotalPrice }}
    >
      {children}
    </ShopContext.Provider>
  );
}
