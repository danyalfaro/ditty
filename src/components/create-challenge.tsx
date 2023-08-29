import { ChallengeCategory, ChallengeTimeRange } from "@/shared/models";
import { useState } from "react";

export const CreateGame = ({ onSubmit }: { onSubmit: any }) => {
  const [challengeCategory, setChallengeCategory] = useState<ChallengeCategory>(
    ChallengeCategory.ARTISTS
  );
  const [challengeTimeRange, setChallengeTimeRange] =
    useState<ChallengeTimeRange>(ChallengeTimeRange.RECENT);

  return (
    <>
      <div className="text-slate-800 dark:text-slate-300">
        Can anyone guess your Top Ditty? Share Your Link To Find Out...
      </div>
      <div className="w-full">
        <label className="w-full text-left">Category</label>
        <div className="inline-flex w-full" id="categoryButtonGroup">
          <button
            onClick={() => setChallengeCategory(ChallengeCategory.SONGS)}
            className={
              "font-bold py-2 px-4 rounded-l w-1/2 transition-colors duration-500 " +
              (challengeCategory === ChallengeCategory.SONGS
                ? "bg-black text-gray-300"
                : "bg-gray-300 text-gray-800")
            }
          >
            Songs
          </button>
          <button
            onClick={() => setChallengeCategory(ChallengeCategory.ARTISTS)}
            className={
              "font-bold py-2 px-4 rounded-r w-1/2 transition-colors duration-500 " +
              (challengeCategory === ChallengeCategory.ARTISTS
                ? "bg-black text-gray-300"
                : "bg-gray-300 text-gray-800")
            }
          >
            Artists
          </button>
        </div>
      </div>
      <div className="w-full">
        <label className="w-full text-left">Time Range</label>
        <div className="inline-flex w-full">
          <button
            onClick={() => setChallengeTimeRange(ChallengeTimeRange.RECENT)}
            className={
              "font-bold py-2 px-4 rounded-l w-1/2 transition-colors duration-500 " +
              (challengeTimeRange === ChallengeTimeRange.RECENT
                ? "bg-black text-gray-300"
                : "bg-gray-300 text-gray-800")
            }
          >
            Recent
          </button>
          <button
            onClick={() => setChallengeTimeRange(ChallengeTimeRange.ALL_TIME)}
            className={
              "font-bold py-2 px-4 rounded-r w-1/2 transition-colors duration-500 " +
              (challengeTimeRange === ChallengeTimeRange.ALL_TIME
                ? "bg-black text-gray-300"
                : "bg-gray-300 text-gray-800")
            }
          >
            All Time
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSubmit(challengeCategory, challengeTimeRange)}
        className="bg-green-600 text-slate-100 p-4 border-solid rounded-md w-full"
      >
        Start Game
      </button>
    </>
  );
};

export default CreateGame;
