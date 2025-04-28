"use client";

import { useForm } from "react-hook-form";
import Breadcrumb from "@/components/ui/Breadcrumb";
import UserForm from "@/components/form/user/UserForm";
import { useAdminForm } from "@/hooks/admins/useAdminForm";
import { FormFields } from "@/types/user-form";
import { useCreateAdmin } from "@/hooks/admins/useCreateAdmin";

export default function AddAdminPage() {
  const form = useForm<FormFields>();
  const { avatarFile, avatarPreview, handleAvatarChange } = useAdminForm();
  const { handleSubmit } = useCreateAdmin(form, avatarFile);
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
