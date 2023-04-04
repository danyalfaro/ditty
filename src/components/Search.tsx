import Spotify from "@/services/spotify";
import { Artist } from "@/shared/models";
import { ChangeEvent, useState } from "react";

export const Search = ({ verifyCallback }: any) => {
  const spotify = new Spotify();
  const [response, setResponse] = useState<Artist[] | null>(null);
  const [selection, setSelection] = useState<Artist | null>(null);

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    const { value: query } = event.target;
    console.log(event.target.value);
    if (query.length > 1) {
      const res = await spotify.searchArtists(query);
      console.log(res);
      setResponse(res);
    }
  };

  const handleItemSelection = (artist: Artist) => {
    setSelection(artist);
    verifyCallback(artist.id);
  };

  return (
    <>
      <div>
        <input
          type="text"
          className="searchInput"
          placeholder="enter a song or artist..."
          onChange={(e) => handleSearch(e)}
        />
        <div>
          {response &&
            response?.map((item) => {
              return (
                <div onClick={() => handleItemSelection(item)} key={item.id}>
                  {item.name}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Search;
