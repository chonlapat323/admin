"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { FormFields } from "@/components/form/user/UserForm";
import UserForm from "@/components/form/user/UserForm";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useMember } from "@/hooks/useMember";
import { updateMember } from "@/services/member.service";

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params.id as string;

  const form = useForm<FormFields>();
  const { reset, setError } = form;

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { member, loading, avatarPreview, setAvatarPreview } = useMember(adminId, reset);

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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <Breadcrumb items={[{ label: "Member List", href: "/members" }, { label: "Edit Member" }]} />
      <h1 className="text-2xl font-bold mb-6">Edit Admin</h1>

      <UserForm
        form={form}
        onSubmit={handleSubmit}
        role="member"
        avatarPreview={avatarPreview}
        onAvatarChange={handleAvatarChange}
        isSave={false}
      />
    </div>
  );
}
