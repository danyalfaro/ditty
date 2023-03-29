import axios, { AxiosInstance } from "axios";

enum SpotifyErrors {
  "invalid_grant",
}

export default class Spotify {
  redirectURI: string | undefined;
  clientId: string | undefined;
  spotifyTokenParam: string | string[] | undefined;
  clientSecret: string | undefined;
  refreshToken: string | null;
  accessToken: string | null;
  spotifyAPI: AxiosInstance;

  constructor(spotifyTokenParam: string | string[] | undefined) {
    this.redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI;
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

    this.spotifyAPI.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config;
        console.log(error);

        // if (error.response.status === 401 && !originalRequest._retry) {
        //   originalRequest._retry = true;
        //   return this.refreshAccessToken().then(() => {
        //     originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
        //     return axios(originalRequest);
        //   });
        // }

        return Promise.reject(error);
      }
    );
  }

  authenticate = (): void => {
    window.open(
      `https://accounts.spotify.com/authorize?response_type=code&redirect_uri=${this.redirectURI}&client_id=${this.clientId}&scope=user-top-read`,
      "_self"
    );
  };

  storeToken = (label: string, value: string) => {
    localStorage.setItem(label, value);
  };

  getAccessToken = async () => {
    if (!this.accessToken) {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          code: `${this.spotifyTokenParam}`,
          redirect_uri: `${this.redirectURI}`,
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
      this.storeToken("accessToken", res.access_token);
      this.storeToken("refreshToken", res.refresh_token);
      this.accessToken = res.access_token;
      this.refreshToken = res.refresh_token;
      this.spotifyAPI.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
        return config;
      });
    }
    return this.accessToken;
  };

  private refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: `${this.refreshToken}`,
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
      this.accessToken = response.data.access_token;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  getTopArtists = async (): Promise<any> => {
    if (!this.accessToken) {
      this.getAccessToken();
      return;
    }
    const res = await this.spotifyAPI.get(`me/top/artists?offset=0&limit=10`);
    let data = res.data;
    return { data: data.items };
  };
}
