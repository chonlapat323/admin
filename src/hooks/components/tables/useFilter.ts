"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export const useFilter = (defaultKeys: string[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial: Record<string, string> = {};
  defaultKeys.forEach((key) => {
    const val = searchParams.get(key);
    if (val) initial[key] = val;
  });

  const [values, setValues] = useState<Record<string, string>>(initial);

  const onChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const onApply = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    router.push(`?${params.toString()}`);
  }, [router, values]);

  const onClear = () => {
    setValues({});
    router.push("?");
  };

  return {
    values,
    onChange,
    onApply,
    onClear,
  };
};
