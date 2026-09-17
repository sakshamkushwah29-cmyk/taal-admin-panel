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
import { RefreshCw, AlertCircle } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import { Alert } from "@/components/ui/alert";
 import { Badge } from "@/components/ui/badge";


import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
 import { Switch } from "@/components/ui/switch";
 import UsersListSkeleton from "@/components/_skeletons/users-list-skeleton";
import ViewUsers from "@/components/_dialogs/ViewUsers";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const {
    request: getAllUsers,
    loading: usersLoading,
    error: usersError,
  } = useAxios();

 
  const { request: updateBlockStatus } = useAxios();




  const debounceSearch = useCallback(
    debounce((val) => {
      if (val.trim()) {
        setSearchQuery(val.trim());
        setCurrentPage(1);
      } else {
        setSearchQuery("");
        setCurrentPage(1);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    debounceSearch(val);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const ITEMS_PER_PAGE = 10;

      const endpoint = searchQuery
        ? `/admin/search-customer?searchQuery=${searchQuery}`
        :`/admin/get-all-customer?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;
 
      try {
        const { data, error } = await getAllUsers({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        if (!error && data?.data) {
          setUsers(data?.data?.customers || data?.data?.data || []);
          setTotalPages(data.data.totalPages || 1);
          console.log(data.data, "Data from Users");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchUsers();
  }, [searchQuery, currentPage, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };


  const handleBlockStatusToggle = async (customerId) => {
    setLoadingId(customerId);
    try {
      const { data, error } = await updateBlockStatus({
        method: "PUT",
        url: `/admin/block-unblock-customer`,
        authRequired: true,
        payload: { customerId },
      });

      if (error) {
        showToast("error", "Failed to update Block status");
        return;
      }

      const isBlocked = data?.data?.isBlocked;

      setUsers((prev) =>
        prev.map((p) =>
          p._id === customerId ? { ...p, isBlocked } : p
        )
      );

      showToast("success", `Block status updated to ${isBlocked ? "Blocked" : "Unblocked"}`);
    } catch (err) {
      showToast("error", "Unexpected error while updating status");
    } finally {
      setLoadingId(null);
    }
  };


  


  return (
    <AdminDashboardLayout>
      <AppBreadcrumb/>

    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <h2 className="text-xl font-bold">All Users</h2>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Input
            placeholder="Search by name or email..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-[250px]"
          />
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={usersLoading}
            className="cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 mr-1" /> Refresh
          </Button>

        

        </div>
      </div>

      {usersError && (
        <Alert variant="destructive">
          <AlertCircle className="w-5 h-5" />
          <span>Error: {usersError || "Failed to fetch Users."}</span>
        </Alert>
      )}

      

      {usersLoading ? (
        <UsersListSkeleton />
      ) : users.length > 0 ? (
        <>
          <Table>
            <TableHeader className="font-bold">
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Verified status</TableCell>
                <TableCell>Blocked Status</TableCell>
                <TableCell>SubscriptionPlan</TableCell>
                 <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((customer) => (
                <TableRow key={customer?._id}>
                  <TableCell>{customer?.fullName || "N/A"}</TableCell>
                  <TableCell>{customer?.phoneNumber || "N/A"}</TableCell>
                  <TableCell>{customer?.email || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                    className={
                      customer?.isVerified === true ? "bg-green-200 text-green-800" : customer?.isVerified === false ? "bg-red-200 text-red-800"                         
                       : "bg-blue-100 text-blue-800"

                     }
                    >
                    {customer?.isVerified === true ? "Verified"  : 
                    customer?.isVerified === false ? "Not Verified"  :
                     "N/A"}
                 
                    </Badge>
                    
                   </TableCell>
                
                   
                  <TableCell>

                    <Switch
                      checked={customer?.isBlocked === true}
                      onCheckedChange={() => handleBlockStatusToggle(customer._id)}
                      disabled={loadingId === customer._id}
                    />


                  </TableCell>

                  <TableCell>{customer?.subscriptionPlan || 
                    "N/A"}</TableCell>
                  <TableCell className="flex gap-2">
                    {<ViewUsers customer={customer} />
}
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
          )}
        </>
      ) : (
        <div className="text-center text-muted-foreground">
          No Users found.
        </div>
      )}
    </div>
    </AdminDashboardLayout>
  );
}
