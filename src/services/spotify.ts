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

  constructor(spotifyTokenParam: string | string[] | undefined) {
    this.redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI;
    this.clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    this.clientSecret = process.env.NEXT_PUBLIC_SECRET;
    this.spotifyTokenParam = spotifyTokenParam;
    this.refreshToken = null;
    this.accessToken = null;
  }

  authenticate = (): void => {
    window.open(
      `https://accounts.spotify.com/authorize?response_type=code&redirect_uri=${this.redirectURI}&client_id=${this.clientId}&scope=user-top-read`,
      "_self"
    );
  };

  getAccessToken = async () => {
    if (!this.accessToken) {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            new Buffer(this.clientId + ":" + this.clientSecret).toString(
              "base64"
            ),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code: `${this.spotifyTokenParam}`,
          redirect_uri: `${this.redirectURI}`,
          grant_type: "authorization_code",
          client_id: `${this.clientId}`,
        }),
      });
      let res = await response.json();
      console.log(res.error);
      this.accessToken = res.access_token;
      this.refreshToken = res.refresh_token;
      return this.accessToken;
    } else {
      console.log("already provided access token...");
    }
  };

  // refreshAccessToken = async () => {
  //   const response = await fetch("https://accounts.spotify.com/api/token", {
  //     method: "POST",
  //     headers: {
  //       Authorization:
  //         "Basic " +
  //         new Buffer(this.clientId + ":" + this.clientSecret).toString(
  //           "base64"
  //         ),
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({
  //       grant_type: "refresh_token",
  //       refresh_token: `${this.refreshToken}`,
  //     }),
  //   });
  //   let res = await response.json();
  //   this.accessToken = res.access_token;
  // };

  getTopArtists = async (): Promise<any> => {
    if (!this.accessToken) {
      this.getAccessToken();
      return;
    }
    console.log(this.accessToken);
    const res = await fetch(
      `https://api.spotify.com/v1/me/top/artists?offset=0&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      }
    );
    let data = await res.json();
    return { data: data.items };
  };
}
