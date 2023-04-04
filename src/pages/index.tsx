import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spotify from "@/services/spotify";
import { ChallengePayload, TopArtistResponse } from "@/shared/models";
import { decodeChallengeToken, encodeChallengeToken } from "@/shared/util";

const spotifyResponseToChallengePayload = (
  response: TopArtistResponse
): ChallengePayload => {
  const challengePayload: ChallengePayload = {
    challenger: "Daniel Alfaro",
    topArtists: response.map((artist) => artist.id),
  };
  return challengePayload;
};

export default function Home() {
  const [challengeTokenLocal, setChallengeTokenLocal] = useState("");
  const [challengePayload, setChallengePayload] = useState({});
  const router = useRouter();
  const { code: spotifyTokenParam, challengeToken: challengeTokenParam } =
    router.query;
  const spotify = new Spotify(spotifyTokenParam);

  const clearToken = (token: string | string[]) => {
    localStorage.removeItem("challengeToken");
  };

  const checkChallengeTokenLocal = (): Boolean => {
    const challengeToken = localStorage.getItem("challengeToken");
    if (challengeToken) {
      setChallengeTokenLocal(challengeToken);
      return true;
    }
    return false;
  };

  const startChallenge = async () => {
    if (challengeTokenLocal) {
      const challengePayload = decodeChallengeToken(challengeTokenLocal);
      setChallengePayload(challengePayload);
      console.log(challengePayload);
    }
  };

  const createNewGame = async () => {
    console.log("creating new game...");
    const redirectURI: string | undefined =
      process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
    await spotify.getAccessToken(redirectURI);
  };

  const onSpotifyLogin = () => {
    const redirectURI: string | undefined =
      process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
    spotify.login(redirectURI);
  };

  return (
    <>
      <Head>
        <title>Spotify Ranks</title>
        <meta name="description" content="Guess the top." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.grid}>
          {!spotifyTokenParam && !challengeTokenParam ? (
            <>
              <h2>Welcome!</h2>
              <button className={styles.card} onClick={onSpotifyLogin}>
                Create Game This One
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </main>
    </>
  );
}
