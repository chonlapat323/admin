"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Breadcrumb from "@/components/ui/Breadcrumb";
import UserForm from "@/components/form/user/UserForm";
import type { FormFields } from "@/components/form/user/UserForm";
import { useAdminForm } from "@/hooks/useAdminForm";
import { createAdmin } from "@/services/admin.service";

export default function AddAdminPage() {
  const router = useRouter();
  const form = useForm<FormFields>();
  const { setError } = form;

  const { avatarFile, avatarPreview, handleAvatarChange } = useAdminForm();

  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await createAdmin(formData);

    if (!res.ok) {
      toast.error("Failed to create admin.");
      if (res.status === 409) {
        setError("email", {
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
      <Breadcrumb items={[{ label: "Admin List", href: "/admins" }, { label: "Add Admin" }]} />
      <h1 className="text-2xl font-bold mb-6">Add Admin</h1>

      <UserForm
        role="admin"
        form={form}
        onSubmit={handleSubmit}
        onAvatarChange={handleAvatarChange}
        avatarPreview={avatarPreview}
        isSave={true}
      />
    </div>
  );
}
