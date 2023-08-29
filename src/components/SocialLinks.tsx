import { FaWhatsapp, FaSms } from "react-icons/fa";

export const SocialLinks = () => {
  return (
    <>
      <div className="flex flex-row justify-evenly w-32">
        <FaWhatsapp size={"24px"} />
        <FaSms size={"24px"} />
      </div>
    </>
  );
};

export default SocialLinks;
