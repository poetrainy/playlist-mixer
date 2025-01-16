import type { Route } from "./+types/home";
import { useState } from "react";
import { useNavigate } from "react-router";
import Logo from "~/components/Logo";
import ICON_SPOTIFY_BLAND from "~/icons/icon-spotify-bland.svg";
import ICON_YOUTUBE_BLAND from "~/icons/icon-youtube-bland.svg";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Playlist Mixer" },
    { name: "description", content: "Shuffle YouTube & Spotify Playlists" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [error, setError] = useState(false);

  const createSearchParams = () => {
    setError(false);

    const youtubePlaylistId = youtubeUrl.split("list=")[1]?.split("?")[0];
    const spotifyPlaylistId = spotifyUrl.split("playlist/")[1]?.split("?")[0];

    if (!!youtubePlaylistId && !!spotifyPlaylistId) {
      navigate(
        `play/?youtube=${youtubePlaylistId}&spotify=${spotifyPlaylistId}`
      );
    } else {
      setError(true);
    }
  };

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

  return (
    <main className="flex flex-col items-center gap-8 py-40 px-[2.5vw]">
      <Logo homePage />
      <div className="flex flex-col justify-between items-end gap-2.5 w-full md:max-w-2xl">
        {searchServices.map(({ name, icon, placeholder, value, onChange }) => (
          <label key={name} className="flex items-center gap-1 w-full relative">
            <img src={icon} className="flex-none size-6 absolute left-4" />
            <input
              name={name}
              className="w-full h-12 text-gray-900 bg-white border-2 border-gray-300 pl-12 pr-4 rounded-full outline-offset-4 focus-visible:outline-teal-600"
              placeholder={placeholder}
              value={value}
              onChange={(event) => onChange(event)}
            />
          </label>
        ))}
      </div>
      <button
        className="flex items-center justify-center flex-none w-20 h-12 text-white px-3 rounded-md font-bold outline-offset-[3px] transition-colors focus-visible:outline-teal-600 enabled:bg-teal-500 enabled:hover:bg-teal-600 enabled:active:bg-teal-700 disabled:bg-gray-300"
        onClick={() => createSearchParams()}
        disabled={!youtubeUrl.length || !spotifyUrl.length}
      >
        Play!
      </button>
      {error && (
        <p>URLが不明です。正しく入力されているか、もう一度確認してください。</p>
      )}
    </main>
  );
}
