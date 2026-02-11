import type { Route } from "./+types/Profile";

import ProfileHeader from "~/features/profile/components/organism/ProfileHeader";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function Profile() {
    return (
        <div className="flex flex-col gap-4 w-full md:px-20 py-5">
            <ProfileHeader />
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-semibold">Current Reservations</h1>
            </div>
        </div>
    );
}
