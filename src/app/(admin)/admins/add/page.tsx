"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Breadcrumb from "@/components/ui/Breadcrumb";
import UserForm from "@/components/form/user/UserForm";
import { useState } from "react";
import type { FormFields } from "@/components/form/user/UserForm"
import { fetchWithAuth } from "@/lib/fetchWithAuth";
export default function AddAdminPage() {
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();

  const {
  } = useForm(); // 👈 ถ้าใช้แค่ setError ก็ดึงแบบนี้พอ
  const form = useForm<FormFields>();
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setAvatarPreview(undefined);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await fetchWithAuth("http://localhost:3001/admins", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!res.ok) {
      toast.error("Failed to create admin.");
      if (res.status === 409) {
        form.setError("email", {
          type: "manual",
          message: "Email นี้ถูกใช้งานแล้ว",
        });
      }
      return;
    }

    toast.success("Admin added successfully!");
    router.push("/admins");
  };

  return (
    <div className="max-w-2xl">
      <Breadcrumb
        items={[
          { label: "Admin List", href: "/admins" },
          { label: "Add Admin" },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Add Admin</h1>

      <UserForm
        role="admin"
        form={form} // 👈 ส่งทั้ง form object ไป
        onSubmit={handleSubmit}
        onAvatarChange={handleAvatarChange}
        avatarPreview={avatarPreview}
      />
    </div>
  );
}
