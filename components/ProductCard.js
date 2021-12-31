import { ENDPOINTS } from "@constants/endpoints";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProductCard({ product, client }) {
  const router = useRouter();

  const publishHandler = async () => {
    await fetch(ENDPOINTS.products, {
      method: "PUT",
      body: JSON.stringify({
        _id: product._id,
        data: {
          published: !product.published,
        },
      }),
    });

    router.push(router.asPath);
  };
  const destroy = async () => {
    await fetch(ENDPOINTS.products, {
      method: "DELETE",
      body: product._id,
    });

    router.push(router.asPath);
  };

  const prefix = client ? "" : "/admin/products";

  return (
    <Link href={`${prefix}/${product._id}`}>
      <a className="p-4 shadow-md hover:shadow-xl rounded-xl">
        <img className="w-full mb-5 rounded-xl" src={product.images[0]} />
        <span className="font-bold p-2 rounded-xl text-blue-700 bg-blue-100">
          ${product.price}
        </span>
        {!product.published && (
          <span className="ml-2 font-bold p-2 rounded-xl text-red-700 bg-red-100">
            No publicado
          </span>
        )}
        <h4 className="text-xl mt-2">{product.title}</h4>
      </a>
    </Link>
  );
}
