import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes: RouteConfig = [
  index("routes/home.tsx"),
  // route("player", "routes/player.tsx"),
] satisfies RouteConfig;

export default routes;
