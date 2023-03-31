import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import SocialLinks from "@/components/SocialLinks";
import Board from "@/components/Board";

export const Game = () => {
  const [challengeToken, setChallengeToken] = useState({});

  useEffect(() => {
    const challengeToken = localStorage.getItem("challengeToken");
    if (challengeToken) {
      setChallengeToken(challengeToken);
    }
  }, []);
  return (
    <main className={styles.main}>
      <div>Welcome to Ditty! This is the Game page :)</div>
      <div>{challengeToken ? <Board /> : <SocialLinks />}</div>
    </main>
  );
};

export default Game;
