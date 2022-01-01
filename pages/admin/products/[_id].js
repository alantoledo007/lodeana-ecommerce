import { ADMIN_ENDPOINTS } from "@constants/endpoints";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { AddImage } from "@components/Gallery/index";
import Link from "next/link";

const IMAGES_STATE = {
  LOADING: 0,
};

const MAX_IMAGES = 5;

function Details({ item }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
  const [images, setImages] = useState(IMAGES_STATE.LOADING);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [published, setPublished] = useState(item.published);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const onUploadLoading = (status) => {
    setIsUploadLoading(status);
  };

  const onUploadImageSuccess = (img) => {
    setImages((prev) => {
      return [img, ...prev];
    });
  };

  const onImageToggle = (image, isActive) => {
    if (!isActive) {
      return setSelectedImages((prev) => {
        return prev.filter((item) => item._id !== image._id);
      });
    }
    return setSelectedImages((prev) => {
      return [...prev, image];
    });
  };

  useEffect(() => {
    fetch(`${ADMIN_ENDPOINTS.gallery}`)
      .then((res) => res.json())
      .then((res) => setImages(res.message));
  }, []);

  const onSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const images = selectedImages.map((i) => i.secure_url);
    await fetch(ADMIN_ENDPOINTS.products, {
      method: "PUT",
      body: JSON.stringify({
        _id: item._id,
        data: { title, description, price, published, images },
      }),
    })
      .then(() => {
        setIsSuccess(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const destroy = async () => {
    setIsLoading(true);
    await fetch(ADMIN_ENDPOINTS.products, {
      method: "DELETE",
      body: item._id,
    })
      .then(() => {
        setIsDeleted(true);
      })
      .finally(() => setIsLoading(false));
  };

  if (isSuccess) {
    return <Success />;
  }
  if (isDeleted) {
    return <Deleted />;
  }

  return (
    <div className="w-full max-w-xl px-10 mx-auto my-20">
      <div className="text-center my-20">
        <h1 className="text-4xl">Detalles del producto</h1>
        <p>Si quieres, puedes modificarlo</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="">
          <div>
            <div className="mt-5">
              <TogglePublished status={published} setStatus={setPublished} />
            </div>
            <div className="mt-5">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Titulo ¿Qué vas a vender?
              </label>
              <input
                name="title"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <p className="text-gray-400 text-xs mt-2">
                Tené en cuenta que cualquier persona tiene que saber lo que
                estás vendiendo con solo leer el título
              </p>
            </div>
            <div className="mt-5">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={description}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-gray-400 text-xs mt-2">
                Es importante mensionar cada detalle y característica, para que
                el cliente no necesite preguntarte algo relacionado con el
                producto.
              </p>
            </div>
            <div className="mt-5">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Precio ¿Cuanto sale?
              </label>
              <input
                name="price"
                value={price}
                type="number"
                step="any"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setPrice(parseFloat(e.target.value))}
              />
              <p className="text-gray-400 text-xs mt-2">
                Para los centavos usá un punto.{" "}
                <strong>Ejemplo: 1500.50</strong>, es decir, mil quinientos con
                cincuenta.
              </p>
            </div>
          </div>
          <div>
            <div className="mt-5">
              <span className="block text-gray-700 text-sm font-bold">
                Selecciona hasta {MAX_IMAGES} fotos
              </span>
            </div>
            <div className="p-4 bg-white shadow-lg rounded-md mb-5">
              {images === IMAGES_STATE.LOADING ? (
                <span>cargando...</span>
              ) : (
                <>
                  <span>
                    {selectedImages.length} de {MAX_IMAGES}
                  </span>
                  {images.length === 0 && <p>No tienes fotos.</p>}
                  <div className="mt-2 grid gap-4 grid-cols-2 md:grid-cols-3 overflow-y-auto max-h-96">
                    {images.map((image) => (
                      <ImageToggle
                        disabled={selectedImages.length >= MAX_IMAGES}
                        key={image._id}
                        image={image}
                        defaultImages={item.images}
                        onToggle={onImageToggle}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <span className="block text-gray-700 text-sm font-bold mb-2">
              ¿Necesitas añadir más fotos?
            </span>
            <AddImage
              onLoading={onUploadLoading}
              onUploadSuccess={onUploadImageSuccess}
            />
          </div>
        </div>
        <div className="mt-10">
          <button
            className={`text-white font-bold p-4 w-full text-center rounded focus:outline-none focus:shadow-outline ${
              !isUploadLoading && !isLoading
                ? "bg-blue-500 hover:bg-blue-700"
                : "bg-gray-400"
            }`}
            type="submit"
            disabled={isUploadLoading || isLoading}
          >
            {isLoading ? "guardando cambios..." : "Guardar cambios"}
          </button>
        </div>
        <div className="mt-5">
          <button
            className={`font-bold p-4 w-full text-center rounded focus:outline-none focus:shadow-outline ${
              !isUploadLoading && !isLoading
                ? "text-red-700 bg-red-50 hover:bg-red-100"
                : "text-gray-600 bg-gray-200"
            }`}
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  "Este producto se borrará definitivamente. ¿Estás de acuerdo?"
                )
              ) {
                destroy();
              }
            }}
            disabled={isUploadLoading || isLoading}
          >
            Borrar producto
          </button>
        </div>
      </form>
    </div>
  );
}

const ImageToggle = ({
  image,
  onToggle = () => {},
  disabled,
  defaultImages,
}) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    onToggle(image, isActive);
  }, [isActive]);

  useEffect(() => {
    if (defaultImages.find((i) => i == image.secure_url)) {
      setIsActive(true);
    }
  }, [image]);
  return (
    <button
      type="button"
      disabled={disabled && !isActive}
      onClick={() => setIsActive((prev) => !prev)}
      className={`rounded-md  focus:outline-none click:outline-none focus:shadow-outline transition-all duration-200 ${
        !isActive &&
        `border-transparent border-4 ${
          disabled ? " opacity-25 cursor-not-allowed" : "hover:border-blue-200"
        }`
      } ${isActive && "border-8 border-green-400"}`}
    >
      <img className="" key={image._id} src={image.secure_url} />
    </button>
  );
};

