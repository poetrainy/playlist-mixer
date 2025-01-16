import {
  API_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  YOUTUBE_API_KEY,
} from "~/constants/common";
import type { TrackType } from "~/types/common";

export const getYoutubePlaylist: (
  playlistId: string
) => Promise<TrackType[]> = async (playlistId: string) => {
  const response: Response = await fetch(
    `${API_URL}/youtube?playlistId=${playlistId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Key: YOUTUBE_API_KEY,
      },
    }
  );
  if (!response.ok) {
    throw response;
  }

  return response.json() as unknown as TrackType[];
};

export const getSpotifyPlaylist: (
  playlistId: string
) => Promise<TrackType[]> = async (playlistId: string) => {
  const response: Response = await fetch(
    `${API_URL}/spotify?playlistId=${playlistId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": SPOTIFY_CLIENT_ID,
        "Client-Secret": SPOTIFY_CLIENT_SECRET,
      },
    }
  );
  if (!response.ok) {
    throw response;
  }

  return response.json() as unknown as TrackType[];
};
