"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow, TableCell } from "@/components/ui/table";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { PencilIcon, TrashBinIcon } from "@/icons";

type SortableCategoryRowProps = {
  category: {
    id: number;
    name: string;
    is_active: boolean;
    image: string | null;
  };
  isDeleting: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function SortableCategoryRow({
  category,
  isDeleting,
  onEdit,
  onDelete,
}: SortableCategoryRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: category.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`transition-opacity duration-300 ${isDeleting ? "opacity-0" : "opacity-100"}`}
    >
      <TableCell>
        <Image
          src={
            category.image
              ? `${process.env.NEXT_PUBLIC_API_URL}${category.image}`
              : "/images/placeholder.png"
          }
          alt={`Image of ${category.name}`}
          width={48}
          height={48}
          className="w-12 h-12 object-cover rounded-md border"
          unoptimized
        />
      </TableCell>
      <TableCell className="text-left py-3">{category.name}</TableCell>
      <TableCell className="text-left py-3">
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            category.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {category.is_active ? "Active" : "Inactive"}
        </span>
      </TableCell>
      <TableCell className="text-left py-3">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onEdit(category.id)}
            size="sm"
            variant="outline"
            startIcon={<PencilIcon />}
          >
            Edit
          </Button>
          <Button
            onClick={() => onDelete(category.id)}
            size="sm"
            variant="outline"
            startIcon={<TrashBinIcon />}
            className="!text-red-600 border-red-200 hover:border-red-400 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
