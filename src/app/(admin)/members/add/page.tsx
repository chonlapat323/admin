"use client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import UserForm from "@/components/form/user/UserForm";
import { useCreateMember } from "@/hooks/member/useCreateMember";
import { useMemberForm } from "@/hooks/member/useMemberForm";
import { FormFields } from "@/types/user-form";
import { useForm } from "react-hook-form";

export default function AddMemberPage() {
  const form = useForm<FormFields>();
  const { avatarFile, avatarPreview, handleAvatarChange } = useMemberForm();
  const { handleSubmit } = useCreateMember(form, avatarFile);

  return (
    <div className="max-w-2xl">
      <Breadcrumb items={[{ label: "Member List", href: "/members" }, { label: "Add Member" }]} />
      <h1 className="text-2xl font-bold mb-6">Add Member</h1>
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
