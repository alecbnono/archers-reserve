import {
    type RouteConfig,
    route,
    index,
    layout,
} from "@react-router/dev/routes";

export default [
    layout("./layouts/LandingLayout.tsx", [index("./routes/landing.tsx")]),
    layout("./layouts/DashboardLayout.tsx", [
        route("dashboard/lab", "./routes/lab.tsx"),
        route("dashboard/lab/confirm", "./routes/confirm.tsx"),
        route("dashboard/profile", "./routes/profile.tsx"),
        route("dashboard/logs", "./routes/adminLogs.tsx"),
    ]),
] satisfies RouteConfig;
