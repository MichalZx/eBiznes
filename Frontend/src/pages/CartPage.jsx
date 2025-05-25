import React, { useEffect, useState } from 'react';
import { useCart } from '../context/ShopContext';

function CartPage() {
  const { cartId, setCartId, cartProducts, setCartProducts, totalPrice, setTotalPrice } = useCart();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      if (!cartId) return;

      try {
        const res = await fetch(`http://localhost:8080/carts/${cartId}`);
        const data = await res.json();
        setCartProducts(data.Products);
        const total = data.Products.reduce((acc, p) => acc + p.Price, 0);
        setTotalPrice(total);
      } catch (err) {
        setMessage('Błąd pobierania koszyka');
      }
    };

    fetchCart();
  }, [cartId]);

  const handleCheckout = async () => {
    try {
      const res = await fetch(`http://localhost:8080/carts/${cartId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage('Transakcja przebiegła pomyślnie. Dziękujemy za zakupy.');
        setCartId(null);
        setCartProducts([]);
        setTotalPrice(0);
      } else {
        setMessage('Nie udało się sfinalizować transakcji.');
      }
    } catch (err) {
      setMessage('Błąd transakcji');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Twój koszyk</h1>
      {message && <p>{message}</p>}
      {cartProducts.length > 0 ? (
        <>
          <ul>
            {cartProducts.map(p => (
              <li key={p.ID}>
                {p.Name} – ${p.Price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p><strong>Suma:</strong> ${totalPrice.toFixed(2)}</p>
          <button onClick={handleCheckout}>Kup i zapłać</button>
        </>
      ) : (
        <p>Koszyk jest pusty.</p>
      )}
    </div>
  );
}

export default CartPage;
