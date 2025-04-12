"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import UserForm from "@/components/form/user/UserForm";
import Breadcrumb from "@/components/ui/Breadcrumb";

import { useAdmin } from "@/hooks/admins/useAdmin";
import { FormFields } from "@/types/user-form";

export default function EditAdminPage() {
  const params = useParams();
  const adminId = params.id as string;
  const form = useForm<FormFields>();
  const { loading, avatarPreview, handleAvatarChange, handleSubmit } = useAdmin(adminId, form);

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
