import { AuthContext, ChallengeContext } from "@/shared/context";
import { removeToken } from "@/shared/util";
import Router from "next/router";
import { useContext, useState } from "react";
import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import SocialLinks from "./SocialLinks";
import ThemeColorToggle from "./ThemeColorToggle";

export default function TopBar() {
  const [isSideMenuExpanded, setIsSideMenuExpanded] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const { user } = useContext(AuthContext);
  const { onGiveUp } = useContext(ChallengeContext);

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

  const isLoggedIn = () => {
    return !!user;
  };

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-between items-center w-full  max-w-[1900px] min-w-[280px] px-8 py-4">
          {isLoggedIn() ? (
            <button
              className="cursor-pointer p-2 border-solid border-transparent border-2 rounded hover:border-slate-200 dark:hover:border-slate-500"
              onClick={onToggleMenu}
            >
              {!isSideMenuExpanded ? (
                <RxHamburgerMenu
                  size={"24px"}
                  className={"text-slate-950 dark:text-slate-300"}
                />
              ) : (
                <RxCross1
                  size={"24px"}
                  className={"text-slate-950 dark:text-slate-300"}
                />
              )}
            </button>
          ) : (
            <ThemeColorToggle />
          )}
          <h1 className="text-4xl text-slate-800 transition-colors duration-700 dark:text-slate-300">
            DITTY
          </h1>
          {isLoggedIn() ? (
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
          ) : (
            <div className="w-16"></div>
          )}
        </div>
      </div>
      {isSideMenuExpanded && (
        <div className="flex">
          <div className="absolute z-30 h-[calc(100%-80px)] w-full sm:w-[320px] bg-slate-300 text-slate-800 animate-openMenu">
            <div className="h-full flex flex-col justify-between p-4">
              <div>
                <ThemeColorToggle />
              </div>
              <div className="flex flex-col justify-between h-1/4 max-h-60">
                <button
                  type="button"
                  onClick={onGiveUp}
                  className="bg-slate-100 text-slate-800 w-full p-4 border-solid rounded-md"
                >
                  Give Up
                </button>
                <button
                  type="button"
                  onClick={onAbandonChallenge}
                  className="bg-slate-600 text-slate-100 w-full p-4 border-solid rounded-md"
                >
                  Abandon Challenge
                </button>
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
