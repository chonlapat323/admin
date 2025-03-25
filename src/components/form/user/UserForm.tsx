"use client";

import ImageUpload from "@/components/ui/upload/AvatarUpload";
import { useState } from "react";

type UserFormProps = {
  role?: "admin" | "member";
  onSubmit: (form: FormData) => void;
};

const UserForm = ({ role = "member", onSubmit }: UserFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null); // เคลียร์ error
    onSubmit(formData);
  };



  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const handleImageChange = (file: File | null) => {
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      // สมมุติว่าคุณจะ upload
      setUploading(true);
      setTimeout(() => {
        setUploading(false); // เสร็จแล้ว
        console.log("✅ Upload complete", file);
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl w-full space-y-5 text-left">
      {/* First + Last Name */}
      <div className="block text-sm font-medium text-gray-700 mb-1">
        <div>
        <h2>Upload Avatar</h2>
        <ImageUpload value={previewUrl!} onChange={handleImageChange} loading={uploading} />
        {selectedFile && (
            <p>ไฟล์ที่เลือก: {selectedFile.name}</p>
        )}
        {/* ส่วนอื่นๆ ของ Component ของคุณ */}
        </div>
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            required
            placeholder="First Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            required
            placeholder="Last Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Password"
          autoComplete="new-password"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          placeholder="Confirm Password"
          autoComplete="new-password"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm font-medium -mt-3">{error}</div>
      )}

      {/* Role Dropdown (only if admin) */}
      {role === "admin" && (
        <div>
          <label htmlFor="role_id" className="block text-sm font-medium text-gray-700 mb-1">
            Select Role
          </label>
          <select
            name="role_id"
            id="role_id"
            defaultValue="1"
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="1">Admin</option>
            <option value="2">Supervisor</option>
          </select>
        </div>
      )}

      {/* Phone Number */}
      <div>
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="phone_number"
          name="phone_number"
          type="text"
          placeholder="Phone Number"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      {/* Is Active */}
      <div className="flex items-center gap-2">
        <input
          id="is_active"
          name="is_active"
          type="checkbox"
          defaultChecked
          className="w-4 h-4"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
          Active
        </label>
      </div>

      {/* Note */}
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          Note <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Note"
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
