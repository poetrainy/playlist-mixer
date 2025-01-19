import ICON_SPOTIFY_BLAND from "~/icons/icon-spotify-bland.svg";
import ICON_YOUTUBE_BLAND from "~/icons/icon-youtube-bland.svg";

export const idDevelopment = import.meta.env.DEV;

export const API_URL = idDevelopment
  ? import.meta.env.VITE_API_URL_DEVELOPMENT
  : import.meta.env.VITE_API_URL_PRODUCTION;

export const YOUTUBE_API_URI = import.meta.env.VITE_GOOGLE_CLOUD_API_URI;
export const YOUTUBE_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;

export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export const ERROR_MESSAGE_PLAYLIST_NOTFOUND =
  "プレイリストがヒットしませんでした。";
export const ERROR_MESSAGE_URL_NOTFOUND = "不明なURLです。";
export const ERROR_MESSAGE_RETRY = "URLを確認し、もう一度お試しください。";

export const SEARCH_SERVICES_BASE: {
  name: "youtube" | "spotify";
  icon: string;
  placeholder: string;
}[] = [
  {
    name: "youtube",
    icon: ICON_YOUTUBE_BLAND,
    placeholder: "https://youtube.com/playlist?list=xxx",
  },
  {
    name: "spotify",
    icon: ICON_SPOTIFY_BLAND,
    placeholder: "https://open.spotify.com/playlist/xxx",
  },
];
