import { useEffect, useState } from "react";
import { getAdmins } from "@/services/admin.service";
import { Member } from "@/types/member";
import { toast } from "sonner";

export function useAdmins(page: number, limit: number, search: string) {
  const [admins, setAdmins] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const result = await getAdmins(page, limit, search);
        setAdmins(result.data || []);
        setTotalPages(result.pageCount || 1);
      } catch (err) {
        console.error(err);
        toast.error("โหลดข้อมูลแอดมินล้มเหลว");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, limit, search]);

  return {
    admins,
    loading,
    totalPages,
    setAdmins,
  };
}
