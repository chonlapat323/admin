// src/lib/fetchWithAuth.ts
import { API_URL } from "@/lib/config";
export const fetchWithAuth = async (
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> => {
    let response = await fetch(input, {
      ...init,
      credentials: "include", // ✅ ต้องมีเพื่อให้แนบ cookie
    });
    console.log("🌐 Fetching:", input);
    console.log("🍪 Cookie?", document.cookie);
    console.log("📡 Response status:", response.status);
    if (response.status === 401) {
      // ลอง refresh token
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
  
      if (refreshRes.ok) {
        // ได้ access token ใหม่แล้ว → เรียก API ซ้ำ
        response = await fetch(input, {
          ...init,
          credentials: "include",
        });
      } else {
        console.error("❌ Refresh token ล้มเหลว → redirect ไป /signin");
        window.location.href = "/signin"; // ❗ Redirect ผู้ใช้ออกจากระบบ
      }
    }
  
    return response;
  };
  