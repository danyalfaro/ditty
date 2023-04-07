import Spotify from "@/services/spotify";
import { ChallengePayload, TopArtistResponse } from "@/shared/models";
import { useContext, useEffect, useState } from "react";
import { encodeChallengeToken } from "@/shared/util";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { UserContext } from "@/shared/context";

export async function getServerSideProps({ query }: any) {
  const { code } = query;
  let user = {};
  if (!code) return { props: {} };
  const spotify = new Spotify(code);
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
  const { user: activeUser, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user || !accessToken || !refreshToken) {
      router.push(`${process.env.NEXT_PUBLIC_DITTY_URL}`);
    } else {
      setUser(user); // Sets the userContext from the value received through SSR.
      storeToken("accessToken", accessToken);
      storeToken("refreshToken", refreshToken);
    }
  }, [accessToken, activeUser, refreshToken, router, setUser, user]);

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
    router.push(
      `${process.env.NEXT_PUBLIC_CHALLENGE_URI}?challengeToken=${challengeToken}`
    );
  };

  return (
    <Layout>
      <div>Can anyone guess your Top Ditty? Share Your Link To Find Out...</div>
      <div className="text-2xl py-6">{`Hello ${user?.display_name}`}</div>

      <button
        type="button"
        onClick={onTopArtistsSelection}
        className="bg-green-600 text-slate-100 p-4 border-solid rounded-md"
      >
        My top Artists
      </button>
    </Layout>
  );
};

export default CreateGame;
