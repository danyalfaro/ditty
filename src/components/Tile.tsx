import { BoardTile, ChallengeCategory } from "@/shared/models";
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
          "w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full relative overflow-clip " +
          (animate
            ? "bg-green-400 transition ease-in-out duration-1000 "
            : getTileStyleByTries(boardTile.tries)) +
          (boardTile?.data ? "" : " motion-safe:animate-pulse")
        }
      >
        {boardTile.type === ChallengeCategory.ARTISTS ? (
          <ArtistTile boardTile={boardTile} />
        ) : (
          <SongTile boardTile={boardTile} />
        )}
        <div className="absolute w-full h-full bg-gradient-to-t from-slate-500 to-transparent flex justify-center items-end text-slate-50 pb-4">
          {boardTile.data?.name}
        </div>
      </div>
    </>
  );
}

const ArtistTile = ({ boardTile }: { boardTile: BoardTile }) => {
  return boardTile?.data &&
    "images" in boardTile.data &&
    boardTile.data.images[0]?.url ? (
    <Image
      className="rounded-full p-2"
      src={`${boardTile.data.images[0].url}`}
      alt={`Picture of ${boardTile.data.name}`}
      fill={true}
    />
  ) : (
    <></>
  );
};

const SongTile = ({ boardTile }: { boardTile: BoardTile }) => {
  return boardTile?.data &&
    "album" in boardTile.data &&
    boardTile.data?.album?.images[0].url ? (
    <Image
      className="rounded-full p-2"
      src={`${boardTile.data?.album?.images[0].url}`}
      alt={`Picture of ${boardTile.data.name}`}
      fill={true}
    />
  ) : (
    <></>
  );
};
