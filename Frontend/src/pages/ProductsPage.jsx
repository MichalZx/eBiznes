import React, { useEffect, useState } from 'react';
import { useCart } from '../context/ShopContext';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const { cartId, setCartId } = useCart();

  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Błąd pobierania produktów:', err));
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      let currentCartId = cartId;

      if (!currentCartId) {
        const res = await fetch('http://localhost:8080/carts', { method: 'POST' });
        const data = await res.json();
        currentCartId = data.ID;
        setCartId(currentCartId);
        setMessage(`Utworzono koszyk ID: ${currentCartId}`);
      }

      const res = await fetch(`http://localhost:8080/carts/${currentCartId}/products/${productId}`, {
        method: 'POST',
      });

      if (res.ok) {
        setMessage('Dodano do koszyka');
      } else {
        setMessage('Nie udało się dodać');
      }
    } catch (err) {
      setMessage('Błąd dodawania do koszyka');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Produkty</h1>
      {message && <p>{message}</p>}
      <ul>
        {products.map(p => (
          <li key={p.ID}>
            {p.Name} – ${p.Price.toFixed(2)}
            <button onClick={() => handleAddToCart(p.ID)} style={{ marginLeft: '1rem' }}>Dodaj do koszyka</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsPage;
