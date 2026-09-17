"use client";

import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { format } from "date-fns";
import {
  RefreshCw,
  AlertCircle,
  PackageSearch,
  Loader2,
  MapPin,
  User,
  CreditCard,
  Truck,
  CheckCircle2,
  Package,
} from "lucide-react";

import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ORDER_STATUSES = [
  "placed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const ALL = "all";
const ITEMS_PER_PAGE = 20;

const orderStatusBadge = (status) => {
  switch (status) {
    case "placed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "packed":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "shipped":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "delivered":
      return "bg-green-100 text-green-700 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    case "returned":
      return "bg-orange-100 text-orange-700 border-orange-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const paymentStatusBadge = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    case "refunded":
      return "bg-purple-100 text-purple-700 border-purple-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const money = (v) => `₹${Number(v || 0).toLocaleString("en-IN")}`;

function OrderDetailsDialog({ orderId, open, setOpen, onUpdated }) {
  const { request: fetchDetails, loading: detailsLoading } = useAxios();
  const { request: updateStatus, loading: updating } = useAxios();
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("placed");
  const [courier, setCourier] = useState("");
  const [awb, setAwb] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [notes, setNotes] = useState("");

  const loadOrder = async () => {
    const { data, error } = await fetchDetails({
      method: "GET",
      url: "/superadmin/order-details",
      authRequired: true,
      params: { orderId },
    });
    if (!error && data?.data) {
      const o = data.data;
      setOrder(o);
      setOrderStatus(o.orderStatus || "placed");
      setCourier(o.shipment?.courier || "");
      setAwb(o.shipment?.awb || "");
      setTrackingUrl(o.shipment?.trackingUrl || "");
      setNotes("");
    } else if (error) {
      showToast("error", error);
    }
  };

  useEffect(() => {
    if (open && orderId) {
      setOrder(null);
      loadOrder();
    }
  }, [open, orderId]);

  const handleUpdate = async () => {
    const { error } = await updateStatus({
      method: "PUT",
      url: "/superadmin/update-order-status",
      authRequired: true,
      payload: {
        orderId,
        orderStatus,
        ...(courier ? { courier } : {}),
        ...(awb ? { awb } : {}),
        ...(trackingUrl ? { trackingUrl } : {}),
        ...(notes ? { notes } : {}),
      },
    });

    if (error) {
      showToast("error", error);
      return;
    }

    showToast("success", "Order updated");
    onUpdated?.(orderId, orderStatus);
    loadOrder();
  };

  const addr = order?.address;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] sm:max-w-[1200px] p-0 overflow-hidden max-h-[88vh] flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-base">
            Order
            <span className="font-mono text-sm text-muted-foreground">
              #{orderId ? String(orderId).slice(-8) : ""}
            </span>
            {order && (
              <Badge
                variant="outline"
                className={`${orderStatusBadge(order.orderStatus)} text-xs capitalize`}
              >
                {order.orderStatus}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {detailsLoading && !order ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : !order ? (
          <div className="py-20 text-center text-muted-foreground">
            Order not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-y-auto">
            {/* Left: details */}
            <div className="lg:col-span-3 p-6 space-y-6 lg:border-r">
              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Placed On</p>
                  <p className="font-medium">
                    {order.createdAt
                      ? format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment</p>
                  <p className="font-medium flex items-center gap-1.5 capitalize">
                    <CreditCard className="w-4 h-4" />
                    {order.paymentMethod} ({order.paymentStatus})
                  </p>
                </div>
              </div>

              {/* Customer */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Customer
                </h3>
                <div className="text-sm">
                  <p className="font-medium">{order.customer?.name || "—"}</p>
                  <p className="text-muted-foreground">{order.customer?.email}</p>
                  <p className="text-muted-foreground">{order.customer?.phone}</p>
                </div>
              </div>

              {/* Address */}
              {addr && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Shipping Address
                  </h3>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground">{addr.fullName}</p>
                    <p>
                      {[addr.line1, addr.line2].filter(Boolean).join(", ")}
                    </p>
                    <p>
                      {[addr.city, addr.state, addr.pincode]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <p>{addr.country}</p>
                    {addr.phone && <p>Phone: {addr.phone}</p>}
                  </div>
                </div>
              )}

              {/* Items */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Items ({order.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.titleSnapshot}
                        className="w-12 h-12 rounded-md border object-cover bg-muted"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.titleSnapshot}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {[item.colorSnapshot, item.sizeSnapshot]
                            .filter(Boolean)
                            .join(" / ")}
                          {item.skuSnapshot ? ` · ${item.skuSnapshot}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.qty} × {money(item.discountPriceSnapshot || item.priceSnapshot)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{money(item.total)}</p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{money(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>{money(order.shippingCharges)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>{money(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              {order.timeline?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" /> Timeline
                  </h3>
                  <div className="space-y-3">
                    {order.timeline.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            step.done
                              ? "bg-green-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 flex justify-between items-center">
                          <span
                            className={`text-sm ${
                              step.done ? "font-medium" : "text-muted-foreground"
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {step.at
                              ? format(new Date(step.at), "dd MMM, hh:mm a")
                              : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: status update */}
            <div className="lg:col-span-2 p-6 space-y-4 bg-muted/30">
              <h3 className="text-sm font-semibold">Update Order</h3>

              <div className="space-y-1.5">
                <Label className="text-xs">Order Status</Label>
                <Select value={orderStatus} onValueChange={setOrderStatus}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Courier</Label>
                <Input
                  className="bg-white"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. Bluedart"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">AWB / Tracking No.</Label>
                <Input
                  className="bg-white"
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="Tracking number"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Tracking URL</Label>
                <Input
                  className="bg-white"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Notes</Label>
                <Textarea
                  className="bg-white"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal note (optional)"
                />
              </div>

              <Button
                onClick={handleUpdate}
                disabled={updating}
                className="w-full"
              >
                {updating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState(ALL);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(ALL);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { request: getOrders, loading, error } = useAxios();

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

  useEffect(() => {
    const fetchOrders = async () => {
      const params = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        sort: "newest",
      };
      if (searchQuery) params.q = searchQuery;
      if (orderStatusFilter !== ALL) params.orderStatus = orderStatusFilter;
      if (paymentStatusFilter !== ALL) params.paymentStatus = paymentStatusFilter;

      const { data, error } = await getOrders({
        method: "GET",
        url: "/superadmin/get-order-list",
        authRequired: true,
        params,
      });

      if (!error && data?.data) {
        setOrders(data.data.items || []);
        setTotalPages(data.data.totalPages || 1);
        setTotalItems(data.data.totalItems || 0);
      }
    };

    fetchOrders();
  }, [searchQuery, orderStatusFilter, paymentStatusFilter, currentPage, refreshKey]);

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  const handleUpdated = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const openOrderDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />
      <div className="p-3 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <h2 className="text-xl font-bold">Order Management</h2>
            <p className="text-sm text-muted-foreground">
              {totalItems} order{totalItems === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <Input
              placeholder="Search order id / sku / title..."
              value={searchValue}
              onChange={handleSearchChange}
              className="w-full sm:w-[230px]"
            />

            <Select
              value={orderStatusFilter}
              onValueChange={(v) => {
                setOrderStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Order status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All statuses</SelectItem>
                {ORDER_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={paymentStatusFilter}
              onValueChange={(v) => {
                setPaymentStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All payments</SelectItem>
                {PAYMENT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {error || "Failed to fetch orders."}</span>
          </Alert>
        )}

        <div className="rounded-lg border bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    <PackageSearch className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order._id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openOrderDialog(order._id)}
                  >
                    <TableCell className="font-mono text-xs">
                      #{String(order._id).slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {order.user?.name || "—"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.user?.email || order.user?.phone || ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{order.itemsCount ?? 0}</TableCell>
                    <TableCell className="font-semibold">
                      ₹{Number(order.total || 0).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${paymentStatusBadge(order.paymentStatus)} text-xs capitalize`}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${orderStatusBadge(order.orderStatus)} text-xs capitalize`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {order.createdAt
                        ? format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderDialog(order._id);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="pt-2">
            <Pagination>
              <PaginationContent className="justify-center">
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                      setCurrentPage((p) => (p < totalPages ? p + 1 : p))
                    }
                    className={
                      currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {selectedOrderId && (
        <OrderDetailsDialog
          orderId={selectedOrderId}
          open={dialogOpen}
          setOpen={setDialogOpen}
          onUpdated={handleUpdated}
        />
      )}
    </AdminDashboardLayout>
  );
}