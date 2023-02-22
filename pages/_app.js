import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
// import type { AppProps } from 'next/app'
// import { GetServerSideProps } from 'next/app'
import { useUserData } from "../lib/hooks";
import { UserContext } from "../lib/context";

export default function App({ Component, pageProps }) {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
