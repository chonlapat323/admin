// src/hooks/admins/useAdmin.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import { updateAdmin } from "@/services/admin.service";
import { UseFormReturn } from "react-hook-form";
import { FormFields } from "@/types/user-form";

export function useAdmin(adminId: string, form: UseFormReturn<FormFields>) {
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();
  const { reset, setError } = form;

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`${API_URL}/admins/${adminId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load admin");

        const data = await res.json();
        reset(data);

        if (data.avatar_url) {
          setAvatarPreview(`${API_URL}${data.avatar_url}`);
        }
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        router.push("/admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId, reset, router]);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : undefined);
  };

  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await updateAdmin(adminId, formData);

    if (!res.ok) {
      toast.error("Update failed");
      if (res.status === 409) {
        setError("email", {
          type: "manual",
          message: "Email นี้ถึงได้รับการใช้",
        });
      }
      return;
    }

    toast.success("Admin updated successfully");
    router.push("/admins");
  };

  return {
    loading,
    avatarPreview,
    setAvatarPreview,
    handleAvatarChange,
    handleSubmit,
  };
}
