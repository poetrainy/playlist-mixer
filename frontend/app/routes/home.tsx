import type { Route } from "./+types/home";
import { useState } from "react";
import ICON_SPOTIFY from "~/icons/icon_spotify.png";
import ICON_YOUTUBE from "~/icons/icon_youtube.svg";
import { getSpotifyPlaylist, getYoutubePlaylist } from "~/api/get";
import type { PlaylistType, TrackType } from "~/types/common";
import { cva } from "class-variance-authority";
import { DUMMY_SPOTIFY_TRACKS, DUMMY_YOUTUBE_TRACKS } from "~/constants/common";
import { shuffle } from "~/libraries/shuffle";

const currentIconMap = {
  youtube: ICON_YOUTUBE,
  spotify: ICON_SPOTIFY,
} as const;

const cvaTrack = cva(
  [
    "flex",
    "justify-start",
    "gap-2",
    "w-full",
    "p-1",
    "rounded",
    "outline-offset-4",

    "focus-visible:outline-teal-600",
  ],
  {
    variants: {
      current: {
        false: ["hover:bg-gray-200", "active:bg-gray-300"],
        true: ["bg-teal-500"],
      },
    },
  }
);

const cvaTrackTitle = cva(
  [
    "text-sm",
    "font-bold",
    "whitespace-nowrap",
    "overflow-hidden",
    "text-ellipsis",
    "text-left",
  ],
  {
    variants: {
      current: {
        false: ["text-gray-900"],
        true: ["text-white"],
      },
    },
  }
);

const cvaTrackArtistName = cva(
  ["text-gray-500", "text-[0.625rem]", "text-left"],
  {
    variants: {
      current: {
        false: [],
        true: ["text-white", "opacity-80", "font-bold"],
      },
    },
  }
);

const cvaTrackThumbnail = cva(
  [
    "flex",
    "justify-center",
    "items-center",
    "flex-none",
    "size-9",
    "overflow-hidden",
    "rounded",
  ],
  {
    variants: {
      current: {
        false: [],
        true: [],
      },
    },
  }
);

