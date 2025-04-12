"use client";

import { useForm, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/ui/Breadcrumb";
import UserForm from "@/components/form/user/UserForm";
import { useAdminForm } from "@/hooks/admins/useAdminForm";
import { FormFields } from "@/types/user-form";
import { useCreateAdmin } from "@/hooks/admins/useCreateAdmin";
export type AdminFormFields = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role_id: number;
  is_active: boolean;
};
export default function AddAdminPage() {
  const form = useForm<FormFields>();
  const { avatarFile, avatarPreview, handleAvatarChange } = useAdminForm();
  const { handleSubmit } = useCreateAdmin(form, avatarFile);
  const methods = useForm<AdminFormFields>({
    defaultValues: {
      is_active: true,
      role_id: 2,
    },
  });
  return (
    <FormProvider {...methods}>
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
    </FormProvider>
  );
}
