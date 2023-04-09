import { useEffect } from "react";

export const Board = ({ challengePayload }: any) => {
  useEffect(() => {
    console.log(challengePayload);
  }, [challengePayload]);

  return (
    <>
      <div></div>
    </>
  );
};

export default Board;
