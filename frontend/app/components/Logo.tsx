import { cva } from "class-variance-authority";
import { Link } from "react-router";
import ICON_HEADPHONE from "~/icons/icon-headphone.svg";

const cvaIcon = cva([], {
  variants: {
    homePage: {
      false: ["size-5", "md:size-7"],
      true: ["size-7"],
    },
  },
});

const cvaTitle = cva([], {
  variants: {
    homePage: {
      false: ["text-xl", "md:text-3xl"],
      true: ["text-3xl"],
    },
  },
});

export default function Logo({ homePage = false }: { homePage?: boolean }) {
  return (
    <h1 className="flex-none">
      <Link
        to={{ pathname: "/" }}
        className="flex items-center gap-2 text-teal-800 font-bold outline-offset-8 focus-visible:outline-teal-600"
      >
        <img src={ICON_HEADPHONE} className={cvaIcon({ homePage })} />
        <span className={cvaTitle({ homePage })}>Playlist Mixer</span>
      </Link>
    </h1>
  );
}
