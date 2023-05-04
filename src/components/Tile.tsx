import { BoardTile } from "@/shared/models";
import Image from "next/image";

export default function Tile({
  boardTile,
  animate,
}: {
  boardTile: BoardTile;
  animate: any;
}) {
  const getTileStyleByTries = (attempts: number): string => {
    if (attempts >= 30) {
      return "bg-orange-600";
    } else if (attempts >= 25) {
      return "bg-orange-500";
    } else if (attempts >= 20) {
      return "bg-orange-400";
    } else if (attempts >= 15) {
      return "bg-orange-300";
    } else if (attempts >= 10) {
      return "bg-orange-200";
    } else if (attempts >= 5) {
      return "bg-orange-100";
    } else return "";
  };

  return (
    <>
      <div
        tabIndex={0}
        className={
          "w-32 h-32 flex items-center justify-center rounded-full relative overflow-clip motion-safe:animate-pulse " +
          (animate
            ? "bg-green-400 transition ease-in-out duration-1000 "
            : getTileStyleByTries(boardTile.tries))
        }
      >
        {boardTile?.data &&
        "images" in boardTile.data &&
        boardTile.data.images[0]?.url ? (
          <Image
            className="rounded-full p-2"
            src={`${boardTile.data.images[0].url}`}
            alt={`Picture of ${boardTile.data.name}`}
            fill={true}
          />
        ) : (
          ""
        )}
        <div className="absolute w-full h-full bg-gradient-to-t from-slate-300 to-transparent flex justify-center items-end text-slate-50 pb-4">
          {boardTile.data?.name}
        </div>
        {/* {!boardTile.success && <div>{boardTile.tries}</div>} */}
      </div>
    </>
  );
}
