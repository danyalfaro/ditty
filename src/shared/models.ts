export type Data = {
  name: string;
};

enum ResponseObjectType {
  ARTIST = "artist",
  SONG = "song",
}

export type Artist = {
  external_urls: { [key: string]: string };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: [
    {
      url: string;
      height: number;
      width: number;
    }
  ];
  name: string;
  popularity: number;
  type: ResponseObjectType.ARTIST;
  uri: string;
};

export type TopArtistResponse = Artist[];

export type ChallengePayload = {
  challenger: string;
  topArtists: string[];
};

export type LocalStorageToken = {
  dateStamp: string; //ISO String,
  token: string;
};

export type User = {
  display_name: string;
  // external_urls: { spotify: string };
  // followers: { href: null; total: number };
  // href: string;
  id: string;
  images: string[];
  type: string; // 'user'
  uri: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};