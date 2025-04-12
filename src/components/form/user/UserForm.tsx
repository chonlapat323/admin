"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import AvatarUpload from "@/components/ui/upload/AvatarUpload";
import { FormFields } from "@/types/user-form";

type UserFormProps = {
  form: UseFormReturn<FormFields>;
  role?: "admin" | "member";
  onSubmit: (form: FormData) => void;
  onAvatarChange?: (file: File | null) => void;
  avatarPreview?: string;
  avatarLoading?: boolean;
  isSave: boolean;
};

const UserForm = ({
  form,
  role = "member",
  onSubmit,
  onAvatarChange,
  avatarPreview,
  avatarLoading,
  isSave,
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setFocus,
    formState: { errors, touchedFields },
    watch,
  } = form;

  const password = watch("password");
  const confirmPassword = watch("confirm_password");

  useEffect(() => {
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        setError("confirm_password", {
          type: "manual",
          message: "Passwords do not match",
        });
      } else {
        clearErrors("confirm_password");
      }
    } else {
      clearErrors("confirm_password");
    }
  }, [password, confirmPassword, setError, clearErrors]);

  useEffect(() => {
    if (errors.email) {
      setFocus("email");

      const element = document.getElementById("email");
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors.email, setFocus]);

  const onFormSubmit = (data: FormFields) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "password" && !value) return;
      if (key === "confirm_password") return;
      if (key === "last_login" || key === "created_at" || key === "updated_at") return; // ✅ ข้าม field ที่ไม่ควรส่ง
      formData.append(key, value?.toString() ?? "");
    });
    onSubmit(formData);
  };

  const roleNameMap = {
    admin: "Admin",
    member: "Member",
    supervisor: "Supervisor",
  };

  const buttonLabel = `${!isSave ? "Update" : "Add"} ${roleNameMap[role] || "User"}`;

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="max-w-xl w-full space-y-5 text-left"
      autoComplete="off"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Avatar</label>
        <AvatarUpload value={avatarPreview} onChange={onAvatarChange} loading={avatarLoading} />
      </div>

      <div>
        <label>First Name</label>
        <input
          {...register("first_name", { required: "First name is required" })}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.first_name && touchedFields.first_name && (
          <p className="text-red-600 text-sm">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <label>Last Name</label>
        <input
          {...register("last_name", { required: "Last name is required" })}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.last_name && touchedFields.last_name && (
          <p className="text-red-600 text-sm">{errors.last_name.message}</p>
        )}
      </div>

      <div>
        <label>Email</label>
        <input
          id="email"
          type="email"
          {...register("email", { required: "Email is required" })}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          autoComplete="new-email"
        />
        {errors.email && touchedFields.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label>Confirm Password</label>
        <input
          type="password"
          {...register("confirm_password")}
          className="w-full border px-3 py-2 rounded-md"
        />
        {errors.confirm_password && touchedFields.confirm_password && (
          <p className="text-red-600 text-sm">{errors.confirm_password.message}</p>
        )}
      </div>

      {role === "admin" && (
        <div>
          <label>Select Role</label>
          <select {...register("role_id")} className="w-full border px-3 py-2 rounded-md">
            <option value="1">Admin</option>
            <option value="2">Supervisor</option>
          </select>
        </div>
      )}

      <div>
        <label>Phone Number</label>
        <input {...register("phone_number")} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} defaultChecked className="w-4 h-4" />
        <label>Active</label>
      </div>

      <div>
        <label>Note</label>
        <textarea {...register("note")} rows={3} className="w-full border px-3 py-2 rounded-md" />
      </div>

      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {buttonLabel}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
