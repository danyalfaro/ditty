import { AuthContext } from "@/shared/context";
import { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

export default function TopBar() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-between items-center h-full w-full px-8 py-4">
          <GiHamburgerMenu size={"24px"} />
          <h1 className="text-4xl">DITTY</h1>
          {user && (
            <div className="bg-gray-400 text-slate-50 w-12 h-12 flex justify-center items-center rounded-full">
              <span className="text-2xl">
                {user.display_name[0].toLocaleUpperCase("en-US")}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
