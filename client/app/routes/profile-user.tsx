import { useParams } from "react-router";
import PublicProfileHeader from "~/features/profile/components/organism/PublicProfileHeader";
import ReserveLogs from "~/components/organisms/ReserveLogs";
import { usePublicProfile } from "~/features/profile/hooks/usePublicProfile";

export default function ProfileUser() {
    const { userId } = useParams<{ userId: string }>();
    const numericId = Number(userId);

    const { profile, reservations, isLoading, error } = usePublicProfile(
        isNaN(numericId) ? null : numericId,
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 w-full px-4 md:px-20 py-5">
                <p className="text-muted-foreground text-center py-8">
                    Loading profile...
                </p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col gap-4 w-full px-4 md:px-20 py-5">
                <p className="text-destructive text-center py-8">
                    {error || "Profile not found"}
                </p>
            </div>
        );
    }

    // Dummy no-op cancel since public profile view is read-only
    const noOpCancel = async () => false;

    return (
        <div className="flex flex-col gap-4 w-full px-4 md:px-20 py-5">
            <PublicProfileHeader profile={profile} />
            <div className="flex flex-col items-center gap-4">
                <ReserveLogs
                    reservations={reservations}
                    isLoading={false}
                    error=""
                    isAdmin={false}
                    canManage={false}
                    onCancel={noOpCancel}
                    cancellingBatchId={null}
                    cancelError=""
                />
            </div>
        </div>
    );
}
