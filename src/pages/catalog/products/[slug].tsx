import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { client } from '@/lib/prismic';
import PrismicDom from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

const AddToCartModal = dynamic(
  () => import('@/components/AddToCartModal'),
  { loading: () => <p>Loading...</p> }
);

interface ProductProps {
  product: Document;
}

export default function Product({ product }: ProductProps) {

  const router = useRouter();
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }

  if (router.isFallback) {
    return <p>Carregando...</p>
  }

  console.log(product);

  return (
    <div>
      <h1>
        {PrismicDom.RichText.asText(product.data.title)}
      </h1>

      <img src={product.data.thumbnail.url} width="200" alt={product.data.thumbnail.list.alt} />

      <div
        dangerouslySetInnerHTML={{ __html: PrismicDom.RichText.asHtml(product.data.description) }}
      >
      </div>

      <p>Price: ${product.data.price}</p>

      <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {

  const { slug } = context.params;

  const product = await client().getByUID('product', String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 10,
  }
}