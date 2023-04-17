import { FaHamburger, FaUser } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";

export default function TopBar() {
  return (
    <>
      <div className="flex justify-center items-center h-12 w-full">
        <div className="flex justify-between items-center h-full w-full px-8">
          <GiHamburgerMenu size={"24px"} />
          <h1>DITTY</h1>
          <FaUser size={"24px"} />
        </div>
      </div>
    </>
  );
}
