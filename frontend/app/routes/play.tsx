import type { Route } from "./+types/home";
import { useState } from "react";
import ICON_SPOTIFY_WHITE from "~/icons/icon-spotify-white.svg";
import ICON_YOUTUBE_WHITE from "~/icons/icon-youtube-white.svg";
import ICON_PLAY from "~/icons/icon-play.svg";
import ICON_PREV from "~/icons/icon-prev.svg";
import ICON_NEXT from "~/icons/icon-next.svg";
import ICON_REPEAT from "~/icons/icon-repeat.svg";
import ICON_SHUFFLE from "~/icons/icon-shuffle.svg";
import type { PlaylistType, TrackType } from "~/types/common";
import { cva } from "class-variance-authority";
import { DUMMY_SPOTIFY_TRACKS, DUMMY_YOUTUBE_TRACKS } from "~/constants/dummy";
import { getThumbnailURL, shuffle } from "~/libraries/common";
import { getSpotifyPlaylist, getYoutubePlaylist } from "~/api/get";
import PlayContainer from "~/components/PlayContainer";
import type { ClientLoaderFunctionArgs, MetaArgs } from "react-router";
import {
  ERROR_MESSAGE_PLAYLIST_NOTFOUND,
  ERROR_MESSAGE_RETRY,
} from "~/constants/common";

const currentIconMap = {
  youtube: ICON_YOUTUBE_WHITE,
  spotify: ICON_SPOTIFY_WHITE,
} as const;

export const cvaControlButton = cva(
  [
    "flex",
    "items-center",
    "justify-center",
    "rounded-lg",
    "flex-none",

    "focus-visible:outline",
    "focus-visible:outline-teal-600",
    "focus-visible:outline-2",
    "focus-visible:outline-offset-[3px]",

    "disabled:opacity-30",
  ],
  {
    variants: {
      variant: {
        fill: [
          "enabled:bg-teal-500",
          "enabled:hover:bg-teal-600",
          "enabled:active:bg-teal-700",
          "disabled:bg-gray-300",
        ],
        ghost: [
          "bg-transparent",
          "enabled:hover:bg-gray-200",
          "enabled:active:bg-gray-300",
        ],
      },
      type: {
        prev: ["size-12", "md:size-14", "pr-0.5"],
        next: ["size-12", "md:size-14", "pl-0.5"],
        play: ["size-14", "md:size-20"],
        option: ["w-[calc(50%_-_-0.25rem)]", "h-8", "md:h-10"],
        search: ["size-8"],
      },
      isLoading: {
        false: [],
        true: ["cursor-wait"],
      },
    },
    defaultVariants: {
      variant: "ghost",
    },
  }
);

