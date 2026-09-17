"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, Loader2, AlertCircle, ArrowUp } from "lucide-react";
import { debounce } from "lodash";
import useAxios from "@/hooks/useAxios";
import Image from "next/image";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import PromoBannerSkeleton from "@/components/_skeletons/banner-list-skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddPromoBanner from "@/components/_dialogs/AddPromoBanner";
import { Alert } from "@/components/ui/alert";

export default function PromoBannerList() {
  const { request: getAllBanners, loading: bannerLoading, error: promoBannerError } = useAxios();

  const [banners, setBanners] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [typeStatus, setTypeStatus] = useState("test");
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadMoreClicked, setLoadMoreClicked] = useState(false);

  const ITEMS_PER_PAGE = 6;

  const debounceSearch = useCallback(
    debounce((val) => {
      if (val.trim()) {
        setSearchQuery(val.trim());
        setCurrentPage(1);
        setBanners([]);
      } else {
        setSearchQuery("");
        setCurrentPage(1);
        setBanners([]);
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
    const fetchBanners = async () => {
      const endpoint = searchQuery
        ? `/admin/search-banner?search=${searchQuery.trim()}&limit=${ITEMS_PER_PAGE}&page=${currentPage}`
        : `/admin/get-all-promo-banner?isActive=${filterStatus === "active"}&limit=${ITEMS_PER_PAGE}&page=${currentPage}&type=${typeStatus}`

      try {
        const { data, error } = await getAllBanners({
          method: "GET",
          url: endpoint,
          authRequired: true,
        });

        if (!error && data?.data) {
          const newBanners = data.data.banners || data.data;
          setBanners((prev) => currentPage === 1 ? newBanners : [...prev, ...newBanners]);
          setVisibleCount((prev) => {
            // Always show all banners fetched so far
            const total = (currentPage === 1 ? newBanners.length : prev + newBanners.length);
            return Math.max(total, ITEMS_PER_PAGE);
          });
          setHasMore(newBanners.length === ITEMS_PER_PAGE);
        }
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      }
    };
    fetchBanners(currentPage);
  }, [searchQuery, filterStatus, typeStatus, refreshKey, currentPage]);

  const handleRefresh = () => {
    setSearchQuery("");
    setSearchValue("");
    setCurrentPage(1);
    setRefreshKey((prev) => prev + 1);
    setBanners([]);
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Only show up to visibleCount banners
  const visibleBanners = banners.slice(0, visibleCount);

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />

      <div className="p-3 space-y-5">
        <div id="admin-banners-top" />
        <div className="flex flex-col gap-4 md:gap-6">
          <h2 className="text-2xl font-bold mb-2">Active Promo Banners</h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Group 1: Search Bar */}
            <div className="flex-1 flex items-center md:max-w-xs">
              <Input
                placeholder="Search promo banner..."
                value={searchValue}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>

            {/* Group 2: Filters */}
            <div className="flex flex-row gap-2 md:gap-4 items-center justify-start md:justify-center">
              <Select
                value={typeStatus}
                onValueChange={(value) => {
                  setTypeStatus(value);
                  setCurrentPage(1);
                  setBanners([]);
                }}
              >
                <SelectTrigger className="w-[120px] h-10 text-sm">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="medicine">Medicine</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterStatus}
                onValueChange={(value) => {
                  setFilterStatus(value);
                  setCurrentPage(1);
                  setBanners([]);
                }}
              >
                <SelectTrigger className="w-[120px] h-10 text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Group 3: Actions */}
            <div className="flex flex-row gap-2 md:gap-4 items-center justify-end">
              <Button variant="outline" onClick={handleRefresh} disabled={bannerLoading} className="h-10 cursor-pointer">
                <RefreshCw className="w-5 h-5 mr-2" /> Refresh
              </Button>
              <AddPromoBanner
                handleRefresh={handleRefresh}
                onSuccess={(addedPromoBanner) => {
                  if (!addedPromoBanner) return;
                  setBanners((prev) => [addedPromoBanner, ...prev]);
                }}
                buttonProps={{ className: "h-10 px-5 text-base font-semibold bg-primary text-white hover:bg-primary/90 rounded-xl shadow" }}
              />
            </div>
          </div>
        </div>

        {promoBannerError && (
          <Alert variant="destructive">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {promoBannerError || "Failed to fetch offers."}</span>
          </Alert>
        )}

        {bannerLoading && banners.length === 0 ? (
          <PromoBannerSkeleton />
        ) : banners.length === 0 ? (
          <p className="text-muted-foreground">No promo banners found.</p>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {visibleBanners.map((banner) => (
                <Card key={banner._id} className="shadow-lg rounded-2xl overflow-hidden transition-all hover:shadow-xl border border-border">
                  <div className="relative w-full h-40 sm:h-52">
                    <Image
                      src={banner.bannerImageUrl}
                      alt={banner.title}
                      fill
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold line-clamp-2">{banner.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {banner.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          {new Date(banner.startDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          –{" "}
                          {new Date(banner.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <Badge
                        className={banner?.isActive === true ? "bg-green-100 text-green-800" : banner?.isActive === false ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        Priority: <span className="font-medium">{banner.priority}</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

              ))}
            </div>

            <div className="text-center mt-6 flex items-center justify-center gap-2">
              {hasMore && (
                bannerLoading && currentPage > 1 ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Button onClick={() => {
                    setCurrentPage((prev) => prev + 1);
                    setLoadMoreClicked(true);
                  }}>
                    Load More
                  </Button>
                )
              )}
              {loadMoreClicked && visibleCount > ITEMS_PER_PAGE && (
                <button
                  type="button"
                  className="ml-2 p-2 rounded-full hover:bg-accent transition"
                  aria-label="Collapse banners"
                  onClick={async () => {
                    // Scroll to the top of the banners list smoothly
                    const scrollTarget = document.querySelector("#admin-banners-top");
                    if (scrollTarget) {
                      scrollTarget.scrollIntoView({ behavior: "smooth" });
                      await new Promise((res) => setTimeout(res, 500));
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      await new Promise((res) => setTimeout(res, 500));
                    }
                    setVisibleCount(ITEMS_PER_PAGE);
                    setLoadMoreClicked(false);
                  }}
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
