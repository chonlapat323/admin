"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Breadcrumb from "@/components/ui/Breadcrumb";
import UserForm from "@/components/form/user/UserForm";
import { useAddMemberForm } from "@/hooks/useAddMemberForm";
import { createMember } from "@/services/member.service";

export default function AddMemberPage() {
  const router = useRouter();
  const { form, avatarFile, avatarPreview, handleAvatarChange } = useAddMemberForm();

  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await createMember(formData);

    if (!res.ok) {
      toast.error("Failed to create member.");
      if (res.status === 409) {
        form.setError("email", {
          type: "manual",
          message: "Email นี้ถูกใช้งานแล้ว",
        });
      }
      return;
    }

    toast.success("Member added successfully!");
    router.push("/members");
  };

  return (
    <div className="max-w-2xl">
      <Breadcrumb items={[{ label: "Member List", href: "/members" }, { label: "Add Member" }]} />
      <h1 className="text-2xl font-bold mb-6">Add Admin</h1>

      <UserForm
        role="member"
        form={form}
        onSubmit={handleSubmit}
        onAvatarChange={handleAvatarChange}
        avatarPreview={avatarPreview}
        isSave={true}
      />
    </div>
  );
}
