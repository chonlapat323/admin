// src/services/member.service.ts

import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function getMembers(page: number) {
  const res = await fetchWithAuth(`${API_URL}/users?role=member&page=${page}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch members");
  }

  return res.json();
}

export async function getMemberById(id: string) {
  const res = await fetchWithAuth(`${API_URL}/users/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch member");
  }

  return res.json();
}

export const createMember = async (formData: FormData) => {
  return await fetchWithAuth(`${API_URL}/users`, {
    method: "POST",
    body: formData,
    credentials: "include",
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
