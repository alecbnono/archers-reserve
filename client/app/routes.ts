import {
    type RouteConfig,
    route,
    index,
    layout,
} from "@react-router/dev/routes";

export default [
    layout("./layouts/LandingLayout.tsx", [index("./routes/landing.tsx")]),
] satisfies RouteConfig;
