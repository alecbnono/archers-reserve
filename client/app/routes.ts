import {
    type RouteConfig,
    route,
    index,
    layout,
} from "@react-router/dev/routes";

export default [
    layout("./layouts/LandingLayout.tsx", [index("./routes/landing.tsx")]),
    layout("./layouts/DashboardLayout.tsx", [
        route("lab", "./routes/lab.tsx"),
        route("lab/confirm", "./routes/confirm.tsx"),
    ]),
] satisfies RouteConfig;
