"use client";

import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import AvatarUpload from "@/components/ui/upload/AvatarUpload";

type UserFormProps = {
  form: UseFormReturn<FormFields>; // 👈 รับ form object มา
  role?: "admin" | "member";
  onSubmit: (form: FormData) => void;
  onAvatarChange?: (file: File | null) => void;
  avatarPreview?: string;
  avatarLoading?: boolean;
};

export type FormFields = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role_id: string;
  phone_number?: string;
  is_active: boolean;
  note?: string;
};

const UserForm = ({
  role = "member",
  form,
  onSubmit,
  onAvatarChange,
  avatarPreview,
  avatarLoading,
}: UserFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    form.trigger("confirm_password");
  }, [watch("password")]);


  const onFormSubmit = (data: FormFields) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) =>
      formData.append(key, value.toString())
    );
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      autoComplete="off"
      className="max-w-xl w-full space-y-5 text-left"
    >
      {/* Avatar Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Avatar
        </label>
        <AvatarUpload
          value={avatarPreview}
          onChange={onAvatarChange}
          loading={avatarLoading}
        />
      </div>

      {/* First Name */}
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          {...register("first_name", { required: "First name is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {errors.first_name && (
          <p className="text-red-600 text-sm">{errors.first_name.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="last_name">Last Name</label>
        <input
          {...register("last_name", { required: "Last name is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {errors.last_name && (
          <p className="text-red-600 text-sm">{errors.last_name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          autoComplete="new-email"
          inputMode="email"
          {...register("email", { required: "Email is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          autoComplete="new-password"
          {...register("password", { required: "Password is required" })}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirm_password">Confirm Password</label>
        <input
            type="password"
            {...register("confirm_password", {
              required: "Please confirm password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        {errors.confirm_password && (
          <p className="text-red-600 text-sm">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      {/* Role */}
      {role === "admin" && (
        <div>
          <label htmlFor="role_id">Select Role</label>
          <select
            {...register("role_id")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="1">Admin</option>
            <option value="2">Supervisor</option>
          </select>
        </div>
      )}

      {/* Phone Number */}
      <div>
        <label htmlFor="phone_number">Phone Number</label>
        <input
          {...register("phone_number")}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Active Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("is_active")}
          defaultChecked
          className="w-4 h-4"
        />
        <label>Active</label>
      </div>

      {/* Note */}
      <div>
        <label htmlFor="note">Note</label>
        <textarea
          {...register("note")}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {role === "admin" ? "Add Admin" : "Add Member"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
