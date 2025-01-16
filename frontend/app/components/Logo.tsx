import { cva } from "class-variance-authority";
import { Link } from "react-router";
import ICON_HEADPHONE from "~/icons/icon-headphone.svg";

const cvaTitle = cva([], {
  variants: {
    homePage: {
      false: ["hidden", "md:block"],
      true: [],
    },
  },
});

export default function Logo({ homePage = false }: { homePage?: boolean }) {
  return (
    <h1>
      <Link
        to={{ pathname: "/" }}
        className="flex items-center gap-2 flex-none text-teal-800 text-3xl font-bold outline-offset-8 focus-visible:outline-teal-600"
      >
        <img src={ICON_HEADPHONE} className="size-7" />
        <span className={cvaTitle({ homePage })}>Playlist Mixer</span>
      </Link>
    </h1>
  );
}
