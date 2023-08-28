import { AuthContext } from "@/shared/context";
import { removeToken } from "@/shared/util";
import Router from "next/router";
import { useContext, useState } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import ThemeColorToggle from "./ThemeColorToggle";

export default function TopBar() {
  const [isSideMenuExpanded, setIsSideMenuExpanded] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const { user } = useContext(AuthContext);

  const onToggleMenu = () => {
    setIsSideMenuExpanded((prev) => !prev);
  };

  const onUserIconClick = () => {
    setShowUserInfo((prev) => !prev);
  };

  const onAbandonChallenge = () => {
    removeToken("challengePayload");
    Router.push("/");
  };

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-between items-center w-full px-8 py-4">
          <button
            className="cursor-pointer p-2 border-solid border-transparent border-2 rounded hover:border-slate-200 dark:hover:border-slate-500"
            onClick={onToggleMenu}
          >
            {!isSideMenuExpanded ? (
              <RxHamburgerMenu size={"24px"} />
            ) : (
              <RxCross1 size={"24px"} />
            )}
          </button>
          <h1 className="text-4xl">DITTY</h1>
          {user && (
            <div
              className="bg-gray-400 dark:text-slate-50 text-slate-700 w-12 h-12 flex justify-center items-center rounded-full hover:cursor-pointer"
              onClick={onUserIconClick}
            >
              <span className="text-2xl">
                {user.display_name[0].toLocaleUpperCase("en-US")}
              </span>
              {showUserInfo && (
                <div className="absolute mt-20">{user.display_name}</div>
              )}
            </div>
          )}
        </div>
      </div>
      {isSideMenuExpanded && (
        <div className="flex">
          <div className="absolute z-20 h-[calc(100%-80px)] w-full sm:w-[320px] bg-slate-400 bg-opacity-60 text-slate-800 animate-openMenu">
            <div className="h-full flex flex-col justify-between">
              <ThemeColorToggle />
              <div className="m-4">
                <button
                  type="button"
                  onClick={onAbandonChallenge}
                  className="bg-red-600 text-slate-100 w-full p-4 border-solid rounded-md"
                >
                  Abandon Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
