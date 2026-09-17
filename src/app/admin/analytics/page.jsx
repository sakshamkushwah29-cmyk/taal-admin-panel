// To use this page, run: npm install recharts
"use client";

import React, { useEffect, useState } from "react";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function Analytics() {
  const { request: fetchOrders } = useAxios();
  const { request: fetchRevenue } = useAxios();
  const [orderData, setOrderData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetchOrders({ method: "GET", url: "/admin/get-order-analysis", authRequired: true }),
      fetchRevenue({ method: "GET", url: "/admin/get-revenue-analysis", authRequired: true })
    ]).then(([ordersRes, revenueRes]) => {
      if (ordersRes.error) setError(ordersRes.error);
      else setOrderData(ordersRes.data?.data?.monthlyOrders || []);
      if (revenueRes.error) setError(revenueRes.error);
      else setRevenueData(revenueRes.data?.data?.monthlyRevenue || []);
      setLoading(false);
    }).catch(() => {
      setError("Failed to load analytics data.");
      setLoading(false);
    });
  }, []);

  // Format data for charts
  const ordersChartData = (orderData || []).map((item) => ({
    month: MONTHS[item.month - 1],
    Medicine: item.medicine,
    Prescription: item.prescription,
    Pathology: item.pathology,
  }));

  const revenueChartData = (revenueData || []).map((item) => ({
    month: MONTHS[item.month - 1],
    "Medicine Revenue": Number(item.medicineRevenue).toFixed(2),
    "Prescription Revenue": Number(item.prescriptionRevenue).toFixed(2),
    "Total Revenue": Number(item.totalRevenue).toFixed(2),
    "Commission Earned": Number(item.commissionEarned).toFixed(2),
  }));

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />
      <div className="flex flex-col gap-8 py-6 px-2 md:px-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-20 text-destructive">
            <AlertCircle className="w-8 h-8 mr-2" /> {error}
          </div>
        ) : (
          <>
            {/* Orders Analysis */}
            <Card className="w-full min-w-0">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Orders Analysis</h2>
                <div className="w-full overflow-x-auto">
                  <div style={{ minWidth: 400 }}>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={ordersChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis 
                          allowDecimals={false}
                          domain={[0, 'dataMax + 2']}
                          label={{
                            value: 'Number of Orders',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 10,
                            style: { textAnchor: 'middle', fontSize: 14, fill: '#64748b' }
                          }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Medicine" fill="#6366f1" />
                        <Bar dataKey="Prescription" fill="#f59e42" />
                        <Bar dataKey="Pathology" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Analysis */}
            <Card className="w-full min-w-0">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Revenue Analysis</h2>
                <div className="w-full overflow-x-auto">
                  <div style={{ minWidth: 400 }}>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={revenueChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis 
                          domain={[0, 'dataMax + 10']}
                          label={{
                            value: 'Revenue (₹)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 10,
                            style: { textAnchor: 'middle', fontSize: 14, fill: '#64748b' }
                          }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Medicine Revenue" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="Prescription Revenue" stroke="#f59e42" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="Total Revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="Commission Earned" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
}