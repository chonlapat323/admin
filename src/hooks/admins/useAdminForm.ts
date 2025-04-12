import { useState } from "react";

export function useAdminForm() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(undefined);
    }
  };

  return {
    avatarFile,
    avatarPreview,
    handleAvatarChange,
  };
}
