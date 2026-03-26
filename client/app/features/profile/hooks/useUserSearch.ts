import { useState, useCallback, useRef } from "react";
import {
  searchUsers,
  type UserSearchEntry,
} from "~/features/profile/services/userSearch.service";

/**
 * Hook for the public user search page with debounced API calls.
 * Returns search state, results, and query handler.
 */
export function useUserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setSearchError("");

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setResults([]);
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
    }, 300);
  }, []);

  return {
    query,
    results,
    isSearching,
    searchError,
    handleQueryChange,
  };
}
