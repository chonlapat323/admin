// src/hooks/useAddAdminForm.ts
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { FormFields } from "@/components/form/user/UserForm";

export function useAddMemberForm() {
  const form = useForm<FormFields>();
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
    form,
    avatarFile,
    avatarPreview,
    handleAvatarChange,
    setAvatarFile,
  };
}
