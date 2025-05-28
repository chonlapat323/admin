"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "@/types/user";

// กำหนด type สำหรับ context
type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  reloadProfile: () => Promise<void>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadProfile = useCallback(async () => {
    const { getProfile } = await import("@/services/auth.service");
    const data = await getProfile();
    setUser(data);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, reloadProfile, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
