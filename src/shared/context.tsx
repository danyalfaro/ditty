import { createContext, Dispatch, SetStateAction } from "react";
import {
  ChallengeCategory,
  ChallengePayload,
  LocalStorageToken,
  User,
} from "./models";

// type Auth = {
//   user: User | undefined;
//   setUser: Dispatch<SetStateAction<User | undefined>>;
//   accessToken: LocalStorageToken | undefined;
//   setAccessToken: Dispatch<SetStateAction<LocalStorageToken | undefined>>;
//   refreshToken: LocalStorageToken | undefined;
//   setRefreshToken: Dispatch<SetStateAction<LocalStorageToken | undefined>>;
// };

type Challenge = {
  challengePayload: ChallengePayload;
  setChallengePayload: Dispatch<SetStateAction<ChallengePayload>>;
  onGiveUp: () => void;
  setModalIsOpen: Dispatch<SetStateAction<boolean>>;
};

// TODO - Improve typing of contexts
export const AuthContext = createContext<any>(null);
export const ChallengeContext = createContext<Challenge>({
  challengePayload: {
    challenger: "",
    challengeCategory: ChallengeCategory.UNDEFINED,
    items: [],
  },
  setChallengePayload: () => {},
  onGiveUp: () => {},
  setModalIsOpen: () => {},
});
