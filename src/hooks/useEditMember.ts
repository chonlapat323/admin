// src/hooks/useEditMember.ts
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateMember } from "@/services/member.service";
import { useMember } from "./useMember";
import type { FormFields } from "@/components/form/user/UserForm";

export function useEditMember() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;

  const form = useForm<FormFields>();
  const { reset, setError } = form;

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { loading, avatarPreview, setAvatarPreview } = useMember(adminId, reset);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    } else {
      setAvatarPreview(undefined);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    const res = await updateMember(adminId, formData);

    if (!res.ok) {
      toast.error("Update failed");
      if (res.status === 409) {
        setError("email", {
          type: "manual",
          message: "Email นี้ถึกใช้งานแล้ว",
        });
      }
      return;
    }

    toast.success("Member updated successfully");
    router.push("/members");
  };

  return {
    form,
    handleSubmit,
    handleAvatarChange,
    avatarPreview,
    loading,
  };
}
