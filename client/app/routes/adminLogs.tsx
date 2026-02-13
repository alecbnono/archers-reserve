import type { Route } from "./+types/adminLogs";
import FilterLaboratory from "~/features/reserve/components/organism/FilterLaboratory";
import ReserveLogs from "~/components/organisms/ReserveLogs";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function adminLogs() {
    return (
        <div className="flex w-full">
            <div className="flex flex-col gap-6 p-2 md:p-8 w-full">
                <h1 className="text-3xl font-bold ml-4">Reservation Logs</h1>
                <div className="flex md:flex-row justify-end flex-col gap-4">
                    <FilterLaboratory />
                    <ReserveLogs isAdmin={true} canManage={true} />
                </div>
            </div>
        </div>
    );
}
