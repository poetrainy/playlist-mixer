import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router";
import Logo from "~/components/Logo";
import ICON_SPOTIFY_BLAND from "~/icons/icon-spotify-bland.svg";
import ICON_YOUTUBE_BLAND from "~/icons/icon-youtube-bland.svg";
import ICON_SEARCH from "~/icons/icon-search.svg";
import { cvaControlButton } from "~/routes/play";

export default function PlayContainer({ children }: { children: ReactNode }) {
  const params = new URLSearchParams(useLocation().search);
  const youtubeParams = params.get("youtube");
  const spotifyParams = params.get("spotify");

  const [youtubeUrl, setYoutubeUrl] = useState(
    `https://youtube.com/playlist?list=${youtubeParams}`
  );
  const [spotifyUrl, setSpotifyUrl] = useState(
    `https://open.spotify.com/playlist/${spotifyParams}`
  );

  const searchServices = [
    {
      name: "youtube",
      icon: ICON_YOUTUBE_BLAND,
      placeholder: "https://youtube.com/playlist?list=xxx",
      value: youtubeUrl,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        setYoutubeUrl(event.target.value),
    },
    {
      name: "spotify",
      icon: ICON_SPOTIFY_BLAND,
      placeholder: "https://open.spotify.com/playlist/xxx",
      value: spotifyUrl,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        setSpotifyUrl(event.target.value),
    },
  ];

  const youtubePlaylistId = new URLSearchParams(
    new URL(youtubeUrl).searchParams
  ).get("list");
  const spotifyPlaylistId = spotifyUrl.split("playlist/")[1].split("?")[0];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-10 py-4 px-[2.5vw] md:fixed md:inset-[0_0_auto_0] z-[1] md:bg-gray-50">
        <Logo />
        <div className="flex items-center gap-1 md:gap-3 w-full md:max-w-[50rem] md:h-12 text-gray-900 bg-white border-2 border-gray-300 py-1 pl-3 pr-2 md:pl-5 md:pr-4 rounded-2xl md:rounded-full">
          <div className="flex flex-col flex-grow md:flex-row gap-0.5 md:gap-4">
            {searchServices.map(
              ({ name, icon, placeholder, value, onChange }) => (
                <label key={name} className="flex items-center gap-1 w-full">
                  <img src={icon} className="flex-none size-6" />
                  <input
                    name={name}
                    className="w-full h-7 bg-transparent px-1 focus-visible:outline-teal-600"
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onChange(event)}
                  />
                </label>
              )
            )}
          </div>
          {youtubeUrl.length && spotifyUrl.length ? (
            <Link
              className={cvaControlButton({ type: "search" })}
              to={{
                pathname: "/play",
                search: `?youtube=${youtubePlaylistId}&spotify=${spotifyPlaylistId}`,
              }}
            >
              <img src={ICON_SEARCH} className="size-5" />
            </Link>
          ) : (
            <span className={cvaControlButton({ type: "search" })}>Play!</span>
          )}
        </div>
      </div>
      <main className="flex justify-center md:justify-between items-stretch flex-col md:flex-row gap-[2vw] w-[95vw] max-w-[60rem] m-auto">
        {children}
      </main>
    </>
  );
}
