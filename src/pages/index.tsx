import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Spotify from "@/services/spotify";
import { ChallengePayload, TopArtistResponse } from "@/shared/models";
import Layout from "@/components/Layout";

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
      <Layout>
        <div className="flex flex-col justify-center text-center">
          {!spotifyTokenParam && !challengeTokenParam ? (
            <>
              <h2>Welcome!</h2>
              <button
                className="bg-green-600 text-slate-100 p-4 border-solid rounded-md"
                onClick={onSpotifyLogin}
              >
                Create Game
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </Layout>
    </>
  );
}
