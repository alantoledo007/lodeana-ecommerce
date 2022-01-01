import { ENDPOINTS } from "@constants/endpoints";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { FacebookShareButton, WhatsappShareButton } from "react-share";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { basePath } from "@constants/index";

function Details({ item }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{item.title} - Lodeana</title>
        <meta name="description" content={`Comprá ${item.title} en Lodeana`} />
        <meta property="og:image" content={item.images[0]} />
      </Head>
      <div className="w-full max-w-5xl px-10 mx-auto my-20">
        <Link href="/">
          <a
            className={`text-blue-700 font-bold p-4 text-center rounded focus:outline-none focus:shadow-outline bg-blue-50 hover:bg-blue-100`}
            type="submit"
          >
            Volver al catálogo
          </a>
        </Link>
        <div className="mt-20 mb-40">
          <h1 className="text-4xl mb-5">{item.title}</h1>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <ImgCarousel images={item.images} />
            <div>
              <div className="mb-5 text-center">
                <a
                  href={`https://wa.me/5491157277784?text=Hola que tal! Me interesa el producto *${item.title}* https://lodeana.com.ar${router.asPath}`}
                  target="_blank"
                  className="bg-green-200 block text-green-700 font-bold uppercase p-4 w-full rounded  hover:bg-green-300 focus:outline-none focus:shadow-outline"
                >
                  Comprar por whatsapp
                </a>
              </div>

              <div className="mt-5 mb-10">
                <h5 className="text-gray-400 mb-3">Compartir</h5>
                <FacebookShareButton url={`${basePath}${router.asPath}`}>
                  <span className="font-bold text-sm p-3 text-blue-700 bg-blue-200 rounded-lg opacity-50 hover:opacity-100">
                    Facebook
                  </span>
                </FacebookShareButton>
                <WhatsappShareButton url={`${basePath}${router.asPath}`}>
                  <span className="font-bold text-sm p-3 text-green-700 ml-2 bg-green-200 rounded-lg opacity-50 hover:opacity-100">
                    Whatsapp
                  </span>
                </WhatsappShareButton>
              </div>
              <div className="shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d821.0438969527802!2d-58.66011177073923!3d-34.59972119486295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcbec652d3036b%3A0x6f7f25c01e79768f!2sPaderewski%203528%2C%20William%20C.%20Morris%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1640970899715!5m2!1ses!2sar"
                  width="100%"
                  height="300"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h2 className="text-2xl mb-2">Descripción</h2>
            <p>{item.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

const ImgCarousel = ({ images }) => {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <img src={images[selected]} className="w-full rounded shadow-md" />
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mt-2">
        {images.map((img, index) => (
          <button
            className="focus:outline-none focus:shadow-outline"
            key={index}
            onClick={() => setSelected(index)}
          >
            <img
              src={img}
              className={`rounded border-4 ${
                selected === index
                  ? "border-blue-500"
                  : "border-transparent opacity-30 hover:opacity-100"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps({ query }) {
  // get the current environment
  let dev = process.env.NODE_ENV !== "production";
  let { DEV_URL, PROD_URL } = process.env;

  // request posts from api
  let response = await fetch(
    `${dev ? DEV_URL : PROD_URL}${ENDPOINTS.products}?_id=${query._id || ""}`
  );
  // extract the data
  let data = await response.json();
  return {
    props: {
      item: data["message"],
    },
  };
}

export default Details;
