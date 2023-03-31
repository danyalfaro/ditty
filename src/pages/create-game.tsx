import styles from "@/styles/Home.module.css";
import SocialLinks from "@/components/SocialLinks";
import Spotify from "@/services/spotify";
import { encodeChallengeToken } from "@/shared/util";
import { ChallengePayload, TopArtistResponse } from "@/shared/models";
import { useEffect } from "react";

const spotifyResponseToChallengePayload = (
  response: TopArtistResponse
): ChallengePayload => {
  const challengePayload: ChallengePayload = {
    challenger: "Daniel Alfaro",
    topArtists: response.map((artist) => artist.id),
  };
  return challengePayload;
};

export async function getServerSideProps({ query }: any) {
  console.log("RENDERING HERE...");
  const { code } = query;
  let challengeToken = {};
  if (!code) return { props: {} };
  const spotify = new Spotify(code);
  console.log("CREATING NEW GAME...");
  const redirectURI: string | undefined =
    process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
  const accessToken = await spotify.getAccessToken(redirectURI);
  console.log("ACCESS TOKEN: ", accessToken);
  if (accessToken) {
    const topArtists = await spotify.getTopArtists();
    challengeToken = encodeChallengeToken(
      spotifyResponseToChallengePayload(topArtists)
    );
  }
  return {
    props: { code, challengeToken },
  };
}

export const CreateGame = ({ challengeToken }: any) => {
  const challengeTokenToShareableLink = (challengeToken: string): string => {
    return `${process.env.NEXT_PUBLIC_CHALLENGE_URI}?challengeToken=${challengeToken}`;
  };

  useEffect(() => {
    console.log("RENDERING IN CLIENT");
  }, []);

  return (
    <main className={styles.main}>
      <div>Can anyone guess your Top Ditty? Share Your Link To Find Out...</div>
      <button
        type="button"
        onClick={() =>
          console.log(challengeTokenToShareableLink(challengeToken))
        }
      >
        Console Log Shareble URL
      </button>
      <SocialLinks />
    </main>
  );
};

export default CreateGame;
