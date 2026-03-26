import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { useUserSearch } from "~/features/profile/hooks/useUserSearch";
import UserSearchResultCard from "~/features/profile/components/molecule/UserSearchResultCard";

export default function UsersPage() {
  const navigate = useNavigate();
  const { query, results, isSearching, searchError, handleQueryChange } =
    useUserSearch();

  const handleUserClick = (userId: number) => {
    navigate(`/dashboard/profile/${userId}`);
  };

  return (
    <div className="flex flex-col gap-6 w-full px-4 md:px-20 py-5">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground text-sm">
          Search for users by name or username.
        </p>
      </div>

      <Input
        type="search"
        placeholder="Search by username, first name, or last name..."
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        autoComplete="off"
      />

      {isSearching && (
        <p className="text-sm text-muted-foreground">Searching...</p>
      )}

      {searchError && (
        <p className="text-sm text-destructive">{searchError}</p>
      )}

      {!isSearching && !searchError && query.trim().length > 0 && results.length === 0 && (
        <p className="text-sm text-muted-foreground">No users found.</p>
      )}

      {results.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((user) => (
            <UserSearchResultCard
              key={user.id}
              user={user}
              onClick={handleUserClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
