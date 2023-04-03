import { useEffect, useState } from "react";
import { FaWhatsapp, FaSms } from "react-icons/fa";

export const SocialLinks = () => {
  const [challengeToken, setChallengeToken] = useState("");

  return (
    <>
      <div>
        <FaWhatsapp />
        <FaSms />
      </div>
    </>
  );
};

export default SocialLinks;
