import { useState } from "react";
import { updateBio } from "~/features/profile/services/profile.service";
import { useAuthStore } from "~/store/user.store";

export function useBioEdit() {
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);
  const currentBio = useAuthStore((s) => s.currentUser?.bio ?? "");

  const [isEditing, setIsEditing] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [bioError, setBioError] = useState("");

  function startEditing() {
    setBioDraft(currentBio);
    setBioError("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setBioDraft("");
    setBioError("");
  }

  async function saveBio() {
    setIsSaving(true);
    setBioError("");

    const result = await updateBio(bioDraft);

    if (result.error) {
      setBioError(result.error);
    } else if (result.user) {
      setCurrentUser(result.user);
      setIsEditing(false);
    }

    setIsSaving(false);
  }

  return {
    isEditing,
    bioDraft,
    isSaving,
    bioError,
    setBioDraft,
    startEditing,
    cancelEditing,
    saveBio,
  };
}
