import { useEffect, useState } from "react";
import { encodeChallengeToken } from "@/shared/util";
import { ChallengePayload, TopArtistResponse } from "@/shared/models";
import spotify from "@/services/spotify";

export const SocialLinks = () => {
  const [challengeToken, setChallengeToken] = useState("");

  useEffect(() => {}, []);

  // const spotifyResponseToChallengePayload = (
  //   response: TopArtistResponse
  // ): ChallengePayload => {
  //   const challengePayload: ChallengePayload = {
  //     challenger: `${user.display_name}`,
  //     topArtists: response.map((artist) => artist.id),
  //   };
  //   return challengePayload;
  // };

  const challengeTokenToShareableLink = (challengeToken: string): string => {
    return `${process.env.NEXT_PUBLIC_CHALLENGE_URI}?challengeToken=${challengeToken}`;
  };

  return <div>Showing Social Links!!!</div>;
};

export default SocialLinks;
