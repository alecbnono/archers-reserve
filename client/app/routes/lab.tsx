import type { Route } from "./+types/Lab";

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
