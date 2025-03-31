import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAdmin(adminId: string, reset: any) {
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch(`${API_URL}/admins/${adminId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load admin");

        const data = await res.json();
        reset(data);

        if (data.avatar_url) {
          setAvatarPreview(`${API_URL}${data.avatar_url}`);
        }
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        router.push("/admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId, reset, router]);

  return {
    loading,
    avatarPreview,
    setAvatarPreview,
  };
}
