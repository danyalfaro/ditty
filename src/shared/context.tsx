import { createContext, Dispatch, SetStateAction } from "react";
import { LocalStorageToken, User } from "./models";

type Auth = {
  user: User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  accessToken: LocalStorageToken | undefined;
  setAccessToken: Dispatch<SetStateAction<LocalStorageToken | undefined>>;
  refreshToken: LocalStorageToken | undefined;
  setRefreshToken: Dispatch<SetStateAction<LocalStorageToken | undefined>>;
};

export const AuthContext = createContext<any>(null);
