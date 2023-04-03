import Board from "@/components/Board";
import SocialLinks from "@/components/SocialLinks";
import { decodeChallengeToken } from "@/shared/util";
import styles from "@/styles/Home.module.css";
import { useEffect } from "react";

export async function getServerSideProps({ query }: any) {
  const { challengeToken } = query;
  if (!challengeToken) return { props: {} };
  const challengePayload = decodeChallengeToken(challengeToken);
  return {
    props: { challengePayload },
  };
}

export const Challenge = (props: { challengePayload: string }) => {
  const challengePayload = JSON.parse(props.challengePayload);

  return (
    <main className={styles.main}>
      <div>Challenge page working!</div>
      <h1>{challengePayload.challenger}</h1>
      <p>{challengePayload.topArtists[0]}</p>
      <Board challengePayload={challengePayload} />
      <SocialLinks />
    </main>
  );
};

export default Challenge;
