"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FormFields } from "@/components/form/user/UserForm";
import UserForm from "@/components/form/user/UserForm";
import Breadcrumb from "@/components/ui/Breadcrumb";

import { useAdmin } from "@/hooks/useAdmin";
import { updateAdmin } from "@/services/admin.service";

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;

  const form = useForm<FormFields>();
  const { reset, setError } = form;

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { loading, avatarPreview, setAvatarPreview } = useAdmin(adminId, reset);

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

    const res = await updateAdmin(adminId, formData);

    if (!res.ok) {
      toast.error("Update failed");
      if (res.status === 409) {
        setError("email", {
          type: "manual",
          message: "Email นี้ถูกใช้งานแล้ว",
        });
      }
      return;
    }

    toast.success("Admin updated successfully");
    router.push("/admins");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <Breadcrumb items={[{ label: "Admin List", href: "/admins" }, { label: "Edit Admin" }]} />
      <h1 className="text-2xl font-bold mb-6">Edit Admin</h1>

      <UserForm
        form={form}
        onSubmit={handleSubmit}
        role="admin"
        avatarPreview={avatarPreview}
        onAvatarChange={handleAvatarChange}
        isSave={false}
      />
    </div>
  );
}
