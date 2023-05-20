import Board from "@/components/Board";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import Spotify from "@/services/spotify";
import { UserContext } from "@/shared/context";
import {
  Artist,
  BoardTile,
  ChallengeCategory,
  ChallengePayload,
  ItemWrapper,
  Track,
  User,
} from "@/shared/models";
import { decodeChallengeToken, storeToken } from "@/shared/util";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { useContext } from "react";

export async function getServerSideProps({ query }: any) {
  const { challengeToken, code } = query;
  const challengePayload: ChallengePayload | null =
    decodeChallengeToken(challengeToken);

  const spotify = new Spotify({ spotifyTokenParam: code });
  const redirectURI: string | undefined =
    process.env.NEXT_PUBLIC_REDIRECT_TO_CHALLENGE_URI;
  const { accessToken, refreshToken } = await spotify.getAccessToken(
    redirectURI
  );
  if (accessToken) {
    const user = await spotify.getUserProfile();
    return {
      props: { user, challengePayload },
    };
  }
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
      rank: i + 1,
    });
  }
  return boardTiles;
};

export const Challenge = ({
  challengePayload: challengePayloadProps,
  user,
}: {
  user?: User;
  challengePayload: ChallengePayload;
}) => {
  const { user: activeUser, setUser } = useContext(UserContext);
  const [challengePayload, setChallengePayload] = useState<ChallengePayload>();
  const [searchOptions, setSearchOptions] = useState<ItemWrapper[]>([]);
  const [attemptedItems, setAttemptedItems] = useState<ItemWrapper[]>([]);
  const [boardTiles, setBoardTiles] = useState<BoardTile[]>([]);
  const router = useRouter();
  const spotify = new Spotify({});

  const onSpotifyLogin = () => {
    const redirectURI: string | undefined =
      process.env.NEXT_PUBLIC_REDIRECT_TO_CHALLENGE_URI;
    spotify.login(redirectURI);
  };

  useEffect(() => {
    // Handle when user is logged in
    if (activeUser) {
      if (challengePayloadProps) {
        setChallengePayload(challengePayloadProps);
        setBoardTiles(initializeBoardTiles(challengePayloadProps));
      } else {
        const localStorageChallengeToken =
          localStorage.getItem("challengeToken");
        if (localStorageChallengeToken) {
          const localStorageChallengeTokenJSON: ChallengePayload = JSON.parse(
            localStorageChallengeToken
          );
          setChallengePayload(localStorageChallengeTokenJSON);
          setBoardTiles(initializeBoardTiles(localStorageChallengeTokenJSON));
        }
      }
    }
    // Handle user not logged in
    else {
      if (user) {
        setUser(user);
        const challengeTokenFromLocalStorage =
          localStorage.getItem("challengeToken");
        if (challengeTokenFromLocalStorage) {
          const localStorageChallengeTokenJSON: ChallengePayload = JSON.parse(
            challengeTokenFromLocalStorage
          );
          setChallengePayload(localStorageChallengeTokenJSON);
          setBoardTiles(initializeBoardTiles(localStorageChallengeTokenJSON));
        }
      } else {
        if (challengePayloadProps) {
          storeToken("challengeToken", challengePayloadProps);
        }
        onSpotifyLogin();
      }
    }
  }, []);

  const findAttemptByItem = (item: any): ItemWrapper | undefined => {
    return attemptedItems.find(
      (attempt: ItemWrapper) => attempt.data.id === item.id
    );
  };

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value: query } = event.target;

    // TODO: add debounce
    if (query.length > 1 && challengePayload) {
      const { challengeCategory } = challengePayload;
      const res = await spotify.searchItems(query, challengeCategory);
      setSearchOptions(
        res.map((item: any): ItemWrapper => {
          const attemptByItem = findAttemptByItem(item);
          if (attemptByItem === undefined) {
            return {
              type: challengeCategory,
              data: item,
              hasBeenAttempted: false,
              isSuccess: false,
              rank: -1,
            };
          }
          return attemptByItem;
        })
      );
    } else if (query.length === 0) {
      setSearchOptions([]);
    }
  };

  //TODO set ItemWrapper properties for isDuplicate, success, tries...
  const onItemSelection = (item: Artist | Track): boolean => {
    if (addAttempt(item)) {
      const matchedTileIndex = isTopDittyMatch(item.id);
      if (matchedTileIndex >= 0) {
        onSuccessMatch(item, matchedTileIndex);
        return true;
      } else if (matchedTileIndex < 0) {
        onFailedMatch(item);
      }
    }
    return false;
  };

  const isTopDittyMatch = (id: string): number => {
    if (challengePayload) {
      const { items } = challengePayload;
      return items.findIndex((item) => {
        return item === id;
      });
    }
    return -1;
  };

  const addAttempt = (item: Artist | Track): boolean => {
    if (!attemptedItems.find((attempt) => attempt.data.id === item.id)) {
      const rank = isTopDittyMatch(item.id);
      setAttemptedItems((previousAttemptedItems) => [
        ...previousAttemptedItems,
        {
          data: item,
          isSuccess: rank >= 0,
          rank: rank,
          type: ChallengeCategory.ARTISTS,
          hasBeenAttempted: true,
        },
      ]);
      return true;
    }
    return false;
  };

  // Adds the item matched to the corresponding board tile.
  const onSuccessMatch = (item: Artist | Track, matchedTileIndex: number) => {
    setSearchOptions([]);
    setBoardTiles((previousBoardTiles) => {
      let newBoardTiles = [...previousBoardTiles];
      newBoardTiles[matchedTileIndex] = {
        ...previousBoardTiles[matchedTileIndex],
        data: item,
        success: true,
      };
      return newBoardTiles;
    });
  };

  // Adds one try to all tiles that have not been matched.
  const onFailedMatch = (item: Artist | Track) => {
    setSearchOptions((previousItemWrappers) => {
      let newItemWrappers = [...previousItemWrappers];
      const searchOptionToUpdate = newItemWrappers.findIndex(
        (attempt: ItemWrapper) => attempt?.data?.id === item.id
      );
      const updatedItem: ItemWrapper = {
        ...newItemWrappers[searchOptionToUpdate],
        isSuccess: false,
        hasBeenAttempted: true,
      };
      newItemWrappers[searchOptionToUpdate] = updatedItem;
      return newItemWrappers;
    });
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
      <div className="py-2 w-full">
        <Search
          handleSearch={handleSearch}
          searchOptions={searchOptions}
          onItemSelection={onItemSelection}
        />
      </div>
      <div tabIndex={0} className="w-full hidden sm:flex justify-between">
        <h1>
          <span className="font-bold">Challenge sent by: </span>
          <span>{challengePayload?.challenger}</span>
        </h1>
        <h1>
          <span className="font-bold">Category: </span>
          <span>
            {challengePayload
              ? challengePayload?.challengeCategory.charAt(0).toUpperCase() +
                challengePayload?.challengeCategory.slice(1)
              : ""}
          </span>
        </h1>
      </div>

      <div className="py-4">
        <Board boardTiles={boardTiles} />
      </div>
      {/* <SocialLinks /> */}
      <div>
        {`Matched ${
          attemptedItems.filter((attempt) => attempt.isSuccess).length
        } in ${attemptedItems.length} attempts.`}
      </div>
    </Layout>
  );
};

export default Challenge;
