import { getThemeConfig, storeThemeConfig } from "@/shared/util";
import { useEffect, useState } from "react";

const useThemeColor = (): [string | undefined, (color: string) => void] => {
  const [themeColor, setThemeColor] = useState<string>();

  const changeThemeColor = (color: string) => {
    if (color === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setThemeColor(color);
    storeThemeConfig({ prefersDarkMode: color === "dark" });
  };

  useEffect(() => {
    const themeConfig = getThemeConfig();
    if (themeConfig) {
      changeThemeColor(themeConfig.prefersDarkMode ? "dark" : "light");
    } else {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      changeThemeColor(isDarkMode ? "dark" : "light");
    }
  }, []);
  return [themeColor, changeThemeColor];
};

export default useThemeColor;
