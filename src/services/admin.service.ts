import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function getAdmins(page: number) {
  const res = await fetchWithAuth(`${API_URL}/users?role=admin&page=${page}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch admins");
  }

  return res.json();
}

export async function createAdmin(formData: FormData) {
  console.log(formData);
  const res = await fetchWithAuth(`${API_URL}/admins`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return res;
}

export async function updateAdmin(id: string, formData: FormData) {
  const res = await fetchWithAuth(`${API_URL}/admins/${id}/update`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return res;
}

export async function deleteAdmin(id: number) {
  const res = await fetchWithAuth(`${API_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete admin");
  }

  return res.json();
}
