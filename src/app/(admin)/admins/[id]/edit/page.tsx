"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FormFields } from "@/components/form/user/UserForm";
import UserForm from "@/components/form/user/UserForm";
import { API_URL } from "@/lib/config"; // ✅ ใช้ BASE API URL
import Breadcrumb from "@/components/ui/Breadcrumb";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;

  const form = useForm<FormFields>();
  const { reset, setError } = form;

  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // ✅ โหลดข้อมูล admin
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
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล error:"+err);
        router.push("/admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId, reset, router]);

  // ✅ handle avatar change
  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      console.log(previewUrl);
      setAvatarPreview(previewUrl);
    } else {
      setAvatarPreview(undefined);
    }
  };

  // ✅ เมื่อ submit
  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
        formData.append("avatar", avatarFile); // ✅ แนบเฉพาะตอนมีจริง
    }
    const res = await fetchWithAuth(`${API_URL}/admins/${adminId}/update`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
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
    <Breadcrumb
        items={[
        { label: "Admin List", href: "/admins" },
        { label: "Edit Admin" },
        ]}
    />
    <h1 className="text-2xl font-bold mb-6">Edit Admin</h1>

    <UserForm
        form={form}
        onSubmit={handleSubmit}
        role="admin"
        avatarPreview={avatarPreview}
        onAvatarChange={handleAvatarChange}
      />
    </div>
  );
}
