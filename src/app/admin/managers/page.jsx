"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { RefreshCw, AlertCircle } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import { Alert } from "@/components/ui/alert";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import PharmacyListSkeleton from "@/components/_skeletons/pharmacy-list-skeleton";
import AddManagers from "@/components/_dialogs/AddManagers";
import EditManagers from "@/components/_dialogs/EditMangers";
import ViewManagers from "@/components/_dialogs/ViewManagers";
import DeleteManagers from "@/components/_dialogs/DeleteManagers";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";

export default function MangersPage() {
  const [managers, setManagers] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    request: getAllMangers,
    loading: managersLoading,
    error: managersError,
  } = useAxios();

  const { request: updateManagerBlockUnblock } = useAxios();

  const [loadingId, setLoadingId] = useState(null);

  // Debounced function using lodash
  const debounceSearch = useCallback(
    debounce((val) => {
      setSearchQuery(val);
      setCurrentPage(1); // Reset page on search
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    debounceSearch(val);
  };

  useEffect(() => {
    const fetchManagers = async () => {
      const ITEMS_PER_PAGE = 10;
      const trimmedSearchQuery = searchQuery.trim();

      const endpoint = trimmedSearchQuery
        ? `/superadmin/search-event-manager?search=${trimmedSearchQuery}&limit=${ITEMS_PER_PAGE}`
        : `/superadmin/get-all-event-managers?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;

      try {
        const { data, error } = await getAllMangers({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        if (!error && data?.data) {
          setManagers(data?.data?.data || data?.data || []);
          setTotalPages(data?.data?.totalPages || 1);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchManagers();
  }, [searchQuery, currentPage, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleBlockUnblock = async (managerId) => {
    setLoadingId(managerId);
    try {
      const { data, error } = await updateManagerBlockUnblock({
        method: "PUT",
        url: `/superadmin/block-unblock-event-manager`,
        authRequired: true,
        payload: { managerId },
      });

      if (error) {
        showToast("error", "Failed to update status");
        return;
      }
      console.log(data, "Data from managers");

      const updatedStatus = data?.data?.isBlocked ;
      console.log(updatedStatus, "Updated Status");

      setManagers((prev) =>
        prev.map((p) =>
          p._id === managerId ? { ...p, isBlocked: updatedStatus } : p
        )
      );

      showToast("success", `${data.message || "Status updated successfully."}`);
    } catch (err) {
      showToast("error", "Unexpected error while updating status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <h2 className="text-xl font-bold">Event Managers</h2>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Input
              placeholder="Search by name or email..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-[250px]"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={managersLoading}
                className="cursor-pointer"
              >
                <RefreshCw className="w-5 h-5 mr-1" /> Refresh
              </Button>
              <AddManagers
                onSuccess={(addedPharmacy) => {
                  if (!addedPharmacy) return;
                   setCurrentPage(1);
                  setRefreshKey((prev) => prev + 1);
                }}
              />
            </div>
          </div>
        </div>

        {managersError && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {managersError || "Failed to fetch Mangers."}</span>
          </Alert>
        )}

        {managersLoading ? (
          <PharmacyListSkeleton />
        ) : managers.length > 0 ? (
          <>
            <Table>
              <TableHeader className="font-bold">
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Blocked</TableCell>
                  <TableCell className="text-center">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager?._id}>
                    <TableCell>{manager?.name || "N/A"}</TableCell>
                    <TableCell>{manager?.phone || "N/A"}</TableCell>
                    <TableCell>{manager?.email || "N/A"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={!!manager.isBlocked}
                        onCheckedChange={() => handleBlockUnblock(manager._id)}
                        disabled={loadingId === manager._id}
                      />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <EditManagers
                        managers={manager}
                        onSuccess={(editedManager) => {
                          if (!editedManager) return;
                          setManagers((prev) =>
                            prev.map((p) =>
                              p._id === editedManager._id
                                ? editedManager
                                : p
                            )
                          );
                        }}
                      />
                      <ViewManagers managers={manager} />
                      <DeleteManagers
                        managers={manager}
                        onSuccess={(managerId) => {
                          if (!managerId) return;
                          setManagers((prev) =>
                            prev.filter((p) => p._id !== managerId)
                          );
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!searchQuery && (
              <div className="pt-4">
                <Pagination>
                  <PaginationContent className="justify-center">
                    <PaginationItem className="cursor-pointer">
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        className={
                          currentPage === 1 ? "pointer-events-none opacity-50" : ""
                        }
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <span className="text-muted-foreground text-sm px-4">
                        Page {currentPage} of {totalPages}
                      </span>
                    </PaginationItem>

                    <PaginationItem className="cursor-pointer">
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            prev < totalPages ? prev + 1 : prev
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            No Managers found.
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
