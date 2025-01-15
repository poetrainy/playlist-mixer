import { Link } from "react-router";
import ICON_HEADPHONE from "~/icons/icon-headphone.svg";

export default function Logo() {
  return (
    <h1>
      <Link
        to={{ pathname: "/" }}
        className="flex items-center gap-2 flex-none text-teal-800 text-3xl font-bold outline-offset-8 focus-visible:outline-teal-600"
      >
        <img src={ICON_HEADPHONE} className="size-7" />
        <span className="hidden md:block">Playlist Mixer</span>
      </Link>
    </h1>
  );
}
