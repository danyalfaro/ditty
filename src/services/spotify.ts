import {
  Artist,
  ChallengeCategory,
  ChallengeTimeRange,
  CHALLENGE_CATEGORY_SINGULAR_MAP,
  LocalStorageToken,
  SpotifyTokenResponse,
  TokenTypes,
  Track,
  User,
} from "@/shared/models";
import { tokenToTokenWrapper } from "@/shared/util";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export const REFRESH_TOKEN_BUFFER = 5 * 60 * 1000;

export default class Spotify {
  clientId: string | undefined;
  spotifyTokenParam: string | string[] | undefined;
  clientSecret: string | undefined;
  refreshToken: LocalStorageToken | null;
  accessToken: LocalStorageToken | null;
  tokenType: string;
  spotifyAPI: AxiosInstance;

  constructor({
    spotifyTokenParam,
    accessToken,
    refreshToken,
  }: {
    spotifyTokenParam?: string | string[];
    accessToken?: LocalStorageToken;
    refreshToken?: LocalStorageToken;
    expiresIn?: number;
  }) {
    // this.redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI;
    this.clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    this.clientSecret = process.env.NEXT_PUBLIC_SECRET;
    this.spotifyTokenParam = spotifyTokenParam;
    this.refreshToken =
      refreshToken || this.getTokenFromStorage(TokenTypes.REFRESH_TOKEN);
    this.accessToken =
      accessToken || this.getTokenFromStorage(TokenTypes.ACCESS_TOKEN);

    this.tokenType = "Bearer";

    this.spotifyAPI = axios.create({
      baseURL: "https://api.spotify.com/v1/",
      timeout: 10000,
      headers: {
        Authorization: `${this.tokenType} ${this.accessToken?.token}`,
      },
    });
    if (typeof window !== "undefined") {
      this.spotifyAPI.interceptors.request.use((config) => {
        if (this.accessToken?.dateStamp && this.accessToken?.expiresIn) {
          console.log(
            new Date(
              new Date(this.accessToken.dateStamp).getTime() +
                this.accessToken.expiresIn * 1000 -
                REFRESH_TOKEN_BUFFER
            ),
            new Date()
          );
          if (
            new Date(this.accessToken.dateStamp).getTime() +
              this.accessToken.expiresIn * 1000 -
              REFRESH_TOKEN_BUFFER <
            new Date().getTime()
          ) {
            this.refreshAccessToken();
          }
        }
        config.headers.Authorization = `${this.tokenType} ${this.accessToken?.token}`;
        return config;
      });
    }
  }

  async refreshAccessToken() {
    if (this.refreshToken) {
      console.log("REFRESHING ACCESS TOKEN!");
      const response: AxiosResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: this.refreshToken.token,
        }),
        {
          headers: {
            Authorization:
              "Basic " +
              new Buffer(this.clientId + ":" + this.clientSecret).toString(
                "base64"
              ),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      let res: SpotifyTokenResponse = await response.data;
      this.accessToken = tokenToTokenWrapper(res.access_token, res.expires_in);
    }
  }

  getTokenFromStorage(tokenType: TokenTypes) {
    if (typeof window !== "undefined") {
      const localStorageAccessToken = localStorage.getItem(tokenType);
      if (localStorageAccessToken) {
        const localStorageAccessTokenJSON: LocalStorageToken = JSON.parse(
          localStorageAccessToken
        );
        return localStorageAccessTokenJSON;
      }
    }

    return this.accessToken;
  }

  login = (redirectURI: string | undefined): void => {
    // TODO: Setup default redirect URI.
    if (redirectURI) {
      window.open(
        `https://accounts.spotify.com/authorize?response_type=code&redirect_uri=${redirectURI}&client_id=${this.clientId}&scope=user-top-read`,
        "_self"
      );
    }
  };

  getAccessToken = async (redirectURI: string | undefined) => {
    if (!this.accessToken && redirectURI) {
      try {
        const response: AxiosResponse = await axios.post(
          "https://accounts.spotify.com/api/token",
          new URLSearchParams({
            code: `${this.spotifyTokenParam}`,
            redirect_uri: `${redirectURI}`,
            grant_type: "authorization_code",
            client_id: `${this.clientId}`,
          }),
          {
            headers: {
              Authorization:
                "Basic " +
                new Buffer(this.clientId + ":" + this.clientSecret).toString(
                  "base64"
                ),
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        let res: SpotifyTokenResponse = await response.data;
        this.accessToken = tokenToTokenWrapper(
          res.access_token,
          res.expires_in
        );
        this.refreshToken = tokenToTokenWrapper(res.refresh_token);
        this.tokenType = res.token_type;
        this.spotifyAPI.interceptors.request.use((config) => {
          config.headers.Authorization = `${res.token_type} ${this.accessToken?.token}`;
          return config;
        });
      } catch (e) {
        const error = e as AxiosError;
        console.log(error.isAxiosError);
        // Need to handle this error
      }
    }

    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  };

  getUserProfile = async (): Promise<User> => {
    const res = await this.spotifyAPI.get(`me/`);
    return res.data;
  };

  getTopItems = async (
    category: ChallengeCategory,
    timeRange: ChallengeTimeRange
  ): Promise<Artist[] | Track[]> => {
    if (!this.accessToken) {
      const redirectURI: string | undefined =
        process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
      this.getAccessToken(redirectURI);
      return [];
    }
    const res = await this.spotifyAPI.get(
      `me/top/${category}?time_range=${timeRange}&offset=0&limit=10`
    );
    return res.data.items;
  };

  searchItems = async (query: string, category: ChallengeCategory) => {
    const type = CHALLENGE_CATEGORY_SINGULAR_MAP[category];

    if (!this.accessToken) {
      const redirectURI: string | undefined =
        process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
      this.getAccessToken(redirectURI);
      return [];
    }
    const res = await this.spotifyAPI.get(
      `https://api.spotify.com/v1/search?type=${type}&q=${query}`
    );
    return res.data[category].items;
  };
}
