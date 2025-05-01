import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "My Shop",
  description: "My Shop Admin",
};

export default function FormLayout() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Form Layout" />
    </div>
  );
}
