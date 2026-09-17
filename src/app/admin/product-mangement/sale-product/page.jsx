"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch";
import { RefreshCw, AlertCircle } from "lucide-react";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import AdminDashboardLayout from "../../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";

// Import your dialogs for products
import AddSaleProduct from "@/components/_dialogs/AddSaleProduct";
import EditSaleProduct from "@/components/_dialogs/EditSaleProduct";
import ViewSaleProduct from "@/components/_dialogs/ViewSaleProduct";
import DeleteSaleProduct from "@/components/_dialogs/DeleteSaleProduct";

export default function SaleProductsPage() {
  const [products, setProducts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);

  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    request: getAllProducts,
    loading: productsLoading,
    error: productsError,
  } = useAxios();

  const { request: updateProductStatus } = useAxios();
  const [loadingId, setLoadingId] = useState(null);

  // Debounced search
  const debounceSearch = useCallback(
    debounce((val) => {
      setSearchQuery(val);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchValue(val);
    debounceSearch(val);
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const ITEMS_PER_PAGE = 10;
      const trimmedSearchQuery = searchQuery.trim();

      const endpoint = trimmedSearchQuery
        ? `/superadmin/search-products?search=${trimmedSearchQuery}&limit=${ITEMS_PER_PAGE}`
        : `/superadmin/get-all-sale-products?page=${currentPage}`;

      try {
        const { data, error } = await getAllProducts({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        if (!error && data?.data) {
          setProducts(data?.data || []);
          // setTotalPages(data?.totalPages);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchProducts();
  }, [searchQuery, currentPage, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    setLoadingId(productId);
    try {
      const { data, error } = await updateProductStatus({
        method: "PUT",
        url: `/superadmin/change-product-status`,
        authRequired: true,
        payload: { productId , status: currentStatus === "active" ? "inactive" : "active" },
      });

      if (error) {
        showToast("error", "Failed to update product status");
        return;
      }

      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, status: p.status === "active" ? "inactive" : "active" }
            : p
        )
      );

      showToast("success", `${data.message || "Status updated successfully."}`);
    } catch (err) {
      showToast("error", "Unexpected error while updating product status");
    } finally {
      setLoadingId(null);
    }
  };

  console.log(products, "Products");
  return (
    <>
    <AdminDashboardLayout>
      <AppBreadcrumb />

      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
          <h2 className="text-xl font-bold">Products</h2>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Input
              placeholder="Search by title or category..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-[250px]"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={productsLoading}
              >
                <RefreshCw className="w-5 h-5 mr-1" /> Refresh
              </Button>
              <AddSaleProduct
                onSuccess={() => {
                  setCurrentPage(1);
                  setRefreshKey((prev) => prev + 1);
                }}
              />
            </div>
          </div>
        </div>

        {productsError && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {productsError || "Failed to fetch products."}</span>
          </Alert>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
        <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Image</TableHead>
      <TableHead>Title</TableHead>
      <TableHead>Category</TableHead>
      <TableHead>Price</TableHead>
      <TableHead>Stock</TableHead>
      <TableHead>Varients</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {products.map((product) => {
      const firstVariant = product.variants?.[0];
      return (
        <TableRow key={product._id}>
          <TableCell>
            {firstVariant?.images?.[0] ? (
              <img
                src={firstVariant.images[0]}
                alt={product.title}
                crossOrigin="anonymous"
                className="w-12 h-12 rounded-md object-cover"
              />
            ) : (
              <span>No Image</span>
            )}
          </TableCell>
          <TableCell>{product.title}</TableCell>
          <TableCell>
            {product.category?.map((c) => c.name).join(", ")}
          </TableCell>
          <TableCell>
            ₹{firstVariant?.discountPrice || firstVariant?.price}
          </TableCell>
          <TableCell>{firstVariant?.stock || 0}</TableCell>
          <TableCell>{product.variants?.length || 0}</TableCell>
          <TableCell>
            <Switch
              checked={product.status === "active"}
              onCheckedChange={() =>
                handleToggleStatus(product._id, product.status)
              }
              disabled={loadingId === product._id}
            />
          </TableCell>
          <TableCell className="flex gap-2">
          <Button >
              <Link href={`/admin/product-mangement/sale-product/${product._id}`}>View</Link>
            </Button>
            <EditSaleProduct
              product={product}
              onSuccess={() => handleRefresh()}
            />
            {/* <DeleteSaleProduct
              productId={product._id}
              onSuccess={() => handleRefresh()}
            /> */}
          </TableCell>
        </TableRow>
      );
    })}
  </TableBody>
</Table>

        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage === 1}
              />
            </PaginationItem>
            <PaginationItem>
              Page {currentPage} of {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages ? prev + 1 : prev
                  )
                }
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </AdminDashboardLayout>
    </>
  );
}

