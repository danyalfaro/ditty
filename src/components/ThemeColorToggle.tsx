import useThemeColor from "@/hooks/useThemeColors";
import Toggle from "./Toggle";

const ThemeColorToggle = () => {
  const [themeColor, changeThemeColor] = useThemeColor();

  const onToggleDarkMode = () => {
    if (themeColor === "dark") changeThemeColor("light");
    if (themeColor === "light") changeThemeColor("dark");
  };

  return <Toggle checked={themeColor === "dark"} onChange={onToggleDarkMode} />;
};

export default ThemeColorToggle;
