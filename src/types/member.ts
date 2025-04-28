export interface Member {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  phone_number?: string;
  note?: string;
  role_id: number;
  is_active: boolean;
  created_at: string;
}
