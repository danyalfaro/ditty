import { ChallengeCategory, ChallengeTimeRange } from "@/shared/models";
import { useState } from "react";
import SelectButton from "./SelectButton";

export const CreateGame = ({ onSubmit }: { onSubmit: any }) => {
  const [challengeCategory, setChallengeCategory] = useState<ChallengeCategory>(
    ChallengeCategory.ARTISTS
  );
  const [challengeTimeRange, setChallengeTimeRange] =
    useState<ChallengeTimeRange>(ChallengeTimeRange.RECENT);

  const onToggleChallengeCategory = () => {
    setChallengeCategory((prev) => {
      if (prev === ChallengeCategory.SONGS) {
        return ChallengeCategory.ARTISTS;
      } else return ChallengeCategory.SONGS;
    });
  };

  const onToggleTimeRange = () => {
    setChallengeTimeRange((prev) => {
      if (prev === ChallengeTimeRange.ALL_TIME) {
        return ChallengeTimeRange.RECENT;
      } else return ChallengeTimeRange.ALL_TIME;
    });
  };
  return (
    <>
      <div className="text-slate-800 dark:text-slate-300">
        Can anyone guess your Top Ditty? Share Your Link To Find Out...
      </div>
      <div className="w-full">
        <label className="w-full text-left">Category</label>
        <SelectButton
          checked={challengeCategory === ChallengeCategory.ARTISTS}
          onChange={onToggleChallengeCategory}
          onLabel="Artists"
          offLabel="Songs"
        />
      </div>
      <div className="w-full">
        <label className="w-full text-left">Time Range</label>
        <SelectButton
          checked={challengeTimeRange === ChallengeTimeRange.ALL_TIME}
          onChange={onToggleTimeRange}
          onLabel="All Time"
          offLabel="Recent"
        />
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
