import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export const SocialLinks = () => {
  const [challengeToken, setChallengeToken] = useState("");

  useEffect(() => {}, []);

  const challengeTokenToShareableLink = (challengeToken: string): string => {
    return `${process.env.NEXT_PUBLIC_CHALLENGE_URI}?challengeToken=${challengeToken}`;
  };

  return <div>Showing Social Links!!!</div>;
};

export default SocialLinks;
