import { BoardTile } from "@/shared/models";

export const Board = ({ boardTiles }: any) => {
  return (
    <>
      {boardTiles.map((boardTile: BoardTile, i: number) => {
        return (
          <div tabIndex={0} key={i}>
            <div>{boardTile.success.toString()}</div>
            <div>{boardTile.data?.name}</div>
            <div>{boardTile.tries}</div>
          </div>
        );
      })}
      <div></div>
    </>
  );
};

export default Board;
