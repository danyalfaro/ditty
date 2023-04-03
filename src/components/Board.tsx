import { useEffect } from "react";

export const Board = ({ challengePayload }: any) => {
  useEffect(() => {
    console.log(challengePayload);
  }, [challengePayload]);

  return (
    <>
      <div>SHOWING CHALLENGE TO PLAY!!!</div>
    </>
  );
};

export default Board;
