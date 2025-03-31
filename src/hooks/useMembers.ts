// src/hooks/useMembers.ts

import { useEffect, useState } from "react";
import { getMembers } from "@/services/member.service";
import { Member } from "@/types/member";
import { toast } from "sonner";

export function useMembers(page: number) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getMembers(page);
        setMembers(data.items || data);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
        toast.error("โหลดข้อมูลล้มเหลว");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page]);

  return {
    members,
    loading,
    totalPages,
    setMembers,
  };
}
