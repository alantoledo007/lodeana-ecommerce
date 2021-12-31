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
    </UserProvider>
  );
}

export default MyApp;
