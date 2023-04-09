import Board from "@/components/Board";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import SocialLinks from "@/components/SocialLinks";
import { UserContext } from "@/shared/context";
import { Artist, ChallengePayload } from "@/shared/models";
import { decodeChallengeToken } from "@/shared/util";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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
  const [matchedItems, setMatchedItems] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(`${process.env.NEXT_PUBLIC_DITTY_URL}`);
    }
  }, [user, router]);

  const selectedItem = (item: any) => {
    if (isTopDittyMatch(item.id) && !isDuplicateMatch(item)) {
      setMatchedItems((previousMatchedItems) => [
        ...previousMatchedItems,
        ...[item],
      ]);
    }
  };

  const isTopDittyMatch = (id: string): boolean => {
    const { topArtists } = props.challengePayload;
    return (
      topArtists.findIndex((artist) => {
        return artist === id;
      }) > 0
    );
  };

  const isDuplicateMatch = (item: Artist) => {
    return !!matchedItems.find((artist) => {
      return artist.id === item.id;
    });
  };

  return (
    <Layout>
      <h1>{props.challengePayload.challenger}</h1>
      <div className="text-2xl py-6">{`Hello ${user?.display_name}`}</div>
      {matchedItems.map((item) => {
        return <div key={item.id}>{item.name}</div>;
      })}
      <Search selectedItem={selectedItem} />
      <Board challengePayload={props.challengePayload} />
      <SocialLinks />
    </Layout>
  );
};

export default Challenge;
