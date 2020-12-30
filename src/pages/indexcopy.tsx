import { useEffect, useState } from 'react';
import api from '../services/api';
import { Title } from '../styles/pages/Home';

interface IProducts {
  id: string;
  title: string;
}

export default function Home() {

  const [recommendedProducts, setRecommendedProducts] = useState<IProducts[]>([]);

  useEffect(() => {
    async function loadRecommendedProducts() {
      const response = await api.get('/recommended');
      setRecommendedProducts(response.data);
    }
    loadRecommendedProducts();
  }, []);

  return (
    <div>
      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                {recommendedProduct.title}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
