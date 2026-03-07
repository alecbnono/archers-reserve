import type { Route } from "./+types/profile";

import ProfileHeader from "~/features/profile/components/organism/ProfileHeader";
import ReserveLogs from "~/components/organisms/ReserveLogs";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "ArchersReserve" },
        { name: "description", content: "Your true laboratory experience" },
    ];
}

import { useAuthStore } from "~/store/user.store";

export default function Profile() {
    const currentUser = useAuthStore((state) => state.currentUser);

    return (
        <div className="flex flex-col gap-4 w-full px-4 md:px-20 py-5">
            <ProfileHeader />
            {currentUser?.role !== "ADMIN" ? (
                <div className="flex flex-col items-center gap-4">
                    <ReserveLogs isAdmin={false} canManage={true} />
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
