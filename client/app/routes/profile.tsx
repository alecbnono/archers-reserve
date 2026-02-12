import type { Route } from "./+types/Profile";

import ProfileHeader from "~/features/profile/components/organism/ProfileHeader";
import ReserveLogs from "~/components/organisms/ReserveLogs";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

export default function Profile() {
    return (
        <div className="flex flex-col gap-4 w-full px-4 md:px-20 py-5">
            <ProfileHeader />
            <div className="flex flex-col items-center gap-4">
                <ReserveLogs />
            </div>
        </div>
    );
}
