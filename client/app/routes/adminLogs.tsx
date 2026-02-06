import type { Route } from "./+types/adminLogs";

import AdminReserveLogs from "~/features/admin/components/organism/adminReserveLogs";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function adminLogs() {
    return (
        <div className="flex w-full">
           <AdminReserveLogs />
        </div>
    );
}