const cvaTrack = cva(
  [
    "flex",
    "justify-start",
    "gap-2",
    "w-full",
    "p-2",
    "rounded",
    "-outline-offset-1",
    "overflow-hidden",

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

type PlayLoaderType = {
  youtubePlaylist: TrackType[] | undefined;
  spotifyPlaylist: TrackType[] | undefined;
};

export async function clientLoader({
  request,
}: ClientLoaderFunctionArgs): Promise<PlayLoaderType> {
  const searchParams = new URL(request.url).searchParams;
  const youtubePlaylistId = searchParams.get("youtube");
  const spotifyPlaylistId = searchParams.get("spotify");

  if (!youtubePlaylistId || !spotifyPlaylistId) {
    return {
      youtubePlaylist: undefined,
      spotifyPlaylist: undefined,
    };
  }

  const youtubePlaylist = await getYoutubePlaylist(youtubePlaylistId)
    .then((response) => response)
    .catch((error) => {
      console.error(error);
      return undefined;
    });
  const spotifyPlaylist = await getSpotifyPlaylist(spotifyPlaylistId)
    .then((response) => response)
    .catch((error) => {
      console.error(error);
      return undefined;
    });

  return {
    youtubePlaylist,
    spotifyPlaylist,
  };
}

export function HydrateFallback() {
  return (
    <PlayContainer>
      <p className="pt-8 md:pt-32">Loading...</p>
    </PlayContainer>
  );
}

export function meta({}: MetaArgs) {
  return [
    { title: "Playlist Mixer" },
    { name: "description", content: "Shuffle YouTube & Spotify Playlists" },
  ];
}

export default function Home({ loaderData }: { loaderData: PlayLoaderType }) {
  const { youtubePlaylist, spotifyPlaylist } = loaderData;

  if (!youtubePlaylist || !spotifyPlaylist) {
    return (
      <PlayContainer>
        <p className="pt-8 md:pt-32">
          {`${ERROR_MESSAGE_PLAYLIST_NOTFOUND}${ERROR_MESSAGE_RETRY}`}
        </p>
      </PlayContainer>
    );
  }

  const [playlist, setPlaylist] = useState<PlaylistType[]>([
    ...(youtubePlaylist ?? DUMMY_YOUTUBE_TRACKS).map((track) => ({
      type: "youtube" as const,
      track,
    })),
    ...(spotifyPlaylist ?? DUMMY_SPOTIFY_TRACKS).map((track) => ({
      type: "spotify" as const,
      track,
    })),
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repeat, setRepeat] = useState(false);

  return (
    <PlayContainer>
      <main className="flex justify-center md:justify-between items-stretch flex-col md:flex-row gap-[2vw] w-[95vw] max-w-[60rem] m-auto">
        <div className="flex flex-col items-start gap-6 flex-none size-fit max-w-[32rem] mx-auto md:m-0 md:pt-24 md:sticky top-0">
          <div className="flex justify-center items-center size-full md:size-[50vw] max-w-96 md:max-w-[32rem] md:max-h-[32rem] aspect-square overflow-hidden relative rounded-2xl shadow-2xl">
            {playlist[currentIndex].type === "youtube" ? (
              <>
                <img
                  src={getThumbnailURL(playlist[currentIndex].track.thumbnail)}
                  className="size-full scale-150 blur-sm absolute"
                />
                <div className="flex items-center aspect-video overflow-hidden relative z-auto shadow-2xl">
                  <img
                    src={getThumbnailURL(
                      playlist[currentIndex].track.thumbnail
                    )}
                  />
                </div>
              </>
            ) : (
              <img src={playlist[currentIndex].track.thumbnail.default.url} />
            )}
          </div>
          <div className="flex flex-col items-stretch gap-2 flex-grow w-full md:w-[50vw] max-w-96 md:max-w-[32rem]">
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
          <div className="w-full h-3 bg-gray-200 rounded-full relative after:block after:w-[70%] after:h-full after:bg-teal-500 after:absolute after:rounded-full" />
          <div className="flex items-center justify-between flex-col gap-1 w-full px-10 md:px-12">
            <div className="flex items-center justify-between w-full">
              <button
                className={cvaControlButton({ type: "prev" })}
                aria-label="前の曲へ"
                onClick={() => setCurrentIndex((prev) => prev - 1)}
              >
                <img src={ICON_PREV} className="size-8" />
              </button>
              <button className={cvaControlButton({ type: "play" })}>
                <img src={ICON_PLAY} className="size-10 md:size-12" />
              </button>
              <button
                className={cvaControlButton({ type: "next" })}
                aria-label="次の曲へ"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                <img src={ICON_NEXT} className="size-8" />
              </button>
            </div>
            <div className="flex gap-2 w-full">
              <button
                className={cvaControlButton({ type: "option" })}
                aria-label="リピート"
                onClick={() => setRepeat(!repeat)}
              >
                <img src={ICON_REPEAT} className="size-5" />
              </button>
              <button
                className={cvaControlButton({ type: "option" })}
                aria-label="シャッフル"
                onClick={() => {
                  setPlaylist(shuffle(playlist, currentIndex));
                  setCurrentIndex(0);
                }}
              >
                <img src={ICON_SHUFFLE} className="size-5" />
              </button>
            </div>
          </div>
        </div>
        <ul className="flex flex-col items-stretch gap-1.5 flex-grow w-full max-w-xl md:max-w-full mx-auto md:m-0 md:pt-24 pb-8 overflow-hidden">
          {playlist.map(({ track }, index) => (
            <li key={track.id + index} className="w-full">
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
                  <img
                    src={track.thumbnail.default.url}
                    className="size-full"
                  />
                </div>
                <div className="flex items-stretch flex-col flex-grow overflow-hidden">
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
    </PlayContainer>
  );
}
