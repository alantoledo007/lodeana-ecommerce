import { ENDPOINTS } from "@constants/endpoints";
import { useRouter } from "node_modules/next/router";

export default function CategoryCard({ category }) {
  const router = useRouter();

  const enable = async () => {
    await fetch(ENDPOINTS.categories, {
      method: "PUT",
      body: JSON.stringify({
        _id: category._id,
        data: {
          enable: !category.enable,
        },
      }),
    });

    router.push(router.asPath);
  };
  const destroy = async () => {
    await fetch(ENDPOINTS.categories, {
      method: "DELETE",
      body: category._id,
    });

    router.push(router.asPath);
  };

  return (
    <div>
      <div>{category.name}</div>
      <div>
        <button role="button" onClick={enable}>
          {category.enable ? "Deshabilitar" : "Habilitar"}
        </button>
      </div>
      <div>
        <button role="button" onClick={destroy}>
          Borrar
        </button>
      </div>
    </div>
  );
}
