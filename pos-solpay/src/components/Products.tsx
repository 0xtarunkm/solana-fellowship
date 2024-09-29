'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Product from './Product';

const prices = [0.2, 0.3, 0.4, 1];

export default function Products() {
  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get('https://fakestoreapi.com/products?limit=5');
      setProducts(res.data);
    };

    getProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {
        // @ts-ignore
        products.map((product, index) => {
          const price = prices[index % prices.length];

          return (
            <Product
              title={product.title}
              image={product.image}
              price={price}
              key={product.id}
            />
          );
        })
      }
    </div>
  );
}
