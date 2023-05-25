import { createContext, Dispatch, SetStateAction } from "react";
import { LocalStorageToken, User } from "./models";

type Auth = {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>> | undefined;
  accessToken: LocalStorageToken | undefined;
  setAccessToken: Dispatch<any> | undefined;
  refreshToken: LocalStorageToken | undefined;
  setRefreshToken: Dispatch<any> | undefined;
};

const authContextInitializer: Auth = {
  user: undefined,
  setUser: undefined,
  accessToken: undefined,
  setAccessToken: undefined,
  refreshToken: undefined,
  setRefreshToken: undefined,
};

export const AuthContext = createContext<any>(null);
