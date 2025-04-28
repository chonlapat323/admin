import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import { updateAdmin } from "@/services/admin.service";
import { useForm } from "react-hook-form";
import { FormFields } from "@/types/user-form";
import { HttpError } from "@/lib/HttpError";
import { useFetchAdmin } from "./useFetchAdmin";
import { mapMemberToFormFields } from "@/lib/mapper/mapMemberToFormFields";

export function useEditAdmin() {
  const params = useParams();
  const adminId = params.id as string;
  const form = useForm<FormFields>();

  const { admin, loading } = useFetchAdmin(adminId);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();
  const { reset, setError } = form;

  useEffect(() => {
    if (admin) {
      const formFields = mapMemberToFormFields(admin);
      reset(formFields);

      if (admin.avatar_url) {
        setAvatarPreview(`${API_URL}${admin.avatar_url}`);
      }
    }
  }, [admin, reset]);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : undefined);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await updateAdmin(adminId, formData);

      toast.success("Admin updated successfully");
      router.push("/admins");
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 409) {
          setError("email", {
            type: "manual",
            message: error.message,
          });
        } else {
          toast.error(error.message || "Something went wrong");
        }
      } else {
        toast.error("Unexpected error occurred");
      }
    }
  };

  return {
    form,
    loading,
    avatarPreview,
    setAvatarPreview,
    handleAvatarChange,
    handleSubmit,
  };
}
