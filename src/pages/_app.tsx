import { User } from "@/shared/models";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { UserContext } from "../shared/context";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User>();

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  );
}
