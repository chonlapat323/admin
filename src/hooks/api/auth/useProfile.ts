"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/services/auth.service";
import { User } from "@/types/user";

export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { user, loading };
}
