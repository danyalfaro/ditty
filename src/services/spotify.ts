export default class Spotify {
  redirectURI: string | undefined;
  clientId: string | undefined;

  constructor() {
    this.redirectURI = process.env.NEXT_PUBLIC_REDIRECT_URI;
    this.clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  }

  authenticate = () => {
    window.open(
      `https://accounts.spotify.com/authorize?response_type=code&redirect_uri=${this.redirectURI}&client_id=${this.clientId}`,
      "_self"
    );
  };

  getTopArtists = () => {};
}
