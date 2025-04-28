import { UseFormReturn } from "react-hook-form";

export type CategoryFormFields = {
  name: string;
  description?: string;
  link?: string;
  is_active: boolean;
};

export type CategoryFormProps = {
  form: UseFormReturn<CategoryFormFields>;
  onSubmit: (form: FormData) => void;
  onImageChange?: (file: File | null) => void;
  imagePreview?: string;
  imageLoading?: boolean;
  imageFile?: File | null;
  isSave: boolean;
};
