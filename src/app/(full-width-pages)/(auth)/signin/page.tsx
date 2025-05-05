"use client";
import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Shop Admin",
  description: "My Shop Admin",
};

export default function SignIn() {
  return <SignInForm />;
}
