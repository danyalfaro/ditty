import Board from "@/components/Board";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import SocialLinks from "@/components/SocialLinks";
import { UserContext } from "@/shared/context";
import { Artist, BoardTile, ChallengePayload, Track } from "@/shared/models";
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
      id: challengePayload.items[i],
      tries: 0,
      success: false,
    });
  }
  return boardTiles;
};

export const Challenge = ({
  challengePayload,
}: {
  challengePayload: ChallengePayload;
}) => {
  const { user, setUser } = useContext(UserContext);
  const [triedItems, setTriedItems] = useState<any[]>([]);
  const [boardTiles, setBoardTiles] = useState<BoardTile[]>(
    initializeBoardTiles(challengePayload)
  );
  const router = useRouter();
  const { challenger, challengeCategory, items } = challengePayload;

  useEffect(() => {
    if (!user) {
      router.push(`${process.env.NEXT_PUBLIC_DITTY_URL}`);
    }
  }, [user, router]);

  const selectedItem = (item: Artist | Track): boolean => {
    if (addTriedItem(item)) {
      const matchedIndex = isTopDittyMatch(item.id);
      if (matchedIndex >= 0) {
        onSuccessMatch(item, matchedIndex);
        return true;
      } else if (matchedIndex < 0) {
        onFailedMatch();
      }
    }
    return false;
  };

  const isTopDittyMatch = (id: string): number => {
    return items.findIndex((item) => {
      return item === id;
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
      <Search
        triedItems={triedItems}
        selectedItem={selectedItem}
        challengeCategory={challengeCategory}
      />
      <div tabIndex={0} className="w-full flex justify-between px-4 py-8">
        <h1>
          <span className="font-bold">Challenge sent by: </span>
          <span>{challenger}</span>
        </h1>
        <h1>
          <span className="font-bold">Category: </span>
          <span>
            {challengeCategory.charAt(0).toUpperCase() +
              challengeCategory.slice(1)}
          </span>
        </h1>
      </div>

      <Board challengePayload={challengePayload} boardTiles={boardTiles} />
      <SocialLinks />
    </Layout>
  );
};

export default Challenge;
