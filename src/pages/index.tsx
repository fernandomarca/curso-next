import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';
import api from '../services/api';
import SEO from '@/components/SEO';
import { Title } from '../styles/pages/Home';
import { client } from '@/lib/prismic';
import Prismic from 'prismic-javascript';
import PrismicDom from 'prismic-dom';

import { Document } from 'prismic-javascript/types/documents';

interface IProducts {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home({ recommendedProducts }: HomeProps) {

  async function sum() {
    const math = (await import('../lib/math')).default;

    alert(math.sum(3, 5));

  }

  return (
    <div>
      <SEO
        title="DevCommerce, your best e-commerce!"
        excludeTitleSuffix
        image="boost.png"
        shouldIndexPage={false}
      />

      <section>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(recommendedProduct => {
            return (
              <li key={recommendedProduct.id}>
                <Link href={`/catalog/products/${recommendedProduct.uid}`}>
                  <a>
                    {PrismicDom.RichText.asText(recommendedProduct.data.title)}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <button onClick={sum}>soma</button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  // const response = await api('/recommended');
  // const recommendedProducts = response.data;

  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ]);

  console.log(recommendedProducts);

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    }
  }
}
