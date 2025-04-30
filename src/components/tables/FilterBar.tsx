"use client";

import { FilterBarProps } from "@/types/components/tables/FilterBar";

export default function FilterBar({ filters, values, onChange, onApply, onClear }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end bg-white p-4 border rounded-md my-4">
      {filters.map((filter) => (
        <div key={filter.key} className="flex flex-col">
          <label className="text-sm font-medium mb-1">{filter.label}</label>
          {filter.type === "text" && (
            <input
              type="text"
              value={values[filter.key] || ""}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className="border px-3 py-1 rounded-md"
            />
          )}
          {filter.type === "select" && (
            <select
              value={values[filter.key] || ""}
              onChange={(e) => onChange(filter.key, e.target.value)}
              className="border px-3 py-1 rounded-md"
            >
              <option value="">ทั้งหมด</option>
              {filter.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      <button
        onClick={onApply}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Apply
      </button>

      {onClear && (
        <button onClick={onClear} className="ml-2 text-gray-600 hover:underline text-sm">
          Clear
        </button>
      )}
    </div>
  );
}
