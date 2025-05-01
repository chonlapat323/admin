import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Shop Admin",
  description: "My Shop Admin",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
