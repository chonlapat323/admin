import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAdmin } from "@/services/admin.service";
import { Member } from "@/types/member";

export function useFetchAdmin(adminId: string) {
  const [admin, setAdmin] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const data = await getAdmin(adminId);
        setAdmin(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load admin data");
        setError("Failed to load admin data");
        router.push("/admins");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId, router]);

  return { admin, loading, error };
}
