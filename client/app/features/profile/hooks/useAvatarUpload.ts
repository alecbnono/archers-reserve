import { useRef, useState } from "react";
import { uploadAvatar } from "~/features/profile/services/profile.service";
import { useAuthStore } from "~/store/user.store";

export function useAvatarUpload() {
  const setCurrentUser = useAuthStore((s) => s.setCurrentUser);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError("");

    const result = await uploadAvatar(file);

    if (result.error) {
      setUploadError(result.error);
    } else if (result.user) {
      setCurrentUser(result.user);
    }

    setIsUploading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return {
    fileInputRef,
    isUploading,
    uploadError,
    openFilePicker,
    handleFileChange,
  };
}
