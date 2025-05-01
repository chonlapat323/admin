"use client";

import { Loader2 } from "lucide-react";

export default function CenteredSpinner() {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}
