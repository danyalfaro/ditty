import Spotify from "@/services/spotify";
import { Artist } from "@/shared/models";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

export const Search = ({ selectedItem, triedItems }: any) => {
  const spotify = new Spotify();
  const [response, setResponse] = useState<Artist[] | null>(null);
  const [selection, setSelection] = useState<Artist | null>(null);

  useEffect(() => {
    if (triedItems) {
      console.log(triedItems);
    }
  }, [triedItems]);

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value: query } = event.target;

    // TODO: add debounce
    if (query.length > 1) {
      const res = await spotify.searchArtists(query);
      setResponse(res);
    } else if (query.length === 0) {
      setResponse(null);
    }
  };

  const handleItemSelection = (artist: Artist) => {
    setSelection(artist);
    selectedItem(artist);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <input
          type="text"
          className="searchInput p-4"
          placeholder="search..."
          onChange={(e) => handleSearch(e)}
        />
        <div>
          {response &&
            response?.map((item) => {
              return (
                <div
                  onClick={() => handleItemSelection(item)}
                  key={item.id}
                  className="flex flex-row items-center p-4 my-4 bg-gray-400 cursor-pointer"
                >
                  {item?.images[0]?.url ? (
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
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Search;
