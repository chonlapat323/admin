import { Member } from "@/types/member";
import { FormFields } from "@/types/user-form";

export function mapMemberToFormFields(member: Member): FormFields {
  return {
    first_name: member.first_name ?? "",
    last_name: member.last_name ?? "",
    email: member.email ?? "",
    role_id: member.role_id.toString(),
    phone_number: member.phone_number ?? "",
    is_active: member.is_active,
    note: member.note ?? "",
    password: "",
    confirm_password: "",
  };
}
