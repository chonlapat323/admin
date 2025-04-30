export type FilterOption = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: { label: string; value: string }[];
};

export type FilterBarProps = {
  filters: FilterOption[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onApply: () => void;
  onClear?: () => void;
};
