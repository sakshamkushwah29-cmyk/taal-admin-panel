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
import AddCategory from "@/components/_dialogs/AddCategory";
import EditCategory from "@/components/_dialogs/EditCategory";
// import ViewCategory from "@/components/_dialogs/ViewCategory";
import DeleteCategory from "@/components/_dialogs/DeleteCategory";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    request: getAllCategories,
    loading: categoriesLoading,
    error: categoriesError,
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
        : `/superadmin/get-categories?page=${currentPage}&limit=${ITEMS_PER_PAGE}`;

      try {
        const { data, error } = await getAllCategories({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        console.log(data, "Data from managers");
        if (!error && data?.data) {
          setCategories(data?.data?.data || data?.data || []);
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



  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <h2 className="text-xl font-bold">Categories</h2>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Input
              placeholder="Search by name "
              value={searchValue}
              onChange={handleSearchChange}
              className="w-[250px]"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={categoriesError}
                className="cursor-pointer"
              >
                <RefreshCw className="w-5 h-5 mr-1" /> Refresh
              </Button>
              <AddCategory
                onSuccess={(addedCategory) => {
                  if (!addedCategory) return;
                  setCurrentPage(1);
                  setRefreshKey((prev) => prev + 1);
                }}
              />
            </div>
          </div>
        </div>

        {categoriesError && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>
              Error: {categoriesError || "Failed to fetch Categories."}
            </span>
          </Alert>
        )}

        {categoriesLoading ? (
          <PharmacyListSkeleton />
        ) : categories.length > 0 ? (
          <>
            <Table>
              <TableHeader className="font-bold">
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Icon</TableCell>
                  <TableCell className="text-center">Actions</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category?._id}>
                    <TableCell>{category?.name || "N/A"}</TableCell>
                    <TableCell>{category?.description || "N/A"}</TableCell>
                    <TableCell>
                      {category?.icon ? (
                        <img
                          src={category.icon}
                          alt={category.name}
                          className="w-10 h-10 rounded-md object-cover border"
                        />
                      ) : (
                        "No Icon"
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <EditCategory
                        category={category}
                        onSuccess={(editedCategory) => {
                          if (!editedCategory) return;
                          setCategories((prev) =>
                            prev.map((p) =>
                              p._id === editedCategory._id ? editedCategory : p
                            )
                          );
                        }}
                      />
                      <DeleteCategory
                        categoryId={category._id}
                        onSuccess={(categoryId) => {
                          if (!categoryId) return;
                          setCategories((prev) =>
                            prev.filter((p) => p._id !== categoryId)
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
            No Categories found.
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
