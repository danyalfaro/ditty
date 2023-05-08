import { BoardTile } from "@/shared/models";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import Tile from "./Tile";

export const Board = ({ boardTiles }: { boardTiles: BoardTile[] }) => {
  const [previousTiles, setPreviousTiles] = useState<BoardTile[]>([]);
  const [tilesToAnimate, setTilesToAnimate] = useState<number[]>();
  const [fireConfetti, setFireConfetti] = useState<number>(0);
  const refAnimationInstance = useRef(null);
  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  useEffect(() => {
    checkTilesForChanges();
    const matched: number = boardTiles.filter((tile) => tile.success).length;
    {
      console.log(`Number of matched tiles: ${matched}`);
    }
    setPreviousTiles(boardTiles);
  }, [boardTiles]);

  const checkTilesForChanges = () => {
    const modifiedTiles = getModifiedTiles();
    if (modifiedTiles.length > 0) {
      setFireConfetti(fireConfetti + 1);
      setTilesToAnimate(modifiedTiles.map((tile) => tile.rank));
    }
  };

  const getModifiedTiles = (): BoardTile[] => {
    return boardTiles.filter((tile, index) => {
      return tile.success && !previousTiles[index].success;
    });
  };

  const canvasStyles: CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  };

  return (
    <>
      <ReactCanvasConfetti
        fire={fireConfetti}
        refConfetti={getInstance}
        style={canvasStyles}
      />
      <div className="w-full h-full flex justify-center relative">
        <div className="mt-16">
          {boardTiles
            .filter(
              (boardTile) =>
                boardTile.rank === 2 ||
                boardTile.rank === 5 ||
                boardTile.rank === 8
            )
            .map((boardTile) => {
              return (
                <div
                  key={boardTile.id}
                  className={"w-full pb-2 flex tile-left"}
                >
                  <Tile
                    boardTile={boardTile}
                    animate={tilesToAnimate?.find((rank) => {
                      return rank === boardTile.rank;
                    })}
                  />
                </div>
              );
            })}
        </div>
        <div className="">
          {boardTiles
            .filter(
              (boardTile) =>
                boardTile.rank === 1 ||
                boardTile.rank === 4 ||
                boardTile.rank === 7 ||
                boardTile.rank === 10
            )
            .map((boardTile) => {
              return (
                <div
                  key={boardTile.id}
                  className={"w-full pb-2 flex tile-left"}
                >
                  <Tile
                    boardTile={boardTile}
                    animate={tilesToAnimate?.find((rank) => {
                      return rank === boardTile.rank;
                    })}
                  />
                </div>
              );
            })}
        </div>
        <div className="mt-16">
          {boardTiles
            .filter(
              (boardTile) =>
                boardTile.rank === 3 ||
                boardTile.rank === 6 ||
                boardTile.rank === 9
            )
            .map((boardTile) => {
              return (
                <div
                  key={boardTile.id}
                  className={"w-full pb-2 flex tile-left"}
                >
                  <Tile
                    boardTile={boardTile}
                    animate={tilesToAnimate?.find((rank) => {
                      return rank === boardTile.rank;
                    })}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Board;
