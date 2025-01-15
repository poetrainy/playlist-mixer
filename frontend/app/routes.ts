import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routes: RouteConfig = [
  index("routes/home.tsx"),
  route("play", "routes/play.tsx"),
] satisfies RouteConfig;

export default routes;
