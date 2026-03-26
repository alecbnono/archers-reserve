import {
    Card,
    CardContent,
} from "@/components/ui/card";
import type { PublicProfile } from "~/features/profile/services/profile.service";

interface PublicProfileHeaderProps {
    profile: PublicProfile;
}

export default function PublicProfileHeader({ profile }: PublicProfileHeaderProps) {
    const avatarSrc = profile.profilePictureUrl || "/profile.png";

    return (
        <Card>
            <CardContent>
                <div className="p-6 flex flex-col md:flex-row gap-8 items-center">
                    <img
                        src={avatarSrc}
                        alt=""
                        className="size-48 min-w-48 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/profile.png";
                        }}
                    />
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold">
                            {profile.firstName} {profile.lastName}
                        </h1>
                        <p className="text-sm text-muted-foreground">{profile.role}</p>
                        {profile.bio && <p>{profile.bio}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
