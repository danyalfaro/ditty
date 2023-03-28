import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Spotify from "@/services/spotify";
import { ChallengePayload, TopArtistResponse } from "@/shared/models";

export const decodeChallengeToken = (token: string): string => {
  console.log("Decoding...");
  const decoded = Buffer.from(token, "hex").toString();
  console.log(decoded);
  return decoded;
};

export const encodeChallengeToken = (
  challengePayload: ChallengePayload
): string => {
  const payload = JSON.stringify(challengePayload);
  console.log("Encoding: ", payload);
  const encoded = Buffer.from(payload).toString("hex");
  console.log(encoded);
  decodeChallengeToken(encoded);
  return encoded;
};

const spotifyResponseToChallengePayload = (
  response: TopArtistResponse
): ChallengePayload => {
  const challengePayload: ChallengePayload = {
    challenger: "Daniel Alfaro",
    topArtists: response.data.map((artist) => artist.id),
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

  useEffect(() => {
    // TODO: Check if token expired
    if (challengeTokenParam) {
      storeToken(challengeTokenParam);
    } else if (spotifyTokenParam) {
      checkChallengeTokenLocal();
    }
  }, [challengeTokenParam, spotifyTokenParam]);

  const storeToken = (token: string | string[]) => {
    localStorage.setItem("challengeToken", token.toString());
  };

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
    const accessToken = await spotify.getAccessToken();
    if (accessToken) {
      const topArtists = await spotify.getTopArtists();
      console.log(topArtists);
      const challengePayload = encodeChallengeToken(
        spotifyResponseToChallengePayload(topArtists)
      );
      console.log("CREATE GAME CHALLENGE PAYLOAD: ", challengePayload);
      console.log(
        "CREATE GAME CHALLENGE PAYLOAD DECODED: ",
        decodeChallengeToken(challengePayload)
      );
    }
  };

  const onSpotifyLogin = () => {
    spotify.authenticate();
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
                Create Game
              </button>
              <p>After Create Game, Login to Spotify...</p>
            </>
          ) : (
            <></>
          )}
          {!spotifyTokenParam && challengeTokenParam ? (
            <>
              <h2>Join the game sent by ...</h2>
              <button className={styles.card} onClick={onSpotifyLogin}>
                Go Play
              </button>
              <p>After Go Play, Login to Spotify...</p>
            </>
          ) : (
            <></>
          )}
          {spotifyTokenParam && !challengeTokenLocal ? (
            <>
              <button className={styles.card} onClick={createNewGame}>
                Create Game
              </button>
              <p>After Create Game, create the sharable Link</p>
            </>
          ) : (
            ""
          )}
          {spotifyTokenParam && challengeTokenLocal ? (
            <>
              <button className={styles.card} onClick={startChallenge}>
                Start the Game!
              </button>
              <p>After Start the Game, render Game UI</p>
              <div>{JSON.stringify(challengePayload)}</div>
            </>
          ) : (
            ""
          )}
        </div>
      </main>
    </>
  );
}
