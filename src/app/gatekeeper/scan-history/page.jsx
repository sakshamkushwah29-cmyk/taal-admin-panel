"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import useAxios from "@/hooks/useAxios";
import PharmacyListSkeleton from "@/components/_skeletons/pharmacy-list-skeleton";

export default function ScansPage() {
  const [scans, setScans] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const {
    request: getScans,
    loading: scansLoading,
    error: scansError,
  } = useAxios();

  useEffect(() => {
    const fetchScans = async () => {
      const ITEMS_PER_PAGE = 10;
      const endpoint = `/gatekeeper/get-scanned-history?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;

      try {
        const { data, error } = await getScans({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        if (!error && data?.data) {
          setScans(data?.data?.scans || []);
          setTotalPages(data?.data?.totalPages || 1);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchScans();
  }, [currentPage, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <h2 className="text-xl font-bold">Scans History</h2>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={scansLoading}
            className="cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 mr-1" /> Refresh
          </Button>
        </div>

        {scansError && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {scansError || "Failed to fetch scans."}</span>
          </Alert>
        )}

        {scansLoading ? (
          <PharmacyListSkeleton />
        ) : scans.length > 0 ? (
          <>
            <Table>
              <TableHeader className="font-bold">
                <TableRow>
                  <TableCell>Ticket ID</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Session</TableCell>
                  <TableCell>Gatekeeper</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Scanned At</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.map((scan) => (
                  <TableRow key={scan?._id}>
                    <TableCell>{scan?.ticketId || "N/A"}</TableCell>
                    <TableCell
                      className={
                        scan?.result === "valid"
                          ? "text-green-600 font-medium"
                          : scan?.result === "invalid"
                          ? "text-red-600 font-medium"
                          : "text-yellow-600 font-medium"
                      }
                    >
                      {scan?.result}
                    </TableCell>
                    <TableCell>{scan?.event?.title || "N/A"}</TableCell>
                    <TableCell>
                      {scan?.eventSession
                        ? `${scan?.eventSession?.specialNameOfDay} (${scan?.eventSession?.date?.slice(
                            0,
                            10
                          )})`
                        : "N/A"}
                    </TableCell>
                    <TableCell>{scan?.gatekeeper?.name || "N/A"}</TableCell>
                    <TableCell>{scan?.notes || "N/A"}</TableCell>
                    <TableCell>
                      {new Date(scan?.scannedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="pt-4">
              <Pagination>
                <PaginationContent className="justify-center">
                  <PaginationItem className="cursor-pointer">
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
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
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            No Scans found.
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
