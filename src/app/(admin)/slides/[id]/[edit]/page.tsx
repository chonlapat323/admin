"use client";

import SlideForm from "@/components/form/slide/SlideForm";
import { useEditSlide } from "@/hooks/slides/useEditSlide";

export default function EditSlidePage() {
  const { form, imageUrls, setImageUrls, handleSubmit, loading } = useEditSlide();

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 dark:border-white/[0.05] dark:bg-white/[0.03]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">แก้ไขสไลด์</h2>
      {!loading && (
        <SlideForm
          form={form}
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          onSubmit={handleSubmit}
          isSave={false}
        />
      )}
    </div>
  );
}
