import useThemeColor from "@/hooks/useThemeColors";

const ThemeColorToggle = () => {
  const [themeColor, changeThemeColor] = useThemeColor();

  const onToggleDarkMode = () => {
    if (themeColor === "dark") changeThemeColor("light");
    if (themeColor === "light") changeThemeColor("dark");
  };

  return (
    <div>
      <label className="relative inline-block w-16 h-9">
        <input
          type="checkbox"
          className="peer opacity-0 h-0 w-0 focus:shadow-sm"
          checked={themeColor === "dark"}
          onChange={onToggleDarkMode}
        ></input>
        <span className="peer-checked:bg-black peer-checked:before:translate-x-7 absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-200 rounded-full before:duration-300 before:rounded-full before:absolute before:h-7 before:w-7 before:left-1 before:bottom-1 before:bg-white"></span>
      </label>
    </div>
  );
};

export default ThemeColorToggle;
