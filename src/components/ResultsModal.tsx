import { ChallengeContext } from "@/shared/context";
import { useContext } from "react";
import { RxCross1 } from "react-icons/rx";
import Modal from "./Modal";
import SocialLinks from "./SocialLinks";

const ResultsModal = ({ isOpen, boardTiles, attemptCount }: any) => {
  const { setModalIsOpen } = useContext(ChallengeContext);

  return isOpen ? (
    <Modal className="text-black bg-slate-300">
      <RxCross1
        size={"24px"}
        className={"text-slate-950 dark:text-slate-300"}
        onClick={() => setModalIsOpen(false)}
      />
      <div>Congrats!</div>

      <SocialLinks boardTiles={boardTiles} />
    </Modal>
  ) : (
    <></>
  );
};

export default ResultsModal;
