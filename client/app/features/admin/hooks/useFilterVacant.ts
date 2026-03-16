import { useState } from "react";

export function useAdminLogFilters() {
  const [showVacant, setShowVacant] = useState(false);

  const toggleShowVacant = () => setShowVacant((prev) => !prev);

  return {
    showVacant,
    toggleShowVacant,
    setShowVacant,
  };
}
