import type { Route } from "./+types/home";
import { useState } from "react";
import ICON_SPOTIFY from "~/icons/icon_spotify.png";
import ICON_YOUTUBE from "~/icons/icon_youtube.svg";
import { getSpotifyPlaylist, getYoutubePlaylist } from "~/api/get";
import type { PlaylistType, TrackType } from "~/types/common";
import { cva } from "class-variance-authority";
import { DUMMY_SPOTIFY_TRACKS, DUMMY_YOUTUBE_TRACKS } from "~/constants/common";
import { shuffle } from "~/libraries/shuffle";

const playingIconMap = {
  youtube: ICON_YOUTUBE,
  spotify: ICON_SPOTIFY,
} as const;

const cvaTrackTitle = cva(
  [
    "text-sm",
    "font-bold",
    "whitespace-nowrap",
    "overflow-hidden",
    "text-ellipsis",
  ],
  {
    variants: {
      playing: {
        false: ["text-gray-900"],
        true: ["text-teal-600"],
      },
    },
  }
);

const cvaTrackArtistName = cva(["text-gray-500", "text-[0.625rem]"], {
  variants: {
    playing: {
      false: [],
      true: ["font-bold"],
    },
  },
});

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
      playing: {
        false: [],
        true: [],
      },
    },
  }
);

const cvaPlaying = cva(
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
  const playing = playlist[0];

  const getYoutube = async () => {
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

  return (
    <main className="flex flex-col items-stretch gap-6 w-[90vw] max-w-[50rem] m-auto py-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-teal-800 text-3xl font-bold">
          Music player by YouTube, Spotify
        </h1>
        <p className="text-gray-600 text-sm">
          YouTubeとSpotifyのプレイリストをシャッフルして再生します。
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 w-full">
          <span className="text-teal-600 text-sm font-bold">YouTube</span>
          <div className="relative">
            <span className="flex justify-center items-center size-11 text-white bg-[#DA1725] absolute top-[2px] left-[2px] rounded-[4px_0_0_4px]">
              <img src={ICON_YOUTUBE} className="size-6" />
            </span>
            <input
              name="youtube"
              className="w-full h-12 text-gray-900 bg-white border-2 border-gray-300 pl-14 pr-3 rounded-md outline-offset-4 focus-visible:outline-teal-600"
              placeholder="https://youtube.com/playlist?list=xxx"
              value={youtubeUrl}
              onChange={(event) => setYoutubeUrl(event.target.value)}
            />
          </div>
        </label>
        <label className="flex flex-col gap-1 w-full">
          <span className="text-teal-600 text-sm font-bold">Spotify</span>
          <div className="relative">
            <span className="flex justify-center items-center size-11 bg-[#2ebd59] absolute top-[2px] left-[2px] rounded-[4px_0_0_4px]">
              <img src={ICON_SPOTIFY} className="size-6" />
            </span>
            <input
              name="spotify"
              className="w-full h-12 text-gray-900 bg-white border-2 border-gray-300 pl-14 pr-3 rounded-md outline-offset-4 focus-visible:outline-teal-600"
              placeholder="https://open.spotify.com/playlist/xxx"
              value={spotifyUrl}
              onChange={(event) => setSpotifyUrl(event.target.value)}
            />
          </div>
        </label>
      </div>
      <button
        className="flex-none w-20 h-12 text-white px-3 rounded-md font-bold outline-offset-[3px] transition-colors enabled:bg-teal-500 enabled:hover:bg-teal-600 enabled:active:bg-teal-700 focus-visible:outline-teal-600 disabled:bg-gray-300"
        disabled={!youtubeUrl.length || !spotifyUrl.length}
        onClick={() => getYoutube()}
      >
        検索
      </button>
      {error && (
        <p>
          プレイリストがヒットしませんでした。URLを確認し、もう一度お試しください。
        </p>
      )}
      <div className="flex flex-col items-start gap-5">
        <div className="flex justify-center items-center size-full max-h-96 max-w-96 aspect-square overflow-hidden relative rounded-2xl shadow-2xl">
          {playing.type === "youtube" ? (
            <>
              <div className="flex justify-center items-center h-full aspect-video overflow-hidden absolute">
                <div className="flex justify-center items-center aspect-video blur-md scale-105">
                  <img src={playing.track.thumbnail.url} />
                </div>
              </div>
              <div className="flex items-center aspect-video overflow-hidden relative z-auto">
                <img src={playing.track.thumbnail.url} />
              </div>
            </>
          ) : (
            <img src={playing.track.thumbnail.url} />
          )}
        </div>
        <div className="flex flex-col items-stretch gap-3">
          <div className="text-gray-900 text-2xl font-bold leading-9">
            {playing.track.title}
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <span className={cvaPlaying({ type: playing.type })}>
              <img
                src={playingIconMap[playing.type ?? "youtube"]}
                className="size-5"
              />
            </span>
            <span className="text-sm">{playing.track.artist}</span>
          </div>
        </div>
      </div>
      <button
        className="flex-none w-20 h-12 text-white px-3 rounded-md font-bold outline-offset-[3px] transition-colors enabled:bg-teal-500 enabled:hover:bg-teal-600 enabled:active:bg-teal-700 focus-visible:outline-teal-600 disabled:bg-gray-300"
        onClick={() => setPlaylist((prev) => shuffle(prev))}
      >
        シャッフル
      </button>
      <ul className="flex flex-col items-stretch gap-3 w-full">
        {playlist.map(({ track }) => (
          <li key={track.id} className="flex gap-2 w-full">
            <div
              className={cvaTrackThumbnail({
                playing: track.id === playing.track.id,
              })}
            >
              <img src={track.thumbnail.url} className="size-full" />
            </div>
            <div className="flex items-stretch flex-col gap-0.5 w-[calc(100%_-_2.25rem_-_0.5rem)]">
              <div
                className={cvaTrackTitle({
                  playing: track.id === playing.track.id,
                })}
              >
                {track.title}
              </div>
              <div
                className={cvaTrackArtistName({
                  playing: track.id === playing.track.id,
                })}
              >
                {track.artist}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
