import type { PlaylistType, ThumbnailType } from "~/types/common";

export const shuffle: (
  playlist: PlaylistType[],
  currentIndex?: number
) => PlaylistType[] = (playlist: PlaylistType[], currentIndex = 0) => {
  const currentTrack = playlist[currentIndex];
  const newPlaylist = [
    ...playlist.slice(0, currentIndex),
    ...playlist.slice(currentIndex + 1),
  ];

  for (let i = newPlaylist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newPlaylist[i], newPlaylist[j]] = [newPlaylist[j], newPlaylist[i]];
  }

  return [currentTrack, ...newPlaylist];
};

export const getThumbnailURL: (thumbnail: ThumbnailType) => string = (
  thumbnail: ThumbnailType
) => {
  if (thumbnail.maxres) {
    return thumbnail.maxres.url;
  } else if (thumbnail.standard) {
    return thumbnail.standard.url;
  } else if (thumbnail.high) {
    return thumbnail.high.url;
  } else if (thumbnail.medium) {
    return thumbnail.medium.url;
  } else {
    return thumbnail.default.url;
  }
};
