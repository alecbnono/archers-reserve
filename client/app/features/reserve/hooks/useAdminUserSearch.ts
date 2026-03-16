import { useState, useCallback, useRef } from "react";
import {
  searchUsers,
  type SearchableUser,
} from "~/features/reserve/services/adminUserSearch.service";

/**
 * Hook for admin user search with debounced API calls.
 * Returns search state, results, selected user, and handlers.
 */
export function useAdminUserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchableUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [selectedUser, setSelectedUser] = useState<SearchableUser | null>(null);
  const [showResults, setShowResults] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setSearchError("");

    // If user was selected and query changes, clear selection
    setSelectedUser(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const result = await searchUsers(trimmed);
      setIsSearching(false);

      if (result.error) {
        setSearchError(result.error);
        setResults([]);
      } else {
        setResults(result.users ?? []);
      }
      setShowResults(true);
    }, 300);
  }, []);

  const handleSelectUser = useCallback((user: SearchableUser) => {
    setSelectedUser(user);
    setQuery(user.username);
    setShowResults(false);
    setResults([]);
  }, []);

  const handleClearUser = useCallback(() => {
    setSelectedUser(null);
    setQuery("");
    setResults([]);
    setShowResults(false);
  }, []);

  return {
    query,
    results,
    isSearching,
    searchError,
    selectedUser,
    showResults,
    handleQueryChange,
    handleSelectUser,
    handleClearUser,
  };
}
