"use client";

import { useState } from "react";
import UserForm from "@/components/form/user/UserForm";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function AddAdminPage() {
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

  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
  
    const res = await fetch("http://localhost:3001/admins", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  
    const result = await res.json();
  
    if (!res.ok) {
      alert("❌ Failed: " + result.message);
      return;
    }
  
    alert("✅ Admin created!");
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
        onSubmit={handleSubmit}
        onAvatarChange={handleAvatarChange}
        avatarPreview={avatarPreview}
        />

    </div>
  );
}
