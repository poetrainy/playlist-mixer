export type TrackType = {
  id: string;
  title: string;
  artist: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  album?: string;
  url?: string;
};

export type PlaylistType = {
  type: "youtube" | "spotify";
  track: TrackType;
};
