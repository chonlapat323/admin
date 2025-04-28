import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { CreateAdminResponse } from "@/types/api/admin/CreateAdminResponse";
import { DeleteAdminResponse } from "@/types/api/admin/DeleteAdminResponse";
import { PaginatedAdminResponse } from "@/types/api/admin/ListAdminResponse";
import { Member } from "@/types/member";
import { FormFields } from "@/types/user-form";
import { UseFormReturn } from "react-hook-form";

export function getAdmins(page: number): Promise<PaginatedAdminResponse<Member>> {
  return fetchWithAuth<PaginatedAdminResponse<Member>>(`${API_URL}/users?role=admin&page=${page}`);
}

export function getAdmin(id: string): Promise<Member> {
  return fetchWithAuth<Member>(`${API_URL}/admins/${id}`);
}

export function createAdmin(formData: FormData): Promise<CreateAdminResponse> {
  return fetchWithAuth<CreateAdminResponse>(`${API_URL}/admins`, {
    method: "POST",
    body: formData,
  });
}

export function updateAdmin(id: string, formData: FormData): Promise<Member> {
  return fetchWithAuth<Member>(`${API_URL}/admins/${id}/update`, {
    method: "POST",
    body: formData,
  });
}

export function deleteAdmin(id: number): Promise<DeleteAdminResponse> {
  return fetchWithAuth<DeleteAdminResponse>(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });
}
