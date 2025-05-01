"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Pagination from "@/components/tables/Pagination";
import ConfirmModal from "@/components/ui/modal/ConfirmModal";
import { PencilIcon, TrashBinIcon } from "@/icons";
import { useOrderActions } from "@/hooks/orders/useOrderActions";
import { getOrderStatusColor, getOrderStatusLabel } from "@/utils/orders/order-status";
import { formatDate } from "@/utils/format-date";
import Link from "next/link";
import { OrderStatus } from "@/types/orders/order";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterOption } from "@/types/components/tables/FilterBar";
import { useFilter } from "@/hooks/components/tables/useFilter";
import FilterBar from "@/components/tables/FilterBar";

export default function AdminOrderListPage() {
  const [page, setPage] = useState(1);
  const limit = 5;
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("search") || "";

  const filterOptions: FilterOption[] = [
    {
      key: "search",
      label: "Search",
      type: "text",
    },
  ];

  const { values, onChange, onClear } = useFilter(["search"]);

  const { orders, totalPages, isLoading, isError, handleCancelOrder } = useOrderActions(
    page,
    limit,
    search
  );
  const handleOpenCancelModal = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedOrderId) {
      try {
        await handleCancelOrder(selectedOrderId);
        toast.success("Order cancelled successfully.");
        setShowCancelModal(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to cancel the order.");
      }
    }
  };

  const onApply = () => {
    const params = new URLSearchParams();
    if (values.search) params.set("search", values.search);
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <FilterBar
        filters={filterOptions}
        values={values}
        onChange={onChange}
        onApply={onApply}
        onClear={onClear}
      />
      <div className="p-6 bg-white rounded-xl dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.05]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Order List</h2>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow className="font-semibold">
                  <TableCell className="px-4 py-3 font-medium text-left">Order #</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Customer</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Total</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Status</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Date</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Tracking</TableCell>
                  <TableCell className="px-4 py-3 font-medium text-left">Action</TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell className="text-center py-6">Loading...</TableCell>
                  </TableRow>
                ) : isError || orders.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-center py-6">No orders found</TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="px-4 py-3 text-left">{order.order_number}</TableCell>
                      <TableCell className="px-4 py-3 text-left">
                        {order.shipping_address?.full_name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left">
                        ฿{order.total_price.toLocaleString()}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left">
                        <span className={`font-medium ${getOrderStatusColor(order.order_status)}`}>
                          {getOrderStatusLabel(order.order_status)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left">
                        {formatDate(order.created_at)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left">
                        {order.tracking_number && order.order_status !== OrderStatus.cancelled ? (
                          <div className="relative flex items-center justify-left group">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                              Copy
                            </button>

                            {/* Pop Hover */}
                            <div className="absolute bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition">
                              Tracking: 123
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-left">
                        <div className="flex gap-2">
                          <Link href={`/orders/${order.id}/edit`}>
                            <Button size="sm" variant="outline" startIcon={<PencilIcon />}>
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            startIcon={<TrashBinIcon />}
                            className="!text-red-600 border-red-200 hover:border-red-400 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                            onClick={() => handleOpenCancelModal(order.id)}
                          >
                            Cancel
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

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}

        <ConfirmModal
          open={showCancelModal}
          title="Cancel Order?"
          description="Are you sure you want to cancel this order? This action cannot be undone."
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowCancelModal(false)}
        />
      </div>
    </>
  );
}
