type ThumbnailImageType = {
  url: string;
  width: number;
  height: number;
};

export type ThumbnailType = {
  default: ThumbnailImageType;
  medium?: ThumbnailImageType;
  high?: ThumbnailImageType;
  standard?: ThumbnailImageType;
  maxres?: ThumbnailImageType;
};

export type TrackType = {
  id: string;
  title: string;
  artist: string;
  thumbnail: ThumbnailType;
  album?: string;
  url?: string;
};

export type PlaylistType = {
  type: "youtube" | "spotify";
  track: TrackType;
};
