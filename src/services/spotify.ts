import {
  Artist,
  ChallengeCategory,
  ChallengeTimeRange,
  CHALLENGE_CATEGORY_SINGULAR_MAP,
  LocalStorageToken,
  Track,
  User,
} from "@/shared/models";
import axios, { AxiosError, AxiosInstance } from "axios";

export default class Spotify {
  // redirectURI: string | undefined;
  clientId: string | undefined;
  spotifyTokenParam: string | string[] | undefined;
  clientSecret: string | undefined;
  refreshToken: string | null;
  accessToken: string | null;
  tokenType: string;
  expiresIn: number;
  lastTokenRefreshDate: Date | null;
  spotifyAPI: AxiosInstance;

  constructor(spotifyTokenParam?: string | string[] | undefined) {
    // this.redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI;
    this.clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    this.clientSecret = process.env.NEXT_PUBLIC_SECRET;
    this.spotifyTokenParam = spotifyTokenParam;
    this.refreshToken = null;
    this.accessToken = null;
    this.tokenType = "Bearer";
    this.expiresIn = 0;
    this.lastTokenRefreshDate = null;

    this.spotifyAPI = axios.create({
      baseURL: "https://api.spotify.com/v1/",
      timeout: 10000,
      headers: { Authorization: `${this.tokenType} ${this.accessToken}` },
    });
  }

  getAccessTokenFromStorage() {
    const localStorageAccessToken = localStorage.getItem("accessToken");
    if (localStorageAccessToken) {
      const localStorageAccessTokenJSON: LocalStorageToken = JSON.parse(
        localStorageAccessToken
      );
      return localStorageAccessTokenJSON.token;
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
        const response = await axios.post(
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
        let res = await response.data;
        this.accessToken = res.access_token;
        this.refreshToken = res.refresh_token;
        this.tokenType = res.token_type;
        this.spotifyAPI.interceptors.request.use((config) => {
          config.headers.Authorization = `${res.token_type} ${this.accessToken}`;
          return config;
        });
      } catch (e) {
        const error = e as AxiosError;
        console.log(error.isAxiosError);
        // Need to handle this error
      }

      // TODO: REfresh access token when expired.

      // this.spotifyAPI.interceptors.response.use(async (res) => {
      //   console.log(res);
      //   const isExpired = res?.data?.error?.status === 401;
      //   console.log(isExpired);

      //   if (!isExpired) return res;

      //   const response = await axios.post(
      //     "https://accounts.spotify.com/api/token",
      //     new URLSearchParams({
      //       grant_type: "refresh_token",
      //       refresh_token: `${this.refreshToken}`,
      //     }),
      //     {
      //       headers: {
      //         Authorization:
      //           "Basic " +
      //           new Buffer(this.clientId + ":" + this.clientSecret).toString(
      //             "base64"
      //           ),
      //         "Content-Type": "application/x-www-form-urlencoded",
      //       },
      //     }
      //   );
      //   this.accessToken = response.data.access_token;
      //   return res;
      // });
    }
    return [this.accessToken, this.refreshToken];
  };

  getUserProfile = async (): Promise<User> => {
    const res = await this.spotifyAPI.get(`me/`);
    return res.data;
  };

  getTopItems = async (
    category: ChallengeCategory,
    timeRange: ChallengeTimeRange
  ): Promise<Artist[] | Track[]> => {
    let accessToken = this.getAccessTokenFromStorage();
    if (!accessToken) {
      const redirectURI: string | undefined =
        process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
      this.getAccessToken(redirectURI);
      return [];
    }
    this.spotifyAPI.interceptors.request.use((config) => {
      config.headers.Authorization = `${this.tokenType} ${accessToken}`;
      return config;
    });
    const res = await this.spotifyAPI.get(
      `me/top/${category}?time_range=${timeRange}&offset=0&limit=10`
    );
    return res.data.items;
  };

  searchItems = async (query: string, category: ChallengeCategory) => {
    let accessToken = this.getAccessTokenFromStorage();
    const type = CHALLENGE_CATEGORY_SINGULAR_MAP[category];

    if (!accessToken) {
      const redirectURI: string | undefined =
        process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
      this.getAccessToken(redirectURI);
      return [];
    }
    this.spotifyAPI.interceptors.request.use((config) => {
      config.headers.Authorization = `${this.tokenType} ${accessToken}`;
      return config;
    });
    const res = await this.spotifyAPI.get(
      `https://api.spotify.com/v1/search?type=${type}&q=${query}`
    );
    return res.data[category].items;
  };
}
