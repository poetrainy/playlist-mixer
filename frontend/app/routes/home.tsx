import type { Route } from "./+types/home";
import { cva } from "class-variance-authority";
import { useState } from "react";
import { useNavigate } from "react-router";
import Logo from "~/components/Logo";
import ICON_SPOTIFY_WHITE from "~/icons/icon-spotify-white.svg";
import ICON_YOUTUBE_WHITE from "~/icons/icon-youtube-white.svg";

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

  return (
    <main className="flex flex-col items-center gap-8 py-40 px-[2.5vw]">
      <Logo homePage />
      <div className="flex flex-col justify-between items-end gap-2.5 w-full md:max-w-2xl">
        <label className="flex flex-col gap-1 w-full">
          <div className="relative">
            <span className="flex justify-center items-center w-12 h-11 text-white bg-[#DA1725] pl-1 absolute top-[2px] left-[2px] rounded-[6rem_0_0_6rem]">
              <img src={ICON_YOUTUBE_WHITE} className="size-6" />
            </span>
            <input
              name="youtube"
              className="w-full h-12 text-gray-900 bg-white border-2 border-gray-300 pl-14 pr-3 rounded-full outline-offset-4 focus-visible:outline-teal-600"
              placeholder="https://youtube.com/playlist?list=xxx"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 w-full">
          <div className="relative">
            <span className="flex justify-center items-center w-12 h-11 bg-[#2ebd59] pl-1 absolute top-[2px] left-[2px] rounded-[6rem_0_0_6rem]">
              <img src={ICON_SPOTIFY_WHITE} className="size-6" />
            </span>
            <input
              name="spotify"
              className="w-full h-12 text-gray-900 bg-white border-2 border-gray-300 pl-14 pr-3 rounded-full outline-offset-4 focus-visible:outline-teal-600"
              placeholder="https://open.spotify.com/playlist/xxx"
              value={spotifyUrl}
              onChange={(event) => setSpotifyUrl(event.target.value)}
            />
          </div>
        </label>
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
