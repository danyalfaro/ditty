import axios, { AxiosError, AxiosInstance } from "axios";

export default class Spotify {
  // redirectURI: string | undefined;
  clientId: string | undefined;
  spotifyTokenParam: string | string[] | undefined;
  clientSecret: string | undefined;
  refreshToken: string | null;
  accessToken: string | null;
  spotifyAPI: AxiosInstance;

  constructor(spotifyTokenParam: string | string[] | undefined) {
    // this.redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI;
    this.clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    this.clientSecret = process.env.NEXT_PUBLIC_SECRET;
    this.spotifyTokenParam = spotifyTokenParam;
    this.refreshToken = null;
    this.accessToken = null;

    this.spotifyAPI = axios.create({
      baseURL: "https://api.spotify.com/v1/",
      timeout: 10000,
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
  }

  authenticate = (redirectURI: string | undefined): void => {
    // TODO: Setup default redirect URI.
    if (redirectURI) {
      window.open(
        `https://accounts.spotify.com/authorize?response_type=code&redirect_uri=${redirectURI}&client_id=${this.clientId}&scope=user-top-read`,
        "_self"
      );
    }
  };

  storeToken = (label: string, value: string) => {
    localStorage.setItem(label, value);
  };

  getAccessToken = async (redirectURI: string | undefined) => {
    console.log("ACCESS TOKEN FROM getAccessToken()", this.accessToken);
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
        // this.storeToken("accessToken", res.access_token);
        // this.storeToken("refreshToken", res.refresh_token);
        this.accessToken = res.access_token;
        this.refreshToken = res.refresh_token;
        this.spotifyAPI.interceptors.request.use((config) => {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
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
    return this.accessToken;
  };

  getTopArtists = async (): Promise<any> => {
    if (!this.accessToken) {
      const redirectURI: string | undefined =
        process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
      this.getAccessToken(redirectURI);
      return;
    }
    const res = await this.spotifyAPI.get(`me/top/artists?offset=0&limit=10`);
    return res.data.items;
  };

  searchArtists = async (query: string) => {
    const res = await this.spotifyAPI.get(
      `https://api.spotify.com/v1/search?type=artist&q=${query}`
    );
    return res.data;
  };
}
