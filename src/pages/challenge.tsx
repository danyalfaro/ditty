import Board from "@/components/Board";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import SocialLinks from "@/components/SocialLinks";
import { UserContext } from "@/shared/context";
import { ChallengePayload } from "@/shared/models";
import { decodeChallengeToken } from "@/shared/util";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useContext } from "react";

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
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(`${process.env.NEXT_PUBLIC_DITTY_URL}`);
    }
  }, [user, router]);

  const isTopDittyMatch = (id: string): boolean => {
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
    <Layout>
      <h1>{props.challengePayload.challenger}</h1>
      <div className="text-2xl py-6">{`Hello ${user?.display_name}`}</div>
      <Search isTopDittyMatch={isTopDittyMatch} />
      <Board challengePayload={props.challengePayload} />
      <SocialLinks />
    </Layout>
  );
};

export default Challenge;
