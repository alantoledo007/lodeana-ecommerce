import ProductCard from "@components/ProductCard";
import { ADMIN_ENDPOINTS } from "@constants/endpoints";
import Link from "next/link";
import { useRef, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

function Index({ items }) {
  const [products, setProducts] = useState(items);
  return (
    <div className="w-full max-w-7xl px-10 mx-auto my-20">
      <div className="mb-10">
        <Link href="/admin">
          <a
            className={`text-blue-700 font-bold p-4 text-center rounded focus:outline-none focus:shadow-outline bg-blue-50 hover:bg-blue-100`}
            type="submit"
          >
            Volver al panel
          </a>
        </Link>
      </div>
      <h1 className="mb-5 text-3xl font-bold uppercase">Productos</h1>
      <FormSearch setProducts={setProducts} defaultProducts={items} />
      {items.length === 0 && <small>No hay productos.</small>}
      {products.length === 0 && items.length > 0 && (
        <small>No hay resultados para la búsqueda.</small>
      )}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </div>
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
    fetch(`${ADMIN_ENDPOINTS.products}?search=${inputRef.current.value}`)
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
        placeholder="Buscar por nombre o descripción"
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
    `${dev ? DEV_URL : PROD_URL}${ADMIN_ENDPOINTS.products}?search=${
      query.search || ""
    }`
  );
  // extract the data
  let data = await response.json();

  console.log("DATA::", data);

  return {
    props: {
      items: data["message"],
    },
  };
}

export default withPageAuthRequired(Index);
