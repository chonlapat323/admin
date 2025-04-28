"use client";

import UserForm from "@/components/form/user/UserForm";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useEditAdmin } from "@/hooks/admins/useEditAdmin";

export default function EditAdminPage() {
  const { form, loading, avatarPreview, handleAvatarChange, handleSubmit } = useEditAdmin();

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
