import { useEffect, useState } from "react";
import { getAdmins } from "@/services/admin.service";
import { Member } from "@/types/member";
import { toast } from "sonner";

export function useAdmins(page: number) {
  const [admins, setAdmins] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getAdmins(page);
        setAdmins(data.items || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
        toast.error("โหลดข้อมูลแอดมินล้มเหลว");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page]);

  return {
    admins,
    loading,
    totalPages,
    setAdmins,
  };
}
