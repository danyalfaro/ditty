import Spotify from "@/services/spotify";
import {
  ChallengeCategory,
  ChallengePayload,
  ChallengeTimeRange,
  TopItemsResponse,
} from "@/shared/models";
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
  const [challengeCategory, setChallengeCategory] = useState<ChallengeCategory>(
    ChallengeCategory.ARTISTS
  );
  const [challengeTimeRange, setChallengeTimeRange] =
    useState<ChallengeTimeRange>(ChallengeTimeRange.RECENT);
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
    response: TopItemsResponse
  ): ChallengePayload => {
    const challengePayload: ChallengePayload = {
      challenger: `${user.display_name}`,
      challengeCategory: challengeCategory,
      items: response.map((item) => item.id),
    };
    return challengePayload;
  };

  const getTopItems = async (): Promise<{
    challengePayload: ChallengePayload;
    challengeToken: string;
  }> => {
    const topItems = await spotify.getTopItems(
      challengeCategory,
      challengeTimeRange
    );
    const challengePayload = spotifyResponseToChallengePayload(topItems);
    const challengeToken = encodeChallengeToken(challengePayload);
    return {
      challengePayload,
      challengeToken,
    };
  };

  const onStartGame = async () => {
    const { challengePayload, challengeToken } = await getTopItems();
    setChallengePayload(challengePayload);
    router.push(
      `${process.env.NEXT_PUBLIC_CHALLENGE_URI}?challengeToken=${challengeToken}`
    );
  };

  return (
    <Layout>
      <div>Can anyone guess your Top Ditty? Share Your Link To Find Out...</div>
      <div className="w-full">
        <label className="w-full text-left">Category</label>
        <div className="inline-flex w-full" id="categoryButtonGroup">
          <button
            onClick={() => setChallengeCategory(ChallengeCategory.SONGS)}
            className={
              "font-bold py-2 px-4 rounded-l w-1/2 transition-colors duration-500 " +
              (challengeCategory === ChallengeCategory.SONGS
                ? "bg-black text-gray-300"
                : "bg-gray-300 text-gray-800")
            }
          >
            Songs
          </button>
          <button
            onClick={() => setChallengeCategory(ChallengeCategory.ARTISTS)}
            className={
              "font-bold py-2 px-4 rounded-r w-1/2 transition-colors duration-500 " +
              (challengeCategory === ChallengeCategory.ARTISTS
                ? "bg-black text-gray-300"
                : "bg-gray-300 text-gray-800")
            }
          >
            Artists
          </button>
        </div>
      </div>
      <div className="w-full">
        <label className="w-full text-left">Time Range</label>
        <div className="inline-flex w-full">
          <button
            onClick={() => setChallengeTimeRange(ChallengeTimeRange.RECENT)}
            className={
              "font-bold py-2 px-4 rounded-l w-1/2 transition-colors duration-500 " +
              (challengeTimeRange === ChallengeTimeRange.RECENT
                ? "bg-black text-gray-300"
                : "bg-gray-300 text-gray-800")
            }
          >
            Recent
          </button>
          <button
            onClick={() => setChallengeTimeRange(ChallengeTimeRange.ALL_TIME)}
            className={
              "font-bold py-2 px-4 rounded-r w-1/2 transition-colors duration-500 " +
              (challengeTimeRange === ChallengeTimeRange.ALL_TIME
                ? "bg-black text-gray-300"
                : "bg-gray-300 text-gray-800")
            }
          >
            All Time
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onStartGame}
        className="bg-green-600 text-slate-100 p-4 border-solid rounded-md w-full"
      >
        Start Game
      </button>
    </Layout>
  );
};

export default CreateGame;
