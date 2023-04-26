import { BoardTile } from "@/shared/models";
import { useEffect } from "react";

export const Board = ({ boardTiles }: { boardTiles: BoardTile[] }) => {
  useEffect(() => {
    const matched: number = boardTiles.filter((tile) => tile.success).length;
    {
      console.log(`Matched: ${matched}`);
    }
  }, [boardTiles]);
  return (
    <>
      {boardTiles.map((boardTile: BoardTile, i: number) => {
        return (
          <div tabIndex={0} key={i} className="text-center">
            <div>{boardTile.data?.name}</div>
            {!boardTile.success && <div>{boardTile.tries}</div>}
          </div>
        );
      })}
      <div></div>
    </>
  );
};

export default Board;
