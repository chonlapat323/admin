"use client";

import UserForm from "@/components/form/user/UserForm";

export default function AddAdminPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log("✅ Submitted:", data);

    // TODO: POST ไปยัง backend
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add Admin</h1>

      <UserForm
        role="admin"
        onSubmit={(formData) => {
            const data = Object.fromEntries(formData.entries());
            console.log("📦 Data to submit:", data);
            // 🔄 ส่งไปยัง API ได้เลย
        }}
        />

    </div>
  );
}
