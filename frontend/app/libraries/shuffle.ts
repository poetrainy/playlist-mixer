import type { PlaylistType } from "~/types/common";

export const shuffle = (playlist: PlaylistType[]) => {
  let newPlaylist = [...playlist];
  for (let i = newPlaylist.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newPlaylist[i], newPlaylist[j]] = [newPlaylist[j], newPlaylist[i]];
  }

  return newPlaylist;
};
