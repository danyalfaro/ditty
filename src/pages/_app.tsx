import {
  ChallengeCategory,
  ChallengePayload,
  LocalStorageToken,
  User,
} from "@/shared/models";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { AuthContext } from "../shared/context";

export default function App({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User>();
  const [accessToken, setAccessToken] = useState<LocalStorageToken>();
  const [refreshToken, setRefreshToken] = useState<LocalStorageToken>();

  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          setUser,
          accessToken,
          setAccessToken,
          refreshToken,
          setRefreshToken,
        }}
      >
        <Component {...pageProps} />
      </AuthContext.Provider>
    </>
  );
}
