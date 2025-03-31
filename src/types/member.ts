// src/types/member.ts

export interface Member {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role_id: number;
  created_at: string;
}
