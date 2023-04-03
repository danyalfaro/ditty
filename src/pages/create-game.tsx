import styles from "@/styles/Home.module.css";
import Spotify from "@/services/spotify";
import { ChallengePayload, TopArtistResponse } from "@/shared/models";
import { useEffect, useState } from "react";
import { encodeChallengeToken } from "@/shared/util";
import { useRouter } from "next/router";

export async function getServerSideProps({ query }: any) {
  const { code } = query;
  let user = {};
  if (!code) return { props: {} };
  const spotify = new Spotify(code);
  console.log("CREATING NEW GAME...");
  const redirectURI: string | undefined =
    process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
  const [accessToken, refreshToken] = await spotify.getAccessToken(redirectURI);
  if (accessToken) {
    user = await spotify.getUserProfile();
  }
  return {
    props: { user, accessToken, refreshToken },
  };
}

export const CreateGame = ({ user, accessToken, refreshToken }: any) => {
  const [challengePayload, setChallengePayload] =
    useState<ChallengePayload | null>(null);
  const spotify = new Spotify();
  const router = useRouter();

  useEffect(() => {
    storeToken("accessToken", accessToken);
    storeToken("refreshToken", refreshToken);
  }, []);

  const storeToken = (label: string, token: string | string[]) => {
    localStorage.setItem(
      label,
      JSON.stringify({ dateStamp: new Date(), token: token.toString() })
    );
  };

  const spotifyResponseToChallengePayload = (
    response: TopArtistResponse
  ): ChallengePayload => {
    const challengePayload: ChallengePayload = {
      challenger: `${user.display_name}`,
      topArtists: response.map((artist) => artist.id),
    };
    return challengePayload;
  };

  const getTopArtists = async (): Promise<{
    challengePayload: ChallengePayload;
    challengeToken: string;
  }> => {
    console.log("Getting top artists");
    const topArtists = await spotify.getTopArtists();
    const challengePayload = spotifyResponseToChallengePayload(topArtists);
    const challengeToken = encodeChallengeToken(challengePayload);
    return {
      challengePayload,
      challengeToken,
    };
  };

  const onTopArtistsSelection = async () => {
    const { challengePayload, challengeToken } = await getTopArtists();
    setChallengePayload(challengePayload);
    console.log(challengePayload, challengeToken);
    router.push(
      `${process.env.NEXT_PUBLIC_CHALLENGE_URI}?challengeToken=${challengeToken}`
    );
  };

  return (
    <main className={styles.main}>
      <div>Can anyone guess your Top Ditty? Share Your Link To Find Out...</div>
      <button type="button" onClick={onTopArtistsSelection}>
        My top Aritsts
      </button>
    </main>
  );
};

export default CreateGame;
