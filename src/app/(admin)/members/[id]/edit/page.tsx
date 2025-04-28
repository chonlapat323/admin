"use client";

import Breadcrumb from "@/components/ui/Breadcrumb";
import UserForm from "@/components/form/user/UserForm";
import { useEditMember } from "@/hooks/member/useEditMember";

export default function EditMemberPage() {
  const { form, handleSubmit, handleAvatarChange, avatarPreview, loading } = useEditMember();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl">
      <Breadcrumb items={[{ label: "Member List", href: "/members" }, { label: "Edit Member" }]} />
      <h1 className="text-2xl font-bold mb-6">Edit Member</h1>

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
