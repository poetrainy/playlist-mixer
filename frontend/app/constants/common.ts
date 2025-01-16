import type { TrackType } from "~/types/common";

export const idDevelopment = import.meta.env.DEV;

export const API_URL = idDevelopment
  ? import.meta.env.VITE_API_URL_DEVELOPMENT
  : import.meta.env.VITE_API_URL_PRODUCTION;

export const YOUTUBE_API_URI = import.meta.env.VITE_GOOGLE_CLOUD_API_URI;
export const YOUTUBE_API_KEY = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;

export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const SPOTIFY_CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
