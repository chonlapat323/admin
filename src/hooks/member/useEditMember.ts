"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import { updateMember } from "@/services/member.service";
import { useForm } from "react-hook-form";
import { FormFields } from "@/types/user-form";
import { HttpError } from "@/lib/HttpError";
import { useFetchMember } from "./useFetchMember";
import { mapMemberToFormFields } from "@/lib/mapper/mapMemberToFormFields";

export function useEditMember() {
  const params = useParams();
  const memberId = params.id as string;
  const form = useForm<FormFields>();

  const { member, loading } = useFetchMember(memberId);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const router = useRouter();
  const { reset, setError } = form;

  useEffect(() => {
    if (member) {
      const formFields = mapMemberToFormFields(member);
      reset(formFields);

      if (member.avatar_url) {
        setAvatarPreview(`${API_URL}${member.avatar_url}`);
      }
    }
  }, [member, reset]);

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : undefined);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await updateMember(memberId, formData);

      toast.success("Member updated successfully");
      router.push("/members");
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
