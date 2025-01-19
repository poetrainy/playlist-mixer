import { cva } from "class-variance-authority";
import type { Route } from "./+types/home";
import { useState } from "react";
import { useNavigate } from "react-router";
import Logo from "~/components/Logo";
import { navigateWithSearchParams } from "~/libraries/common";
import {
  SEARCH_SERVICES_BASE,
  ERROR_MESSAGE_RETRY,
  ERROR_MESSAGE_URL_NOTFOUND,
} from "~/constants/common";

const cvaButton = cva(
  [
    "flex",
    "items-center",
    "justify-center",
    "flex-none",
    "min-w-20",
    "h-12",
    "text-white",
    "px-3",
    "rounded-md",
    "font-bold",
    "outline-offset-[3px]",
    "transition-colors",

    "focus-visible:outline-teal-600",
  ],
  {
    variants: {
      isLoading: {
        false: [
          "enabled:bg-teal-500",
          "enabled:hover:bg-teal-600",
          "enabled:active:bg-teal-700",
          "disabled:bg-gray-300",
        ],
        true: ["bg-teal-500", "opacity-30", "cursor-wait"],
      },
    },
  }
);

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Playlist Mixer" },
    { name: "description", content: "Shuffle YouTube & Spotify Playlists" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const [youtubeURL, setYoutubeURL] = useState("");
  const [spotifyURL, setSpotifyURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const servicesMap = {
    youtube: {
      value: youtubeURL,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        setYoutubeURL(event.target.value),
    },
    spotify: {
      value: spotifyURL,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        setSpotifyURL(event.target.value),
    },
  };

  const searchServices = SEARCH_SERVICES_BASE.map((service) => ({
    ...service,
    ...servicesMap[service.name],
  }));

  return (
    <main className="flex flex-col items-center gap-8 py-40 px-[2.5vw]">
      <Logo homePage />
      <div className="flex flex-col justify-between items-end gap-2.5 w-full md:max-w-2xl">
        {searchServices.map(({ name, icon, placeholder, value, onChange }) => (
          <label key={name} className="flex items-center gap-1 w-full relative">
            <img src={icon} className="flex-none size-6 absolute left-4" />
            <input
              name={name}
              className="w-full h-12  bg-white border-2 border-gray-300 pl-12 pr-4 rounded-full outline-offset-4 focus-visible:outline-teal-600 disabled:text-gray-400"
              placeholder={placeholder}
              value={value}
              disabled={isLoading}
              onChange={(event) => onChange(event)}
            />
          </label>
        ))}
      </div>
      <div className="flex flex-col items-center gap-4">
        <button
          className={cvaButton({ isLoading })}
          onClick={() =>
            navigateWithSearchParams(
              navigate,
              youtubeURL,
              spotifyURL,
              setIsLoading,
              setIsError
            )
          }
          disabled={!youtubeURL.length || !spotifyURL.length || isLoading}
        >
          {isLoading ? "Loading..." : "Play!"}
        </button>
        {isError && (
          <p className="text-sm font-bold">
            {`${ERROR_MESSAGE_URL_NOTFOUND}${ERROR_MESSAGE_RETRY}`}
          </p>
        )}
      </div>
    </main>
  );
}
