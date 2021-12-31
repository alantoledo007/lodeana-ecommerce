import ProductCard from "@components/ProductCard";
import { ENDPOINTS } from "@constants/endpoints";
import Link from "next/link";
import Head from "next/head";
import { useRef, useState } from "react";

export default function Index({ items }) {
  const [products, setProducts] = useState(items);
  return (
    <>
      <Head>
        <title>Lodeana - calazados y accesorios para tu celular</title>
        <meta
          name="description"
          content="Comprá calzados para chicos y adultos. Comprá periféricos y accesorios para tu celular. Y mucho más en Lodeana. Comprá por whatsapp"
        />
      </Head>
      <div className="w-full max-w-7xl px-10 mx-auto my-20">
        <h1 className="mb-5 text-3xl font-bold uppercase">
          Lodeana, catálogo online
        </h1>
        <p className="text-gray-500 text-2xl mb-5">
          Zapatillas, ojotas, sandalias, cables para celular, fundas,
          cargadores, luces leds y mucho más. Buscá lo que necesites y comprá
          por whatsapp.
        </p>

        <FormSearch setProducts={setProducts} defaultProducts={items} />
        {items.length === 0 && <small>No hay productos.</small>}
        {products.length === 0 && items.length > 0 && (
          <small>No hay resultados para la búsqueda.</small>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((item) => (
            <ProductCard client key={item._id} product={item} />
          ))}
        </div>
      </div>
    </>
  );
}

export const FormSearch = ({ setProducts, defaultProducts }) => {
  const [isLoadinig, setIsLoading] = useState(false);
  const inputRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoadinig) {
      return;
    }
    setIsLoading(true);
    fetch(`${ENDPOINTS.products}?search=${inputRef.current.value}`)
      .then((res) => res.json())
      .then((res) => {
        setProducts(res.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-row mb-5">
      <input
        ref={inputRef}
        name="title"
        placeholder="Buscar producto"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button
        className={`${
          isLoadinig && "opacity-25"
        } text-white ml-4 font-bold p-4 text-center rounded focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700`}
        type="submit"
      >
        Buscar
      </button>
    </form>
  );
};

export async function getServerSideProps({ query }) {
  // get the current environment
  let dev = process.env.NODE_ENV !== "production";
  let { DEV_URL, PROD_URL } = process.env;

  // request posts from api
  let response = await fetch(
    `${dev ? DEV_URL : PROD_URL}${ENDPOINTS.products}?search=${
      query.search || ""
    }`
  );
  // extract the data
  let data = await response.json();

  return {
    props: {
      items: data["message"],
    },
  };
}
