import Board from "@/components/Board";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import SocialLinks from "@/components/SocialLinks";
import { UserContext } from "@/shared/context";
import { BoardTile, ChallengePayload } from "@/shared/models";
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

const initializeBoardTiles = (
  challengePayload: ChallengePayload
): BoardTile[] => {
  let boardTiles: BoardTile[] = [];
  for (let i = 0; i < 10; i++) {
    boardTiles.push({
      data: null,
      id: challengePayload.topArtists[i],
      tries: 0,
      success: false,
    });
  }
  return boardTiles;
};

export const Challenge = (props: { challengePayload: ChallengePayload }) => {
  const { user, setUser } = useContext(UserContext);
  const [triedItems, setTriedItems] = useState<any[]>([]);
  const [boardTiles, setBoardTiles] = useState<BoardTile[]>(
    initializeBoardTiles(props.challengePayload)
  );
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push(`${process.env.NEXT_PUBLIC_DITTY_URL}`);
    }
  }, [user, router]);

  const selectedItem = (item: any) => {
    if (addTriedItem(item)) {
      const matchedIndex = isTopDittyMatch(item.id);
      if (matchedIndex >= 0) {
        onSuccessMatch(item, matchedIndex);
      } else if (matchedIndex < 0) {
        onFailedMatch();
      }
    }
  };

  const isTopDittyMatch = (id: string): number => {
    const { topArtists } = props.challengePayload;
    console.log(
      topArtists.findIndex((artist) => {
        return artist === id;
      })
    );
    return topArtists.findIndex((artist) => {
      return artist === id;
    });
  };

  const addTriedItem = (item: any): boolean => {
    if (!triedItems.find((attempt) => attempt.id === item.id)) {
      setTriedItems((previousTriedItems) => [...previousTriedItems, item]);
      return true;
    }
    return false;
  };

  // Adds the item matched to the corresponding board tile.
  const onSuccessMatch = (item: any, matchedIndex: number) => {
    setBoardTiles((previousBoardTiles) => {
      let newBoardTiles = [...previousBoardTiles];
      newBoardTiles[matchedIndex] = {
        ...previousBoardTiles[matchedIndex],
        data: item,
        success: true,
      };
      return newBoardTiles;
    });
  };

  // Adds one try to all tiles that have not been matched.
  const onFailedMatch = () => {
    console.log("OnFailedMatch");
    setBoardTiles((previousBoardTiles) => {
      return previousBoardTiles.map((boardTile) => {
        let newBoardTile = { ...boardTile };
        if (!newBoardTile.success) newBoardTile.tries++;
        return newBoardTile;
      });
    });
  };

  return (
    <Layout>
      <div className="text-2xl py-6">{`Hello ${user?.display_name}`}</div>
      <Search triedItems={triedItems} selectedItem={selectedItem} />
      <h1>{props.challengePayload.challenger}</h1>
      <Board
        challengePayload={props.challengePayload}
        boardTiles={boardTiles}
      />
      <SocialLinks />
    </Layout>
  );
};

export default Challenge;
