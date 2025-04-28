"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getMemberById } from "@/services/member.service";
import { Member } from "@/types/member";

export function useFetchMember(memberId: string) {
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await getMemberById(memberId);
        setMember(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load member data");
        setError("Failed to load member data");
        router.push("/members");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId, router]);

  return { member, loading, error };
}
