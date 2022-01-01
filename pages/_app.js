import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      <div className="my-12 text-center">
        <p className="text-gray-400">
          Creador por{" "}
          <a
            className="text-inherit hover:text-green-500"
            href="https://mvp-skeleton.com.ar"
          >
            <strong>MVP Skeleton</strong>
          </a>
        </p>
      </div>
    </UserProvider>
  );
}

export default MyApp;
