import { BoardTile } from "@/shared/models";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import Tile from "./Tile";

export const Board = ({ boardTiles }: { boardTiles: BoardTile[] }) => {
  const [previousTiles, setPreviousTiles] = useState<BoardTile[]>([]);
  const [animate, setAnimate] = useState<number[]>();
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
      setAnimate(modifiedTiles.map((tile) => tile.rank));
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
      <div className="flex flex-col basis-full w-full justify-between">
        <div className="flex flex-row justify-center">
          {boardTiles.slice(0, 3).map((boardTile: BoardTile, i: number) => {
            return (
              <div key={i}>
                <Tile
                  boardTile={boardTile}
                  animate={animate?.find((rank) => {
                    return rank - 1 === i;
                  })}
                  rank={i + 1}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-row justify-center">
          {boardTiles.slice(3, 6).map((boardTile: BoardTile, i: number) => {
            return (
              <div key={i}>
                <Tile
                  boardTile={boardTile}
                  animate={animate?.find((rank) => {
                    return rank - 1 === i;
                  })}
                  rank={i + 1}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-row justify-center">
          {boardTiles.slice(6, 9).map((boardTile: BoardTile, i: number) => {
            return (
              <div key={i}>
                <Tile
                  boardTile={boardTile}
                  animate={animate?.find((rank) => {
                    return rank - 1 === i;
                  })}
                  rank={i + 1}
                />
              </div>
            );
          })}
        </div>
        <div className="flex flex-row justify-center">
          {boardTiles.slice(9).map((boardTile: BoardTile, i: number) => {
            return (
              <div key={i}>
                <Tile
                  boardTile={boardTile}
                  animate={animate?.find((rank) => {
                    return rank - 1 === i;
                  })}
                  rank={i + 1}
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
