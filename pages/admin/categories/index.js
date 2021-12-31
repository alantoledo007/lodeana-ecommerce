import CategoryCard from "@components/CategoryCard";
import { ENDPOINTS } from "@constants/endpoints";

export default function Index({ items }) {
  return (
    <div>
      <h1>Categorías</h1>
      {items.length === 0 && <small>No hay categorías.</small>}
      <div>
        {items.map((item) => (
          <CategoryCard key={item._id} category={item} />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  // get the current environment
  let dev = process.env.NODE_ENV !== "production";
  let { DEV_URL, PROD_URL } = process.env;

  // request posts from api
  let response = await fetch(
    `${dev ? DEV_URL : PROD_URL}${ENDPOINTS.categories}?search=${
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
