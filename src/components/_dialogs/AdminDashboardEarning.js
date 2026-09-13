"use client";

import React, { useEffect, useState } from "react";
import AppBreadcrumb from "../_ui/app-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader,
  Users,
  Store,
  FlaskConical,
  Truck,
  ShoppingCart,
  DollarSign,
  Star,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Ticket, IndianRupee
} from "lucide-react";
import useAxios from "@/hooks/useAxios";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useAdminMode } from "@/contexts/AdminModeContext";

function formatNumber(val, decimals = 0) {
  if (typeof val === "number" && !isNaN(val)) return val.toFixed(decimals);
  if (typeof val === "string" && val.trim() !== "" && !isNaN(Number(val)))
    return Number(val).toFixed(decimals);
  return "-";
}

function StatGroup({ icon: Icon, title, stats, color, hoverColor }) {
  return (
    <Card className="flex flex-col p-4 shadow-sm border rounded-lg bg-card w-full transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md hover:cursor-pointer group">
      <div className={`flex items-center gap-2 mb-2`}>
        <Icon className={`w-5 h-5 ${color}`} />
        <span className={`font-semibold text-base ${color}`}>{title}</span>
      </div>
      <div className="flex flex-col gap-1">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="capitalize text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <span
              className={`font-medium text-foreground transition-colors duration-300 ${hoverColor}`}
            >
              {formatNumber(value, 0)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RevenueGroup({ stats, title, color, hoverColor }) {
  return (
    <Card className="flex flex-col p-4 shadow-sm border rounded-lg bg-card w-full transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md hover:cursor-pointer group">
      <div className={`flex items-center gap-2 mb-2`}>
        <DollarSign
          className={`w-5 h-5 ${color} group-hover:${hoverColor} transition-colors duration-300`}
        />
        <span
          className={`font-semibold text-base ${color} group-hover:${hoverColor} transition-colors duration-300`}
        >
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex justify-between text-sm">
            <span className="capitalize text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
            <span
              className={`font-medium text-foreground transition-colors duration-300 group-hover:${hoverColor}`}
            >
              ₹{formatNumber(value, 2)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function AdminDashboardEarning() {
  const { request: fetchTicketSummary } = useAxios();
  const { request: fetchOrderInsights } = useAxios();
  const { mode } = useAdminMode() || { mode: "ecommerce" };
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [orders, setOrders] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await fetchOrderInsights({
        method: "GET",
        url: "/superadmin/order-insights",
        authRequired: true,
      });
      if (!error && data) setOrders(data.data);
      else if (error) setError(error);
    } catch (err) {
      setError("Failed to load order insights.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await fetchTicketSummary({
        method: "GET",
        url: "/superadmin/overall-tickets-from-users",
        authRequired: true,
      });
      if (!error && data) setTickets(data.data);
      else if (error) setError(error);
    } catch (err) {
      setError("Failed to load ticket insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "events") fetchTickets();
    else fetchOrders();
  }, [mode]);

  const orderStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-amber-100 text-amber-700";
      case "packed":
        return "bg-indigo-100 text-indigo-700";
      case "placed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "returned":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="h-8 w-8 animate-spin text-primary mb-2" />
        <div className="text-base text-muted-foreground">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AppBreadcrumb />
        <div className="flex flex-col items-center justify-center py-20 text-destructive">
          <AlertCircle className="w-8 h-8 mb-2" />
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppBreadcrumb />
      <div className="flex flex-col gap-8 py-6 px-2 md:px-8 max-w-7xl mx-auto">
        {/* Orders Overview */}
        {mode === "ecommerce" && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-rose-600" /> Orders Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatGroup
              icon={ShoppingCart}
              title="Total Orders"
              stats={{ totalOrders: orders?.totalOrders ?? 0 }}
              color="text-rose-600"
              hoverColor="group-hover:text-rose-800"
            />
            <RevenueGroup
              title="Total Revenue"
              stats={{ amount: orders?.totalRevenue ?? 0 }}
              color="text-green-700"
              hoverColor="text-green-800"
            />
            <StatGroup
              icon={CheckCircle2}
              title="Pending Orders"
              stats={{ pending: orders?.pendingOrders ?? 0 }}
              color="text-fuchsia-600"
              hoverColor="group-hover:text-fuchsia-800"
            />
            <StatGroup
              icon={CheckCircle2}
              title="Completed"
              stats={{ delivered: orders?.completedOrders ?? 0 }}
              color="text-green-600"
              hoverColor="group-hover:text-green-800"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <StatGroup
              icon={ShoppingCart}
              title="Today's Orders"
              stats={{ today: orders?.todayOrders ?? 0 }}
              color="text-cyan-600"
              hoverColor="group-hover:text-cyan-800"
            />
            <RevenueGroup
              title="Today's Revenue"
              stats={{ amount: orders?.todayRevenue ?? 0 }}
              color="text-green-700"
              hoverColor="text-green-800"
            />
            <StatGroup
              icon={AlertCircle}
              title="Cancelled"
              stats={{ cancelled: orders?.cancelledOrders ?? 0 }}
              color="text-red-600"
              hoverColor="group-hover:text-red-800"
            />
          </div>
        </div>
        )}

        {/* Order Status Breakdown */}
        {mode === "ecommerce" && (
        <Card>
          <CardContent className="p-4">
            <div className="font-semibold text-base mb-3">Order Status Breakdown</div>
            {orders?.orderStatusCounts &&
            Object.keys(orders.orderStatusCounts).length ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(orders.orderStatusCounts).map(
                  ([status, count]) => (
                    <Badge
                      key={status}
                      className={`rounded-full px-3 py-1 text-xs capitalize ${orderStatusColor(
                        status
                      )}`}
                    >
                      {status}: {count}
                    </Badge>
                  )
                )}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">No orders yet.</div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Event Tickets */}
        {mode === "events" && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-blue-600" /> Event Tickets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatGroup
              icon={Ticket}
              title="Tickets Count"
              stats={{ totalTickets: tickets?.totalTickets ?? 0 }}
              color="text-blue-600"
              hoverColor="group-hover:text-blue-800"
            />
            <RevenueGroup
              title="Ticket Earnings"
              stats={{ amount: tickets?.totalAmount ?? 0 }}
              color="text-green-700"
              hoverColor="text-green-800"
            />
          </div>
        </div>
        )}

        {/* Latest Orders */}
        {mode === "ecommerce" && (
        <Card className="flex flex-col">
          <CardContent className="p-4">
            <div className="font-semibold text-lg mb-3 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" /> Latest Orders
            </div>
            {orders?.latestOrders?.length ? (
              <div className="divide-y">
                {orders.latestOrders.map((order) => (
                  <div
                    key={order._id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {order.firstItemTitle || "Order"}
                        {order.itemsCount > 1
                          ? ` +${order.itemsCount - 1} more`
                          : ""}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        #{String(order._id).slice(-8)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.createdAt
                          ? format(
                              new Date(order.createdAt),
                              "MMM dd, yyyy hh:mm a"
                            )
                          : ""}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold">
                        ₹{formatNumber(order.total, 0)}
                      </span>
                      <Badge
                        className={`rounded-full px-2 py-1 text-xs capitalize ${orderStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                No recent orders.
              </div>
            )}
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
