import { ADMIN_ENDPOINTS, ENDPOINTS } from "@constants/endpoints";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { AddImage } from "@components/Gallery/index";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Este campo es requerido")
    .min(10, "Se requieren como mínimo ${min} caracteres")
    .max(67, "Se admiten hasta ${max} caracteres"),
  price: yup.string().required("Este campo es requerido"),
});

const IMAGES_STATE = {
  LOADING: 0,
};

const MAX_IMAGES = 5;

function Add() {
  const [images, setImages] = useState(IMAGES_STATE.LOADING);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

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
    fetch(`${ENDPOINTS.gallery}`)
      .then((res) => res.json())
      .then((res) => setImages(res.message));
  }, []);

  const onSubmit = (data) => {
    const images = selectedImages.map((i) => i.secure_url);
    if (images.length < 1) {
      return alert("Por favor, selecciona una foto como mínimo.");
    }
    setIsLoading(true);
    return fetch(ADMIN_ENDPOINTS.products, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        published: true,
        images,
      }),
    })
      .then(() => {
        reset();
        setIsSuccess(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isSuccess) {
    return <Success setIsSuccess={setIsSuccess} />;
  }

  return (
    <div className="w-full max-w-xl px-10 mx-auto my-20">
      <div className="text-center my-20">
        <h1 className="text-4xl">Publicar producto</h1>
        <p>Complete el formulario</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="">
          <div>
            <div className="mt-5">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Titulo ¿Qué vas a vender?
              </label>
              <input
                name="title"
                id="title"
                className={`shadow appearance-none border ${
                  errors?.title?.message && "border-red-400"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                {...register("title")}
              />
              {errors?.title?.message && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.title.message}
                </p>
              )}
              <p className="text-gray-400 text-xs mt-2">
                Tené en cuenta que cualquier persona tiene que saber lo que
                estás vendiendo con solo leer el título
              </p>
            </div>
            <div className="mt-5">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Descripción
              </label>
              <textarea
                name="description"
                id="description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("description")}
              />
              <p className="text-gray-400 text-xs mt-2">
                Es importante mensionar cada detalle y característica, para que
                el cliente no necesite preguntarte algo relacionado con el
                producto.
              </p>
            </div>
            <div className="mt-5">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Precio ¿Cuanto sale?
              </label>
              <input
                name="price"
                type="number"
                step="any"
                id="price"
                className={`shadow appearance-none border ${
                  errors?.title?.message && "border-red-400"
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                {...register("price")}
              />
              {errors?.price?.message && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.price.message}
                </p>
              )}
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
                : "bg-gray-500"
            }`}
            type="submit"
            disabled={isUploadLoading || isLoading}
          >
            {isLoading ? "publicando producto..." : "Publicar producto"}
          </button>
        </div>
      </form>
    </div>
  );
}

const ImageToggle = ({ image, onToggle = () => {}, disabled }) => {
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    onToggle(image, isActive);
  }, [isActive]);
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

const Success = ({ setIsSuccess }) => {
  return (
    <div className="w-full max-w-xl px-10 mx-auto my-20 text-center">
      <div className="mb-10">
        <h1 className="text-4xl mb-5">¡Producto publicado correctamente!</h1>
        <p>¿Qué hacemos ahora?</p>
      </div>
      <div>
        <button
          className="mb-5 text-white font-bold p-4 w-full text-center rounded focus:outline-none focus:shadow-outline bg-blue-500 hover:bg-blue-700"
          type="button"
          onClick={() => setIsSuccess(false)}
        >
          Publicar otro producto
        </button>

        <Link href="/admin/products">
          <a
            className="text-blue-400 font-bold p-4 w-full text-center rounded focus:outline-none focus:shadow-outline hover:bg-blue-50"
            type="button"
          >
            Ver mis productos
          </a>
        </Link>
      </div>
    </div>
  );
};

export default withPageAuthRequired(Add);
