import { FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

export default function TopBar() {
  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-between items-center h-full w-full px-8 py-4">
          <GiHamburgerMenu size={"24px"} />
          <h1 className="text-4xl">DITTY</h1>
          <FaUser size={"24px"} />
        </div>
      </div>
    </>
  );
}
