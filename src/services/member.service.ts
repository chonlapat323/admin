import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { CreateAdminResponse } from "@/types/api/admin/CreateAdminResponse";
import { PaginatedAdminResponse } from "@/types/api/admin/ListAdminResponse";
import { Member } from "@/types/member";

export function getMembers(
  page: number,
  limit: number,
  search: string
): Promise<PaginatedAdminResponse<Member>> {
  const params = new URLSearchParams({
    role: "member",
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.set("search", search);
  }

  return fetchWithAuth<PaginatedAdminResponse<Member>>(`${API_URL}/users?${params.toString()}`);
}

export function getMemberById(id: string): Promise<Member> {
  return fetchWithAuth<Member>(`${API_URL}/users/${id}`);
}

export const createMember = async (formData: FormData): Promise<CreateAdminResponse> => {
  return await fetchWithAuth<CreateAdminResponse>(`${API_URL}/users`, {
    method: "POST",
    body: formData,
  });
};

export async function updateMember(id: string, formData: FormData) {
  return fetchWithAuth(`${API_URL}/users/${id}/update`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
}

export const deleteMember = async (id: number) => {
  return await fetchWithAuth(`${API_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
