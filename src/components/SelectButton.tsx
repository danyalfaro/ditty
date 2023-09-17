const SelectButton = ({
  checked,
  onChange,
  onLabel = "Dark",
  offLabel = "Light",
}: {
  checked: boolean;
  onChange: (e: any) => void;
  onLabel?: string;
  offLabel?: string;
}) => {
  let onLabelStyle = "";
  let offLabelStyle = "";
  switch (onLabel) {
    case "Dark":
      onLabelStyle = "peer-checked:before:content-['Dark']";
      break;
    case "Artists":
      onLabelStyle =
        "peer-checked:before:content-['Artists'] before:content-['Songs']";
      break;
    case "All Time":
      onLabelStyle =
        "peer-checked:before:content-['All_Time'] before:content-['Recent']";
      break;
  }
  switch (offLabel) {
    case "Light":
      offLabelStyle = "before:content-['Light']";
      break;
    case "Songs":
      offLabelStyle =
        "after:content-['Artists'] peer-checked:after:content-['Songs']";
      break;
    case "Recent":
      offLabelStyle =
        "after:content-['All_Time'] peer-checked:after:content-['Recent']";
      break;
  }
  return (
    <label className="relative inline-block w-full h-14">
      <input
        type="checkbox"
        className="peer opacity-0 h-0 w-0 focus:shadow-sm"
        checked={checked}
        onChange={onChange}
      ></input>
      <span
        className={
          `p-2 peer-checked:before:translate-x-full after:items-center after:w-full peer-checked:after:justify-start after:justify-end peer-checked:after:pl-[20%] after:pr-[20%] after:right-4 before:flex before:justify-center before:items-center after:flex after:h-full absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 rounded before:duration-300 before:rounded before:absolute before:h-10 before:w-[calc(50%-8px)] before:text-center before:bottom-2 before:bg-white text-black ` +
          onLabelStyle +
          " " +
          offLabelStyle
        }
      ></span>
    </label>
  );
};

export default SelectButton;