const Success = () => {
  return (
    <div className="w-full max-w-xl px-10 mx-auto my-20 text-center">
      <div className="mb-10">
        <h1 className="text-4xl mb-5">¡Producto moodificado correctamente!</h1>
      </div>
      <div>
        <Link href="/admin/products">
          <a
            className="mb-5 text-white font-bold p-4 w-full text-center rounded focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700"
            type="button"
          >
            Ver mis productos
          </a>
        </Link>
      </div>
    </div>
  );
};

const Deleted = () => {
  return (
    <div className="w-full max-w-xl px-10 mx-auto my-20 text-center">
      <div className="mb-10">
        <h1 className="text-4xl mb-5">El producto se borró correctamente</h1>
      </div>
      <div>
        <Link href="/admin/products">
          <a
            className="mb-5 text-white font-bold p-4 w-full text-center rounded focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700"
            type="button"
          >
            Ir a mis productos
          </a>
        </Link>
      </div>
    </div>
  );
};

export const TogglePublished = ({ status, setStatus }) => {
  const toggle = () => {
    setStatus(!status);
  };

  return (
    <div className="w-full grid grid-cols-2 gap-4 p-2 rounded-lg bg-gray-200">
      <button
        type="button"
        onClick={toggle}
        className={`${
          status && "text-white bg-blue-400"
        }  font-bold p-4 w-full text-center rounded focus:outline-none focus:shadow-outline`}
      >
        Publicado
      </button>
      <button
        type="button"
        onClick={toggle}
        className={`${
          !status && "text-white bg-red-400"
        }  font-bold p-4 w-full text-center rounded focus:outline-none focus:shadow-outline`}
      >
        No publicado
      </button>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  // get the current environment
  let dev = process.env.NODE_ENV !== "production";
  let { DEV_URL, PROD_URL } = process.env;

  // request posts from api
  let response = await fetch(
    `${dev ? DEV_URL : PROD_URL}${ADMIN_ENDPOINTS.products}?_id=${query._id}`
  );
  // extract the data
  let data = await response.json();
  return {
    props: {
      item: data["message"],
    },
  };
}

export default withPageAuthRequired(Details);
