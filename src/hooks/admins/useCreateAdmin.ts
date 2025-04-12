import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { createAdmin } from "@/services/admin.service";
import { FormFields } from "@/types/user-form";

export function useCreateAdmin(form: UseFormReturn<FormFields>, avatarFile: File | null) {
  const router = useRouter();
  const { setError } = form;

  const handleSubmit = async (formData: FormData) => {
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const res = await createAdmin(formData);

    if (!res.ok) {
      toast.error("Failed to create admin.");
      if (res.status === 409) {
        setError("email", {
          type: "manual",
          message: "Email นี้ถูกใช้งานแล้ว",
        });
      }
      return;
    }

    toast.success("Admin added successfully!");
    router.push("/admins");
  };

  return { handleSubmit };
}
