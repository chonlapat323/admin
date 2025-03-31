// src/hooks/useMember.ts
import { useEffect, useState } from "react";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getMemberById } from "@/services/member.service";

export function useMember(memberId: string, reset: any) {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMemberById(memberId);
        setMember(data);
        reset(data);

        if (data.avatar_url) {
          setAvatarPreview(`${API_URL}${data.avatar_url}`);
        }
      } catch (err) {
        toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        router.push("/members");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [memberId, reset, router]);

  return { member, loading, avatarPreview, setAvatarPreview };
}
