import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as jose from "jose";
import Spotify from "@/services/spotify";

const inter = Inter({ subsets: ["latin"] });
const challengeSecret = process?.env?.NEXT_PUBLIC_CHALLENGE_SECRET
  ? jose.base64url.decode(process.env.NEXT_PUBLIC_CHALLENGE_SECRET)
  : null;

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
    if (challengeTokenLocal && challengeSecret) {
      const { payload } = await jose.jwtDecrypt(
        challengeTokenLocal,
        challengeSecret,
        {
          issuer: "Spotify Ranks",
        }
      );
      setChallengePayload(payload);
      console.log(payload);
    }
  };

  const createNewGame = async () => {
    console.log("creating new game...");
    const accessToken = await spotify.getAccessToken();
    // console.log(accessToken);
    if (accessToken) {
      console.log(challengeSecret);
      if (challengeSecret) {
        const topArtists = await spotify.getTopArtists();
        console.log(topArtists);
        const jwt = await new jose.EncryptJWT(topArtists)
          .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
          .setIssuer("Spotify Ranks")
          .encrypt(challengeSecret);

        console.log(jwt);

        console.log(`Sharable Link: localhost:3000?challengeToken=${jwt}`);
      }
    }
  };

  const getSpotifyRanks = () => {
    return {
      topArtists: [
        { id: 231231, name: "Bad Bunny" },
        { id: 201232, name: "Arcangel" },
        { id: 893223, name: "Ednita Nazario" },
      ],
    };
  };

  const onSpotifyLogin = () => {
    spotify.authenticate();
  };

  const renderArtists = async () => {
    console.log(await spotify.getTopArtists());
    return <></>;
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
