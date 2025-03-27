"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "@/components/tables/Pagination";
import Button from "@/components/ui/button/Button";
import { PencilIcon,TrashBinIcon } from "@/icons";
import { API_URL } from "@/lib/config";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import Link from "next/link";
import { deleteAdmin } from "@/lib/api/admin";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role_id: number;
  created_at: string;
}

const UserRoleMap: Record<number, string> = {
  1: "Admin",
  2: "Supervisor",
  3: "Member",
};

export default function AdminUserPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);


  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const res = await fetchWithAuth(
          `${API_URL}/users/admins`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setAdmins(data.items || data);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
  
    setDeletingId(id);
  
    setTimeout(async () => {
      try {
        await deleteAdmin(id);
        setAdmins((prev) => prev.filter((admin) => admin.id !== id));
        setDeletingId(null);
      } catch (error) {
        console.error("❌ Delete error:", error);
        alert("Delete failed");
        setDeletingId(null);
      }
    }, 300); // 300ms คือความยาวของ transition
  };

  if (!Array.isArray(admins)) {
    return <div className="p-6 text-red-500">เกิดข้อผิดพลาด: ไม่สามารถโหลดข้อมูลได้</div>;
  }
  return (
    <div className="p-6 bg-white rounded-xl dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05]">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-semibold text-gray-800">Admin List</h2>
      <Link
        href="/admins/add"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7m0 0V3m0 4h4m-4 0H12m-2 8a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z"
          />
        </svg>
        <span className="font-medium">Add Member</span>
      </Link>
    </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="px-4 py-3 font-medium text-left">Name</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Role</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Create Date</TableCell>
                <TableCell className="px-4 py-3 font-medium text-left">Action</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell  className="text-center py-6">
                    กำลังโหลด...
                  </TableCell>
                </TableRow>
              ) : admins.length === 0 ? (
                <TableRow>
                  <TableCell  className="text-center py-6">
                    ไม่พบผู้ดูแลระบบ
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id} className={`transition-opacity duration-300 ${
                    deletingId === admin.id ? "opacity-0" : "opacity-100"
                  }`} >
                    <TableCell className="px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full border">
                          <Image
                            width={40}
                            height={40}
                            src={`${process.env.NEXT_PUBLIC_API_URL}${admin.avatar_url}` || "/images/user/default-avatar.png"}
                            alt={admin.first_name || "user"}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 dark:text-white/90">
                            {admin.first_name} {admin.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      <Badge
                        
                        size="sm"
                      >
                        {UserRoleMap[admin.role_id]}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                      {new Date(admin.created_at).toLocaleDateString("th-TH")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-left">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        startIcon={<PencilIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                       onClick={() => handleDelete(admin.id)}
                        size="sm"
                        variant="outline"
                        startIcon={<TrashBinIcon  />}
                        className="!text-red-600 border-red-200 hover:border-red-400 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
}
