import Board from "@/components/Board";
import CreateGame from "@/components/create-challenge";
import Layout from "@/components/Layout";
import Search from "@/components/Search";
import useSpotify, { getUserFromLoginCode, login } from "@/services/useSpotify";
import { AuthContext } from "@/shared/context";
import {
  Artist,
  BoardTile,
  ChallengeCategory,
  ChallengePayload,
  ChallengeTimeRange,
  ItemWrapper,
  LocalStorageToken,
  Track,
  User,
} from "@/shared/models";
import {
  decodeChallengeToken,
  encodeChallengeToken,
  storeToken,
} from "@/shared/util";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useContext } from "react";

enum ChallengePageState {
  CREATION = "CREATION",
  GAMEPLAY = "GAMEPLAY",
  PROMPT = "PROMPT",
  LOADING = "LOADING",
  ERROR = "ERROR",
}

enum ChallengePageEvent {
  LOGIN_SUCCESSFUL = "LOGIN_SUCCESSFUL",
  LOGIN_FAILED = "LOGIN_FAILED",
  DECODING_SUCCESSFUL = "DECODING_SUCCESSFUL",
  DECODING_FAILED = "DECODING_FAILED",
}

type ChallengePageProps =
  | {
      event: ChallengePageEvent.LOGIN_SUCCESSFUL;
      data: {
        user: User;
        accessToken: LocalStorageToken;
        refreshToken: LocalStorageToken;
      };
    }
  | {
      event: ChallengePageEvent.LOGIN_FAILED;
      error: string;
    }
  | {
      event: ChallengePageEvent.DECODING_SUCCESSFUL;
      data: {
        challengePayload: ChallengePayload;
      };
    }
  | {
      event: ChallengePageEvent.DECODING_FAILED;
      error: string;
    };

export async function getServerSideProps({ query }: any) {
  const { challengeToken, code } = query;

  // Handle login to spotify.
  if (code && !challengeToken) {
    const { accessToken, refreshToken, user } =
      (await getUserFromLoginCode(code)) || {};
    if (accessToken && refreshToken && user) {
      const props: ChallengePageProps = {
        event: ChallengePageEvent.LOGIN_SUCCESSFUL,
        data: { user, accessToken, refreshToken },
      };
      return {
        props,
      };
    } else {
      const props: ChallengePageProps = {
        event: ChallengePageEvent.LOGIN_FAILED,
        error: "User not logged in.",
      };
      return {
        props,
      };
    }
  } else if (!code && challengeToken) {
    const challengeTokenFromURL = decodeChallengeToken(challengeToken);
    if (challengeTokenFromURL) {
      const props: ChallengePageProps = {
        event: ChallengePageEvent.DECODING_SUCCESSFUL,
        data: { challengePayload: challengeTokenFromURL },
      };
      return {
        props,
      };
    } else {
      const props: ChallengePageProps = {
        event: ChallengePageEvent.DECODING_FAILED,
        error: "Challenge token not valid.",
      };
      return {
        props,
      };
    }
  }

  const challengePayload: ChallengePayload | null =
    decodeChallengeToken(challengeToken);

  return {
    props: { challengePayload },
  };
}

const initializeBoardTiles = (
  challengePayload: ChallengePayload
): BoardTile[] => {
  let boardTiles: BoardTile[] = [];
  const { challengeCategory } = challengePayload;
  for (let i = 0; i < 10; i++) {
    boardTiles.push({
      data: null,
      id: challengePayload.items[i],
      tries: 0,
      success: false,
      rank: i + 1,
      type: challengeCategory,
    });
  }
  return boardTiles;
};

