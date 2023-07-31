import { ItemWrapper } from "@/shared/models";
import Image from "next/image";
import { useState } from "react";
import _ from "lodash";

export const Search = ({
  searchOptions,
  handleSearch,
  onItemSelection,
}: any) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleSearchInputChange = (event: any) => {
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

  return (
    <div className="w-full max-w-main relative flex flex-col">
      <input
        type="text"
        className="searchInput p-4"
        placeholder="search..."
        onChange={handleSearchInputChange}
      />
      <div className="max-w-main w-full max-h-[75vh] absolute mt-16 flex flex-col body overflow-y-scroll z-10">
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
                  onClick={() => onItemSelection(item)}
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
