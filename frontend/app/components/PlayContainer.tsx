import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import Logo from "~/components/Logo";
import ICON_SEARCH from "~/icons/icon-search.svg";
import ICON_HOURGLASS from "~/icons/icon-hourglass.svg";
import { cvaControlButton } from "~/routes/play";
import {
  SEARCH_SERVICES_BASE,
  ERROR_MESSAGE_RETRY,
  ERROR_MESSAGE_URL_NOTFOUND,
} from "~/constants/common";
import { navigateWithSearchParams } from "~/libraries/common";

export default function PlayContainer({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const params = new URLSearchParams(useLocation().search);
  const youtubeParams = params.get("youtube");
  const spotifyParams = params.get("spotify");

  const [youtubeURL, setYoutubeURL] = useState(
    `https://youtube.com/playlist?list=${youtubeParams}`
  );
  const [spotifyURL, setSpotifyURL] = useState(
    `https://open.spotify.com/playlist/${spotifyParams}`
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => setIsLoading(false), [youtubeParams, spotifyParams]);

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
    <>
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-10 py-4 px-[2.5vw] md:fixed md:inset-[0_0_auto_0] z-[1] md:bg-gray-50">
        <Logo />
        <div className="relative">
          <div className="flex items-center gap-1 md:gap-3 w-full md:max-w-[50rem] md:h-12 text-gray-900 bg-white border-2 border-gray-300 py-1 pl-3 pr-2 md:pl-5 md:pr-4 rounded-2xl md:rounded-full">
            <div className="flex flex-col flex-grow md:flex-row gap-0.5 md:gap-4">
              {searchServices.map(
                ({ name, icon, placeholder, value, onChange }) => (
                  <label key={name} className="flex items-center gap-1 w-full">
                    <img src={icon} className="flex-none size-6" />
                    <input
                      name={name}
                      className="w-full h-7 bg-transparent px-1 focus-visible:outline-teal-600 disabled:text-gray-400"
                      placeholder={placeholder}
                      value={value}
                      disabled={isLoading}
                      onChange={(event) => onChange(event)}
                    />
                  </label>
                )
              )}
            </div>
            <button
              className={cvaControlButton({ type: "search", isLoading })}
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
              <img
                src={isLoading ? ICON_HOURGLASS : ICON_SEARCH}
                className="size-5"
              />
            </button>
          </div>
          {isError && (
            <p className="text-sm font-bold absolute -bottom-7 left-4 md:left-6">
              {`${ERROR_MESSAGE_URL_NOTFOUND}`}
            </p>
          )}
        </div>
      </div>
      <main className="flex justify-center md:justify-between items-stretch flex-col md:flex-row gap-[2vw] w-[95vw] max-w-[60rem] m-auto">
        {children}
      </main>
    </>
  );
}
