"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function useProfile() {
  const { user, reloadProfile } = useAuth();

  useEffect(() => {
    // โหลด profile ครั้งแรก
    reloadProfile();

    // subscribe event
    const handler = () => reloadProfile();
    window.addEventListener("auth:refresh", handler);

    return () => window.removeEventListener("auth:refresh", handler);
  }, [reloadProfile]);

  return { user };
}
