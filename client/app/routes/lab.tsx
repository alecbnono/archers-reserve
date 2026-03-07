import type { Route } from "./+types/lab";

import LaboratoryList from "~/features/reserve/components/organism/LaboratoryList";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function Lab() {
    return (
        <div className="flex w-full">
            <LaboratoryList />
        </div>
    );
}
