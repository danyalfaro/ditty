enum ResponseObjectType {
  ARTIST = "artist",
  SONG = "song",
}

type ImageObject = {
  url: string;
  height: number;
  width: number;
};

export type Artist = {
  external_urls: { [key: string]: string };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  popularity: number;
  type: ResponseObjectType.ARTIST;
  uri: string;
};

enum AlbumType {
  ALBUM = "album",
  SINGLE = "single",
  COMPILATION = "compilation",
}

type Album = {
  album_type: AlbumType;
  total_tracks: number;
  available_markets: string[];
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: "album";
  uri: string;
  artists: Artist[];
};

export type Track = {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: { [key: string]: string };
  external_urls: { [key: string]: string };
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
};

export type TopItemsResponse = Artist[] | Track[];

export type ChallengePayload = {
  challenger: string;
  challengeCategory: ChallengeCategory;
  items: string[];
};

export enum ChallengeCategory {
  ARTISTS = "artists",
  SONGS = "tracks",
}

export const CHALLENGE_CATEGORY_SINGULAR_MAP: {
  [key in ChallengeCategory]: string;
} = {
  [ChallengeCategory.ARTISTS]: "artist",
  [ChallengeCategory.SONGS]: "track",
};

export enum ChallengeCategoryToSearchTypeMap {}

export enum ChallengeTimeRange {
  RECENT = "short_term",
  ALL_TIME = "long_term",
}

export type BoardTile = {
  data: Artist | Track | null;
  id: string;
  tries: number;
  success: boolean;
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
