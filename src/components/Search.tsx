import { Artist, ItemWrapper, Track } from "@/shared/models";
import Image from "next/image";
import { ChangeEvent, useState } from "react";

type SearchProps = {
  searchOptions: ItemWrapper[];
  handleSearch: (query: string) => Promise<void>;
  onItemSelection: (item: Artist | Track) => boolean;
};

export const Search = ({
  searchOptions,
  handleSearch,
  onItemSelection,
}: SearchProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value: query },
    } = event;
    setInputValue(query);
    if (timeoutId) clearTimeout(timeoutId);
    if (query.length < 1) {
      handleSearch("");
    } else {
      const newTimeoutId: NodeJS.Timeout = setTimeout(() => {
        handleSearch(inputValue);
      }, 500); // Debounce delay of half a second

      setTimeoutId(newTimeoutId);
    }
  };

  const handleItemSelection = (item: Artist | Track) => {
    if (onItemSelection(item)) setInputValue("");
  };

  return (
    <div className="w-full max-w-main relative flex flex-col">
      <input
        type="text"
        className="p-4 bg-slate-50 dark:bg-slate-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-800 placeholder:dark:text-slate-100"
        placeholder="search..."
        onChange={handleSearchInputChange}
        value={inputValue}
      />
      <button
        className="absolute right-0 p-4 text-slate-400"
        onClick={() =>
          handleSearchInputChange({
            target: { value: "" },
          } as ChangeEvent<HTMLInputElement>)
        }
      >
        clear
      </button>
      <div className="max-w-main w-full max-h-[75vh] absolute mt-16 flex flex-col body overflow-y-scroll z-20">
        {searchOptions &&
          searchOptions?.map(
            ({
              data: item,
              hasBeenAttempted,
              isSuccess,
              rank,
            }: ItemWrapper) => {
              return (
                <button
                  disabled={!!hasBeenAttempted}
                  onClick={() => handleItemSelection(item)}
                  key={item.id}
                  className={
                    "w-full h-24 min-h-[6rem] flex flex-row items-center p-4 my-1 transition ease-in-out duration-250 cursor-pointer " +
                    (isSuccess ? "text-gray-200 bg-green-900" : "bg-gray-400")
                  }
                >
                  {"images" in item && item?.images[0]?.url ? (
                    <Image
                      src={`${item.images[0].url}`}
                      alt={`Picture of ${item.name}`}
                      width={50}
                      height={50}
                    />
                  ) : (
                    ""
                  )}
                  {"album" in item && item?.album?.images[0].url ? (
                    <Image
                      src={`${item?.album?.images[0].url}`}
                      alt={`Picture of ${item.name}`}
                      width={50}
                      height={50}
                    />
                  ) : (
                    ""
                  )}
                  <div className="px-4">{item.name}</div>
                  {isSuccess && <div className="px-4">{rank + 1}</div>}
                </button>
              );
            }
          )}
      </div>
    </div>
  );
};

export default Search;
