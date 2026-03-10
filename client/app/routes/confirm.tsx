import type { Route } from "./+types/Confirm";

import LaboratoryConfirmation from "~/features/reserve/components/organism/LaboratoryConfirmation";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function Confirm() {
    return (
        <div className="flex w-full">
            <LaboratoryConfirmation />
        </div>
    );
}
