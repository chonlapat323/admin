import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { createAdmin } from "@/services/admin.service";
import { FormFields } from "@/types/user-form";
import { HttpError } from "@/lib/HttpError";

export function useCreateAdmin(form: UseFormReturn<FormFields>, avatarFile: File | null) {
  const router = useRouter();
  const { setError } = form;

  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    try {
      const res = await createAdmin(formData);
      toast.success("Admin added successfully!");
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

  return { handleSubmit };
}
