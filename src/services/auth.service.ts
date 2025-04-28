import { AuthStatusResponse, User } from "@/types/user";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_URL } from "@/lib/config";

export async function getProfile(): Promise<User | null> {
  const data = await fetchWithAuth<AuthStatusResponse>(`${API_URL}/auth/status`);
  return data.user;
}
