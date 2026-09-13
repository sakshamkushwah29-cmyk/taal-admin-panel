"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import AdminDashboardLayout from "../../../page"; // <-- adjust if needed

// Optional: reuse your dialogs here too
import EditSaleProduct from "@/components/_dialogs/EditSaleProduct";
import DeleteSaleProduct from "@/components/_dialogs/DeleteSaleProduct";

export default function SaleProductDetailsPage() {
  const { productId } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);

  const { request: getOneProduct, loading, error } = useAxios();
  const { request: updateProductStatus , loading: toggling } = useAxios();

  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // ✅ Adjust endpoint to your backend
        const { data, error } = await getOneProduct({
          method: "GET",
          url: `/superadmin/get-sales-product-by-id/?productId=${productId}`,
          authRequired: true,
        });

        if (error) return;

        // some backends return { data: {...} } or { data: [ ... ] }
        const payload = data?.data ?? data;
        const p = Array.isArray(payload) ? payload[0] : payload;
        setProduct(p || null);
      } catch (e) {
        // handled by hook error if any
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const totalVariants = product?.variants?.length || 0;
  const totalStock = useMemo(
    () => (product?.variants || []).reduce((sum, v) => sum + (v?.stock || 0), 0),
    [product]
  );

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

      setProduct((prev) =>
        prev
          ? { ...prev, status: prev.status === "active" ? "inactive" : "active" }
          : prev
      );

      showToast("success", `${data.message || "Status updated successfully."}`);
    } catch (err) {
      showToast("error", "Unexpected error while updating product status");
    } finally {
      setLoadingId(null);
    }
  };

  const fmt = (n) =>
    typeof n === "number" ? n.toLocaleString("en-IN", { maximumFractionDigits: 0 }) : n;

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Product Details</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.back()}>Back</Button>
            {product && (
              <>
                <EditSaleProduct product={product} onSuccess={() => window.location.reload()} />
                {/* <DeleteSaleProduct productId={product._id} onSuccess={() => router.push("/admin/sale-products")} /> */}
              </>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {String(error) || "Failed to fetch product."}</span>
          </Alert>
        )}

        {loading || !product ? (
          <div className="text-sm text-muted-foreground">Loading product…</div>
        ) : (
          <>
            {/* Top summary */}
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{product.title}</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={product.status === "active" ? "default" : "secondary"}>
                      {product.status || "inactive"}
                    </Badge>
                    <Badge variant="outline">{product.gender || "N/A"}</Badge>
                    <Badge variant="outline">Variants: {totalVariants}</Badge>
                    <Badge variant="outline">Total Stock: {fmt(totalStock)}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Active</span>
                  <Switch
                    checked={product.status === "active"}
                    onCheckedChange={()=>{
                      handleToggleStatus(product._id, product.status);
                    }}
                    disabled={toggling}
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Left: Image */}
                  <div className="lg:col-span-1">
                    <div className="aspect-square w-full overflow-hidden rounded-xl border">
                      <img
                        src={product?.variants?.[0]?.images?.[0] || "/placeholder.svg"}
                        alt={product.title}
                        crossOrigin="anonymous"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Right: Meta */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Description</div>
                      <p className="text-sm">{product.description || "—"}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Categories</div>
                        <div className="flex flex-wrap gap-2">
                          {product.category?.length
                            ? product.category.map((c) => (
                                <Badge key={c?._id} variant="outline">{c?.name || "—"}</Badge>
                              ))
                            : <span className="text-sm">—</span>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Tags</div>
                        <div className="flex flex-wrap gap-2">
                          {product.tags?.length
                            ? product.tags.map((t, i) => <Badge key={`${t}-${i}`}>{t}</Badge>)
                            : <span className="text-sm">—</span>}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Slug</div>
                        <div className="text-sm">{product.slug || "—"}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Created / Updated</div>
                        <div className="text-sm">
                          {product.createdAt ? new Date(product.createdAt).toLocaleString() : "—"}{" "}
                          <span className="text-muted-foreground">/</span>{" "}
                          {product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Variants as cards */}
            <Card>
              <CardHeader>
                <CardTitle>Variants ({totalVariants})</CardTitle>
              </CardHeader>
              <CardContent>
                {product.variants?.length ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.variants.map((v, idx) => {
                      const effectivePrice = (v.discountPrice && v.discountPrice > 0) ? v.discountPrice : v.price;
                      const hasDiscount = v.discountPrice && v.discountPrice > 0;

                      return (
                        <div key={v._id || idx} className="rounded-2xl border p-3 space-y-3">
                          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border">
                            <img
                              src={v.images?.[0] || "/placeholder.svg"}
                              crossOrigin="anonymous"
                              alt={`${product.title} - ${v.color || ""} ${v.size || ""}`}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="font-medium">{v.color || "—"} {v.size ? `• ${v.size}` : ""}</div>
                            <Badge variant={v.stock > 0 ? "default" : "secondary"}>
                              {v.stock > 0 ? "In stock" : "Out of stock"}
                            </Badge>
                          </div>

                          <div className="flex items-baseline gap-2">
                            <div className="text-lg font-semibold">₹{fmt(effectivePrice)}</div>
                            {hasDiscount && (
                              <div className="text-sm line-through text-muted-foreground">
                                ₹{fmt(v.price)}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">SKU</div>
                            <div className="text-right">{v.sku || "—"}</div>

                            <div className="text-muted-foreground">Stock</div>
                            <div className="text-right">{fmt(v.stock || 0)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No variants found.</div>
                )}
              </CardContent>
            </Card>

            {/* (Optional) Variant summary table */}
            <Card>
              <CardHeader>
                <CardTitle>Variant Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Final</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>SKU</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants?.map((v, i) => {
                      const final = (v.discountPrice && v.discountPrice > 0) ? v.discountPrice : v.price;
                      return (
                        <TableRow key={v._id || i}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell>{v.color || "—"}</TableCell>
                          <TableCell>{v.size || "—"}</TableCell>
                          <TableCell>₹{fmt(v.price)}</TableCell>
                          <TableCell>{v.discountPrice ? `₹${fmt(v.discountPrice)}` : "—"}</TableCell>
                          <TableCell>₹{fmt(final)}</TableCell>
                          <TableCell>{fmt(v.stock || 0)}</TableCell>
                          <TableCell>{v.sku || "—"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
