import type { UserSearchEntry } from "~/features/profile/services/userSearch.service";

interface UserSearchResultCardProps {
  user: UserSearchEntry;
  onClick: (userId: number) => void;
}

export default function UserSearchResultCard({
  user,
  onClick,
}: UserSearchResultCardProps) {
  const avatarSrc = user.profilePictureUrl || "/profile.png";

  return (
    <button
      type="button"
      className="flex items-center gap-4 rounded-lg border p-4 text-left hover:bg-accent cursor-pointer transition-colors w-full"
      onClick={() => onClick(user.id)}
    >
      <img
        src={avatarSrc}
        alt=""
        className="size-12 rounded-full object-cover flex-shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/profile.png";
        }}
      />
      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-sm text-muted-foreground truncate">
          @{user.username} &middot; {user.role}
        </span>
      </div>
    </button>
  );
}
