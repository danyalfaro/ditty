import useScreenSize from "@/hooks/useScreenSize";
import { BoardTile } from "@/shared/models";
import { FaWhatsapp, FaSms, FaRegCopy } from "react-icons/fa";
enum SharingLinks {
  WHATSAPP,
  CLIPBOARD,
  TWITTER,
  INSTAGRAM,
}
export const SocialLinks = ({ boardTiles }: { boardTiles?: BoardTile[] }) => {
  const { isMobile } = useScreenSize();

  const getTextFromBoardTiles = () => {
    if (!boardTiles) return;
    const text = boardTiles
      .map((tile: BoardTile) => {
        if (!tile.success) return "⬛";
        else if (tile.tries < 10) return "🟩";
        else if (tile.tries < 20) return "🟨";
        else return "🟧";
      })
      .join(``);
    const encoded = encodeURIComponent(text);
    return encodeURIComponent(text);
  };

  const onShare = async (platform: SharingLinks) => {
    const data: ShareData = {
      title: "Game Score!",
      text: "10/10!",
    };
    const shareMessage = `Can you guess my top ditty? Try now at: ${window.location.href}`;
    if (isMobile) {
      try {
        navigator.canShare(data);
        await navigator.share(data);
      } catch (e) {}
    } else {
      const windowFeatures = "left=500,top=200,width=500,height=600";
      switch (platform) {
        case SharingLinks.WHATSAPP:
          if (boardTiles) {
            window.open(
              `https://web.whatsapp.com/send?text=${getTextFromBoardTiles()}`,
              "Whatsapp",
              windowFeatures
            );
          } else {
            window.open(
              `https://web.whatsapp.com/send?text=${shareMessage}`,
              "Whatsapp",
              windowFeatures
            );
          }
        case SharingLinks.CLIPBOARD:
          navigator.clipboard.writeText(window.location.href);
          console.log("Copied to clipboard.");
        default:
          console.log("No Platform Detected...");
      }
    }
  };

  return (
    <>
      <div className="flex flex-row w-full justify-center">
        <button
          type="button"
          className={"text-slate-950 p-2 rounded-full bg-slate-100"}
          onClick={() => onShare(SharingLinks.WHATSAPP)}
        >
          <FaWhatsapp size={"24px"} />
        </button>
        <button
          type="button"
          className={"text-slate-950 p-2 rounded-full bg-slate-100"}
          onClick={() => onShare(SharingLinks.CLIPBOARD)}
        >
          <FaRegCopy size={"24px"} />
        </button>
      </div>
    </>
  );
};

export default SocialLinks;
