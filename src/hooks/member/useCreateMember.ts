"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { createMember } from "@/services/member.service";
import { FormFields } from "@/types/user-form";
import { HttpError } from "@/lib/HttpError";

export function useCreateMember(form: UseFormReturn<FormFields>, avatarFile: File | null) {
  const router = useRouter();
  const { setError } = form;

  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    try {
      await createMember(formData);
      toast.success("Member added successfully!");
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

  return { handleSubmit };
}
