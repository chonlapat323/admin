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

interface AdminUser {
  id: string;
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
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3001/users/admins`,
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

  if (!Array.isArray(admins)) {
    return <div className="p-6 text-red-500">เกิดข้อผิดพลาด: ไม่สามารถโหลดข้อมูลได้</div>;
  }
  return (
    <div className="p-6 bg-white rounded-xl dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05]">
      <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        Admin List
      </h1>

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
                  <TableRow key={admin.id}>
                    <TableCell className="px-4 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full border">
                          <Image
                            width={40}
                            height={40}
                            src={admin.avatar_url || "/images/user/default-avatar.png"}
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
