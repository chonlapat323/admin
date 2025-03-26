import { useRef, useState } from "react";

type ImageUploadProps = {
  onChange?: (file: File | null) => void;
  value?: string; // preview URL
  loading?: boolean;
};

export default function AvatarUpload({ onChange, value, loading }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hover, setHover] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (onChange) onChange(file); // ✅ ปลอดภัย
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className={`relative w-24 h-24 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer transition hover:ring-2 hover:ring-blue-400 ${
          hover ? "ring-2 ring-blue-500" : ""
        }`}
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {value ? (
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h4l2-3h6l2 3h4v13H3V7z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        )}

        {/* 🔄 Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />
      <span className="text-sm text-gray-500">Click to upload</span>
    </div>
  );
}
