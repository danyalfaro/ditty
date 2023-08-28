import { AuthContext } from "@/shared/context";
import {
  Artist,
  ChallengeCategory,
  ChallengeTimeRange,
  CHALLENGE_CATEGORY_SINGULAR_MAP,
  LocalStorageToken,
  SpotifyTokenResponse,
  Track,
  User,
} from "@/shared/models";
import { tokenToTokenWrapper } from "@/shared/util";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useContext } from "react";

const REFRESH_TOKEN_BUFFER = 5 * 60 * 1000;
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SECRET;

export const login = (redirectURI: string | undefined): void => {
  // TODO: Setup default redirect URI.
  if (redirectURI) {
    window.open(
      `https://accounts.spotify.com/authorize?response_type=code&redirect_uri=${redirectURI}&client_id=${clientId}&scope=user-top-read`,
      "_self"
    );
  }
};

export const getUserFromLoginCode = async (loginCode: string) => {
  const redirectURI = process.env.NEXT_PUBLIC_REDIRECT_TO_CHALLENGE_URI;
  try {
    const tokensResponse: AxiosResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        code: `${loginCode}`,
        redirect_uri: `${redirectURI}`,
        grant_type: "authorization_code",
        client_id: `${clientId}`,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            new Buffer(clientId + ":" + clientSecret).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    let tokens: SpotifyTokenResponse = await tokensResponse.data;
    const accessToken = tokenToTokenWrapper(
      tokens.access_token,
      tokens.expires_in
    );
    const refreshToken = tokenToTokenWrapper(tokens.refresh_token);

    if (!accessToken) return;

    const userDataResponse: AxiosResponse = await axios.get(
      "https://api.spotify.com/v1/me",
      {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${accessToken?.token}`,
        },
      }
    );

    const user: User = userDataResponse.data;

    return {
      accessToken,
      refreshToken,
      user,
    };
  } catch (e) {
    const error = e as AxiosError;
    console.log(error.isAxiosError);
    // Need to handle this error
  }
};

const useSpotify = () => {
  const {
    setUser,
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
  } = useContext(AuthContext);

  //   let accessToken: LocalStorageToken | undefined;
  //   let refreshToken: LocalStorageToken | undefined;
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SECRET;

  const isTokenExpired = (token: LocalStorageToken): boolean => {
    if (!token.expiresIn) return false;
    return (
      new Date(token.dateStamp).getTime() +
        token.expiresIn * 1000 -
        REFRESH_TOKEN_BUFFER <
      new Date().getTime()
    );
  };

  const spotify = axios.create({
    baseURL: "https://api.spotify.com/v1/",
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${accessToken?.token}`,
    },
  });

  if (typeof window !== "undefined") {
    spotify.interceptors.request.use(async (req) => {
      if (accessToken && !isTokenExpired(accessToken)) return req;
      if (refreshToken) {
        const response: AxiosResponse = await axios.post(
          "https://accounts.spotify.com/api/token",
          new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: (refreshToken as LocalStorageToken).token,
          }),
          {
            headers: {
              Authorization:
                "Basic " +
                new Buffer(clientId + ":" + clientSecret).toString("base64"),
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        let res: SpotifyTokenResponse = await response.data;
        setAccessToken(tokenToTokenWrapper(res.access_token, res.expires_in));
      }
      req.headers.Authorization = `Bearer ${accessToken?.token}`;
      return req;
    });
  }

  const getUserProfile = async (): Promise<User> => {
    const res = await spotify.get(`me/`);
    return res.data;
  };

  const getTopItems = async (
    category: ChallengeCategory,
    timeRange: ChallengeTimeRange
  ): Promise<Artist[] | Track[]> => {
    const res = await spotify.get(
      `me/top/${category}?time_range=${timeRange}&offset=0&limit=10`
    );
    return res.data.items;
  };

  const getTopItemsByIds = async (
    category: ChallengeCategory,
    ids: string[]
  ): Promise<Artist[] | Track[]> => {
    const res = await spotify.get(`https://api.spotify.com/v1/${category}`, {
      params: { ids: ids.join(",") },
    });
    return res.data.items;
  };

  const searchItems = async (query: string, category: ChallengeCategory) => {
    const type = CHALLENGE_CATEGORY_SINGULAR_MAP[category];
    const res = await spotify.get(
      `https://api.spotify.com/v1/search?type=${type}&q=${query}`
    );
    return res.data[category].items;
  };

  return { getUserProfile, getTopItems, searchItems, getTopItemsByIds };
};

export default useSpotify;
