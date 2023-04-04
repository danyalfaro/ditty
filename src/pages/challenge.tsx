import Board from "@/components/Board";
import Search from "@/components/Search";
import SocialLinks from "@/components/SocialLinks";
import { ChallengePayload } from "@/shared/models";
import { decodeChallengeToken } from "@/shared/util";
import styles from "@/styles/Home.module.css";
import { useEffect } from "react";

export async function getServerSideProps({ query }: any) {
  const { challengeToken } = query;
  if (!challengeToken) return { props: {} };
  const challengePayload: ChallengePayload =
    decodeChallengeToken(challengeToken);
  return {
    props: { challengePayload },
  };
}

export const Challenge = (props: { challengePayload: ChallengePayload }) => {
  const verifyCallback = (id: string): boolean => {
    const { topArtists } = props.challengePayload;
    console.log(
      topArtists.findIndex((artist) => {
        return artist === id;
      }) > 0
    );
    return (
      topArtists.findIndex((artist) => {
        artist === id;
      }) > 0
    );
  };

  return (
    <main className={styles.main}>
      <h1>{props.challengePayload.challenger}</h1>
      <Search verifyCallback={verifyCallback} />
      <Board challengePayload={props.challengePayload} />
      <SocialLinks />
    </main>
  );
};

export default Challenge;