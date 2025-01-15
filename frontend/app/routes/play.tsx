import type { Route } from "./+types/home";
import { useState } from "react";
import ICON_SPOTIFY_WHITE from "~/icons/icon-spotify-white.svg";
import ICON_SPOTIFY_BLAND from "~/icons/icon-spotify-bland.svg";
import ICON_YOUTUBE_WHITE from "~/icons/icon-youtube-white.svg";
import ICON_YOUTUBE_BLAND from "~/icons/icon-youtube-bland.svg";
import ICON_PLAY from "~/icons/icon-play.svg";
import ICON_PREV from "~/icons/icon-prev.svg";
import ICON_NEXT from "~/icons/icon-next.svg";
import ICON_REPEAT from "~/icons/icon-repeat.svg";
import ICON_SHUFFLE from "~/icons/icon-shuffle.svg";
import ICON_SEARCH from "~/icons/icon-search.svg";
import { getSpotifyPlaylist, getYoutubePlaylist } from "~/api/get";
import type { PlaylistType, TrackType } from "~/types/common";
import { cva } from "class-variance-authority";
import { DUMMY_SPOTIFY_TRACKS, DUMMY_YOUTUBE_TRACKS } from "~/constants/common";
import { shuffle } from "~/libraries/shuffle";
import Logo from "~/components/Logo";
import { Link, useLocation, useNavigate } from "react-router";

const currentIconMap = {
  youtube: ICON_YOUTUBE_WHITE,
  spotify: ICON_SPOTIFY_WHITE,
} as const;

const cvaControlButton = cva(
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

export async function clientLoader(): Promise<PlayLoaderType> {
  // const searchParams = new URLSearchParams(window.location.search);
  // const youtubePlaylistId = searchParams.get("youtube") ?? "";
  // const spotifyPlaylistId = searchParams.get("spotify") ?? "";

  // const youtubePlaylist = await getYoutubePlaylist(youtubePlaylistId)
  //   .then((response) => response)
  //   .catch((error) => {
  //     console.error(error);
  //     return undefined;
  //   });
  // const spotifyPlaylist = await getSpotifyPlaylist(spotifyPlaylistId)
  //   .then((response) => response)
  //   .catch((error) => {
  //     console.error(error);
  //     return undefined;
  //   });

  return {
    youtubePlaylist: undefined,
    spotifyPlaylist: undefined,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Playlist Mixer" },
    { name: "description", content: "Shuffle YouTube & Spotify Playlists" },
  ];
}

export default function Home({ loaderData }: { loaderData: PlayLoaderType }) {
  const params = new URLSearchParams(useLocation().search);
  const youtubeParams = params.get("youtube");
  const spotifyParams = params.get("spotify");

  const [youtubeUrl, setYoutubeUrl] = useState(
    `https://youtube.com/playlist?list=${youtubeParams}`
  );
  const [spotifyUrl, setSpotifyUrl] = useState(
    `https://open.spotify.com/playlist/${spotifyParams}`
  );
  const { youtubePlaylist, spotifyPlaylist } = loaderData;

  // if (!youtubePlaylist || !spotifyPlaylist) {
  //   return (
  //     <p>
  //       プレイリストがヒットしませんでした。URLを確認し、もう一度お試しください。
  //     </p>
  //   );
  // }

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

  const youtubePlaylistId = new URLSearchParams(
    new URL(youtubeUrl).searchParams
  ).get("list");
  const spotifyPlaylistId = spotifyUrl.split("playlist/")[1].split("?")[0];

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
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 py-4 px-[2.5vw] md:fixed md:inset-[0_0_auto_0] z-[1] md:bg-gray-50">
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
        <div className="flex flex-col items-start gap-6 flex-none size-fit max-w-[32rem] mx-auto md:m-0 md:pt-24 md:sticky top-0">
          <div className="flex justify-center items-center size-full md:size-[50vw] max-w-96 md:max-w-[32rem] md:max-h-[32rem] aspect-square overflow-hidden relative rounded-2xl shadow-2xl">
            {playlist[currentIndex].type === "youtube" ? (
              <>
                <img
                  src={playlist[currentIndex].track.thumbnail.url}
                  className="size-full scale-150 blur-sm absolute"
                />
                <div className="flex items-center aspect-video overflow-hidden relative z-auto shadow-2xl">
                  <img src={playlist[currentIndex].track.thumbnail.url} />
                </div>
              </>
            ) : (
              <img src={playlist[currentIndex].track.thumbnail.url} />
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
                  <img src={track.thumbnail.url} className="size-full" />
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
    </>
  );
}
