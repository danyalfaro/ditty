import { BoardTile } from "@/shared/models";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";

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
      console.log(
        "ANIMATE: ",
        modifiedTiles.map((tile) => tile.rank)
      );
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
      {boardTiles.map((boardTile: BoardTile, i: number) => {
        return (
          <div
            tabIndex={0}
            key={i}
            className={
              "w-full text-center " +
              (animate?.find((rank) => {
                return rank - 1 === i;
              })
                ? "bg-green-400 transition ease-in-out duration-1000"
                : "")
            }
          >
            <div>{boardTile.data?.name}</div>
            {!boardTile.success && <div>{boardTile.tries}</div>}
          </div>
        );
      })}
    </>
  );
};

export default Board;
