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
import AddGatekeeper from "@/components/_dialogs/AddGatekeeper";
import EditGatekeeper from "@/components/_dialogs/EditGateKeeper";
import ViewGatekeeper from "@/components/_dialogs/ViewGatekeeper";
import DeleteGatekeeper from "@/components/_dialogs/DeleteGatekeeper";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import ViewScanHistory from "@/components/_dialogs/ViewScanHistory";

export default function GatekeeperPage() {
  const [gatekeepers, setGatekeeper] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    request: getAllGatekeeper,
    loading: gatekeeperLoading,
    error: gatekeeperError,
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
    const fetchGatekeeper = async () => {
      const ITEMS_PER_PAGE = 10;
      const trimmedSearchQuery = searchQuery.trim();

      const endpoint = trimmedSearchQuery
        ? `/superadmin/search-gatekeeper?search=${trimmedSearchQuery}&limit=${ITEMS_PER_PAGE}`
        : `/superadmin/get-all-gatekeepers?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;

      try {
        const { data, error } = await getAllGatekeeper({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        console.log(data, "Data from managers");
        if (!error && data?.data) {
        setGatekeeper(data?.data?.data || data?.data || []);
          setTotalPages(data.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchGatekeeper();
  }, [searchQuery, currentPage, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleBlockUnblock = async (gatekeeperId) => {
    setLoadingId(gatekeeperId);
    try {
      const { data, error } = await updateManagerBlockUnblock({
        method: "PUT",
        url: `/superadmin/block-unblock-gatekeeper`,
        authRequired: true,
        payload: { gatekeeperId },
      });

      console.log(data, "Data from gatekeeper");

      if (error) {
        showToast("error", "Failed to update status");
        return;
      }
      console.log(data, "Data from managers");

      const updatedStatus = data?.data?.isBlocked ;
      console.log(updatedStatus, "Updated Status");

      setGatekeeper((prev) =>
        prev.map((p) =>
          p._id === gatekeeperId ? { ...p, isBlocked: updatedStatus } : p
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
          <h2 className="text-xl font-bold">Gatekeepers</h2>
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
                disabled={gatekeeperLoading}
                className="cursor-pointer"
              >
                <RefreshCw className="w-5 h-5 mr-1" /> Refresh
              </Button>
              <AddGatekeeper
                onSuccess={(addedGatekeeper) => {
                  if (!addedGatekeeper) return;
                   setCurrentPage(1);
                  setRefreshKey((prev) => prev + 1);
                }}
              />
            </div>
          </div>
        </div>

        {gatekeeperError && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {gatekeeperError || "Failed to fetch Mangers."}</span>
          </Alert>
        )}

        {gatekeeperLoading ? (
          <PharmacyListSkeleton />
        ) : gatekeepers.length > 0 ? (
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
                {gatekeepers.map((gatekeeper) => (
                  <TableRow key={gatekeeper?._id}>
                    <TableCell>{gatekeeper?.name || "N/A"}</TableCell>
                    <TableCell>{gatekeeper?.phone || "N/A"}</TableCell>
                    <TableCell>{gatekeeper?.email || "N/A"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={!!gatekeeper.isBlocked}
                        onCheckedChange={() => handleBlockUnblock(gatekeeper._id)}
                        disabled={loadingId === gatekeeper._id}
                      />
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <EditGatekeeper
                        gatekeepers={gatekeeper}
                        onSuccess={(editedManager) => {
                          if (!editedManager) return;
                          setGatekeeper((prev) =>
                            prev.map((p) =>
                              p._id === editedManager._id
                                ? editedManager
                                : p
                            )
                          );
                        }}
                      />
                      <ViewGatekeeper gatekeepers={gatekeeper} />
                      <DeleteGatekeeper
                        gatekeepers={gatekeeper}
                        onSuccess={(gatekeeperId) => {
                          if (!gatekeeperId) return;
                          setGatekeeper((prev) =>
                            prev.filter((p) => p._id !== gatekeeperId)
                          );
                        }}
                      />
                      <ViewScanHistory gatekeeper={gatekeeper} />
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