export const Challenge = (challengePageProps: ChallengePageProps) => {
  const { user, setUser, setAccessToken, setRefreshToken } =
    useContext(AuthContext);
  const { getTopItems, searchItems, getTopItemsByIds } = useSpotify();
  const [challengePayload, setChallengePayload] = useState<ChallengePayload>();
  const [searchOptions, setSearchOptions] = useState<ItemWrapper[]>([]);
  const [attemptedItems, setAttemptedItems] = useState<ItemWrapper[]>([]);
  const [boardTiles, setBoardTiles] = useState<BoardTile[]>([]);
  const [challengePageState, setChallengePageState] =
    useState<ChallengePageState>(ChallengePageState.LOADING);

  useEffect(() => {
    if (challengePageProps.event === ChallengePageEvent.LOGIN_SUCCESSFUL) {
      const { data } = challengePageProps;
      // Set user, check for local storage challenge payload.
      // If no valid challenge payload in local storage, then show Challenge Creation component.
      setUser(data.user);
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      const challengePayloadFromLocalStorage = findChallengePayload();
      if (challengePayloadFromLocalStorage) {
        setChallengePayload(challengePayloadFromLocalStorage);
        setBoardTiles(initializeBoardTiles(challengePayloadFromLocalStorage));
        Router.push(
          {
            pathname: "/challenge",
            query: {
              challengeToken: encodeChallengeToken(
                challengePayloadFromLocalStorage
              ),
            },
          },
          undefined,
          { shallow: true }
        );

        setChallengePageState(ChallengePageState.GAMEPLAY);
      } else {
        setChallengePageState(ChallengePageState.CREATION);
      }
    } else if (challengePageProps.event === ChallengePageEvent.LOGIN_FAILED) {
      setChallengePageState(ChallengePageState.ERROR);
    } else if (
      challengePageProps.event === ChallengePageEvent.DECODING_SUCCESSFUL
    ) {
      const challengePayloadFromLocalStorage = findChallengePayload();
      if (
        JSON.stringify(challengePageProps.data.challengePayload) ===
        JSON.stringify(challengePayloadFromLocalStorage)
      ) {
        onSpotifyLogin();
      } else {
        setChallengePageState(ChallengePageState.PROMPT);
      }
    } else if (
      challengePageProps.event === ChallengePageEvent.DECODING_FAILED
    ) {
      setChallengePageState(ChallengePageState.ERROR);
    }
  }, []);

  const findChallengePayload = (): ChallengePayload | undefined => {
    const challengePayloadFromLocalStorage =
      localStorage.getItem("challengePayload");
    if (challengePayloadFromLocalStorage) {
      const localStorageChallengePayloadJSON: ChallengePayload = JSON.parse(
        challengePayloadFromLocalStorage
      );
      return localStorageChallengePayloadJSON;
    } else return undefined;
  };

  const findAttemptByItem = (item: any): ItemWrapper | undefined => {
    return attemptedItems.find(
      (attempt: ItemWrapper) => attempt.data.id === item.id
    );
  };

  const handleSearch = async (query: string) => {
    if (query.length > 1 && challengePayload) {
      const { challengeCategory } = challengePayload;
      const res = await searchItems(query, challengeCategory);
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

  const onCreationSubmit = async (
    category: ChallengeCategory,
    timeRange: ChallengeTimeRange
  ) => {
    setChallengePageState(ChallengePageState.GAMEPLAY);
    const { challengePayload } = await getChallengePayload(category, timeRange);
    if (challengePayload) {
      setChallengePayload(challengePayload);
      setBoardTiles(initializeBoardTiles(challengePayload));
      Router.push(
        {
          pathname: "/challenge",
          query: {
            challengeToken: encodeChallengeToken(challengePayload),
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const onSpotifyLogin = () => {
    const redirectURI: string | undefined =
      process.env.NEXT_PUBLIC_REDIRECT_TO_CHALLENGE_URI;
    login(redirectURI);
  };

  const handleAcceptChallenge = () => {
    // TODO: SAVE PAYLOAD INTO LOCALSTORAGE, LOGIN TO SPOTIFY.
  };

  const onShowAnswer = () => {
    console.log("Answers coming...");
    console.log(challengePayload?.challengeCategory, challengePayload?.items);
    if (challengePayload?.challengeCategory && challengePayload?.items) {
      console.log(
        getTopItemsByIds(
          challengePayload?.challengeCategory,
          challengePayload?.items
        )
      );
    }
  };

  const getChallengePayload = async (
    category: ChallengeCategory,
    timeRange: ChallengeTimeRange
  ): Promise<{
    challengePayload: ChallengePayload;
    challengeToken: string;
  }> => {
    const topItems = await getTopItems(category, timeRange);
    const challengePayload: ChallengePayload = {
      challenger: `${user.display_name}`,
      challengeCategory: category,
      items: topItems.map((item: Artist | Track) => item.id),
    };
    const challengeToken = encodeChallengeToken(challengePayload);
    storeToken("challengePayload", challengePayload);
    return {
      challengePayload,
      challengeToken,
    };
  };

  return (
    <Layout>
      {challengePageState === ChallengePageState.LOADING && (
        <div>LOADING...</div>
      )}
      {challengePageState === ChallengePageState.ERROR && <div>ERROR...</div>}
      {challengePageState === ChallengePageState.CREATION && (
        <CreateGame onSubmit={onCreationSubmit} />
      )}
      {challengePageState === ChallengePageState.PROMPT && (
        <>
          <h1>
            WELCOME! you have been sent a game :) login to spotify to play :)
          </h1>
          <button
            type="button"
            onClick={handleAcceptChallenge}
            className="bg-green-600 text-slate-100 p-4 border-solid rounded-md w-full"
          >
            Login With Spotify
          </button>
        </>
      )}
      {challengePageState === ChallengePageState.GAMEPLAY && (
        <>
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
                  ? challengePayload?.challengeCategory
                      .charAt(0)
                      .toUpperCase() +
                    challengePayload?.challengeCategory.slice(1)
                  : ""}
              </span>
            </h1>
          </div>

          <div className="py-4">
            <Board boardTiles={boardTiles} />
          </div>
          {/* <SocialLinks /> */}
          <button onClick={onShowAnswer}>Show me all</button>
          <div>
            {`Matched ${
              attemptedItems.filter((attempt) => attempt.isSuccess).length
            } in ${attemptedItems.length} attempts.`}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Challenge;