const cvaCurrentType = cva(
  [
    "flex",
    "justify-center",
    "items-center",
    "flex-none",
    "size-6",
    "text-white",
    "rounded",
  ],
  {
    variants: {
      type: {
        youtube: ["bg-[#DA1725]"],
        spotify: ["bg-[#2ebd59]"],
      },
    },
  }
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Shuffle YouTube & Spotify Playlists" },
    { name: "description", content: "Shuffle YouTube & Spotify Playlists" },
  ];
}

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState(
    "https://youtube.com/playlist?list=PLty2Cdanci1cdq0bluspoZ8QckDN4P4cz&feature=shared"
  );
  const [spotifyUrl, setSpotifyUrl] = useState(
    "https://open.spotify.com/playlist/3jwwUaYQE4h2Y4S9idkdwF?si=BcNCY7nHTHC3i-WdJigh0A"
  );
  const [error, setError] = useState(false);
  const [youtubePlaylist, setYoutubePlaylist] =
    useState<TrackType[]>(DUMMY_YOUTUBE_TRACKS);
  const [spotifyPlaylist, setSpotifyPlaylist] = useState(DUMMY_SPOTIFY_TRACKS);
  const [playlist, setPlaylist] = useState<PlaylistType[]>([
    ...youtubePlaylist.map((track) => ({ type: "youtube" as const, track })),
    ...spotifyPlaylist.map((track) => ({ type: "spotify" as const, track })),
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const search = async () => {
    setError(false);

    const youtubeBaseParams = new URL(youtubeUrl).searchParams;
    const youtubePlaylistId = new URLSearchParams(youtubeBaseParams).get(
      "list"
    );
    const spotifyPlaylistId = spotifyUrl.split("playlist/")[1].split("?")[0];

    if (!(youtubePlaylistId && !!spotifyPlaylistId)) {
      setError(true);
      return;
    }

    await getSpotifyPlaylist(spotifyPlaylistId).then(
      // (response) => console.log(JSON.stringify(response))
      (response) => setSpotifyPlaylist(response)
    );
    await getYoutubePlaylist(youtubePlaylistId).then(
      // (response) => console.log(JSON.stringify(response))
      (response) => setYoutubePlaylist(response)
    );
  };

  // {error && (
  //   <p>
  //     プレイリストがヒットしませんでした。URLを確認し、もう一度お試しください。
  //   </p>
  // )}

  return (
    <>
      <div className="flex flex-col justify-between items-center gap-3 md:flex-row w-[90vw] m-auto py-4 fixed inset-[0_0_auto_0] z-[1] bg-gray-50">
        <h1 className="text-teal-800 text-3xl font-bold">Shuffler</h1>
        <div className="flex flex-col justify-between items-end gap-3 md:flex-row md:w-[50rem]">
          <label className="flex flex-col gap-1 w-full">
            {/* <span className="text-teal-600 text-sm font-bold">YouTube</span> */}
            <div className="relative">
              <span className="flex justify-center items-center w-12 h-11 text-white bg-[#DA1725] pl-1 absolute top-[2px] left-[2px] rounded-[6rem_0_0_6rem]">
                <img src={ICON_YOUTUBE} className="size-6" />
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
            {/* <span className="text-teal-600 text-sm font-bold">Spotify</span> */}
            <div className="relative">
              <span className="flex justify-center items-center w-12 h-11 bg-[#2ebd59] pl-1 absolute top-[2px] left-[2px] rounded-[6rem_0_0_6rem]">
                <img src={ICON_SPOTIFY} className="size-6" />
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
          <button
            className="flex-none w-20 h-12 text-white px-3 rounded-md font-bold outline-offset-[3px] transition-colors enabled:bg-teal-500 enabled:hover:bg-teal-600 enabled:active:bg-teal-700 focus-visible:outline-teal-600 disabled:bg-gray-300"
            disabled={!youtubeUrl.length || !spotifyUrl.length}
            onClick={() => search()}
          >
            検索
          </button>
        </div>
      </div>
      <main className="flex justify-between items-stretch flex-col md:flex-row gap-10 w-[95vw] max-w-[60rem] m-auto">
        <div className="flex flex-col items-start gap-6 flex-none size-fit max-w-[32rem] pt-24 sticky top-0">
          <div className="flex justify-center items-center size-full max-w-[32rem] max-h-[32rem] aspect-square overflow-hidden relative rounded-2xl shadow-2xl">
            {playlist[currentIndex].type === "youtube" ? (
              <>
                <div className="flex justify-center items-center h-full aspect-video overflow-hidden absolute">
                  <div className="flex justify-center items-center aspect-video blur-md scale-105">
                    <img src={playlist[currentIndex].track.thumbnail.url} />
                  </div>
                </div>
                <div className="flex items-center aspect-video overflow-hidden relative z-auto">
                  <img src={playlist[currentIndex].track.thumbnail.url} />
                </div>
              </>
            ) : (
              <img src={playlist[currentIndex].track.thumbnail.url} />
            )}
          </div>
          <div className="flex flex-col items-stretch gap-2 w-full">
            <div className="flex items-center gap-1.5 text-gray-700">
              <span
                className={cvaCurrentType({
                  type: playlist[currentIndex].type,
                })}
              >
                <img
                  src={currentIconMap[playlist[currentIndex].type ?? "youtube"]}
                  className="size-5"
                />
              </span>
              <span className="text-sm">
                {playlist[currentIndex].track.artist}
              </span>
            </div>
            <div className="text-gray-900 text-2xl font-bold leading-9">
              {playlist[currentIndex].track.title}
            </div>
          </div>
          <div className="flex justify-between w-full">
            <button onClick={() => setCurrentIndex((prev) => prev - 1)}>
              Prev
            </button>
            <button onClick={() => setCurrentIndex((prev) => prev + 1)}>
              Next
            </button>
          </div>
          <button
            className="flex-none h-12 text-white px-3 rounded-md font-bold outline-offset-[3px] transition-colors enabled:bg-teal-500 enabled:hover:bg-teal-600 enabled:active:bg-teal-700 focus-visible:outline-teal-600 disabled:bg-gray-300"
            onClick={() => {
              setPlaylist(shuffle(playlist, currentIndex));
              setCurrentIndex(0);
            }}
          >
            シャッフル
          </button>
        </div>
        <ul className="flex flex-col items-stretch gap-1.5 flex-grow pt-24 pb-8">
          {playlist.map(({ track }, index) => (
            <li key={track.id + index}>
              <button
                className={cvaTrack({
                  current: track.id === playlist[currentIndex].track.id,
                })}
                onClick={() => setCurrentIndex(index)}
                disabled={currentIndex === index}
              >
                <div
                  className={cvaTrackThumbnail({
                    current: track.id === playlist[currentIndex].track.id,
                  })}
                >
                  <img src={track.thumbnail.url} className="size-full" />
                </div>
                <div className="flex items-stretch flex-col w-[calc(100%_-_2.25rem_-_0.5rem)]">
                  <div
                    className={cvaTrackTitle({
                      current: track.id === playlist[currentIndex].track.id,
                    })}
                  >
                    {track.title}
                  </div>
                  <div
                    className={cvaTrackArtistName({
                      current: track.id === playlist[currentIndex].track.id,
                    })}
                  >
                    {track.artist}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
