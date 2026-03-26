import { Input } from "@/components/ui/input";
import { Button } from "~/components/ui/button";
import type { SearchableUser } from "~/features/reserve/services/adminUserSearch.service";

interface AdminUserSearchProps {
  label?: string;
  query: string;
  results: SearchableUser[];
  isSearching: boolean;
  searchError: string;
  selectedUser: SearchableUser | null;
  showResults: boolean;
  onQueryChange: (value: string) => void;
  onSelectUser: (user: SearchableUser) => void;
  onClearUser: () => void;
}

export default function AdminUserSearch({
  label = "Reserve for user",
  query,
  results,
  isSearching,
  searchError,
  selectedUser,
  showResults,
  onQueryChange,
  onSelectUser,
  onClearUser,
}: AdminUserSearchProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>

      {selectedUser ? (
        <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <div className="flex flex-col grow">
            <span className="font-medium">
              {selectedUser.firstName} {selectedUser.lastName}
            </span>
            <span className="text-muted-foreground text-xs">
              @{selectedUser.username} &middot; {selectedUser.email} &middot; {selectedUser.role}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearUser}
            type="button"
          >
            Change
          </Button>
        </div>
      ) : (
        <div className="relative">
          <Input
            type="search"
            placeholder="Search by username, name, or email..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            autoComplete="off"
          />

          {showResults && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-48 overflow-y-auto">
              {isSearching ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : searchError ? (
                <div className="px-3 py-2 text-sm text-destructive">
                  {searchError}
                </div>
              ) : results.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No users found
                </div>
              ) : (
                results.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                    onClick={() => onSelectUser(user)}
                  >
                    <span className="font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      @{user.username} &middot; {user.email} &middot; {user.role}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}