"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBookings } from "@/hooks/bookings.hook";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Car, 
  Package, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  User,
  FileText
} from "lucide-react";
import Image from "next/image";
import { userStorage } from "@/lib/userStorage";
import Link from "next/link";

export default function MyBookingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Get page from URL params or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 5;

  const { data, isLoading, isError, error } = useBookings({
    per_page: perPage,
    page: currentPage,
  });

  // Check authentication on mount
  useEffect(() => {
    setMounted(true);
    const userData = userStorage.getUser();
    const token = userStorage.getToken();
    
    if (!userData || !token) {
      router.push("/auth/signin");
      return;
    }
    
    setIsLoggedIn(true);
  }, [router]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (data?.pagination?.last_page || 1)) {
      router.push(`/my-bookings?page=${newPage}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Format date only (without time)
  const formatDateOnly = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "";
    switch (statusLower) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">View and manage your booking history</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading your bookings...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <p className="text-red-800">
                  {error?.response?.data?.message || error?.message || "Failed to load bookings. Please try again."}
                </p>
                {error?.response?.status === 401 && (
                  <p className="text-sm text-red-600 mt-2">
                    You need to be logged in to view your bookings.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Bookings List */}
          {!isLoading && !isError && data && (
            <>
              {data.bookings && data.bookings.length > 0 ? (
                <div className="space-y-6">
                  {data.bookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-3 rounded-lg">
                              <Car className="w-6 h-6 text-rose-600" />
                            </div>
                            <div>
                              <CardTitle className="text-xl mb-1">
                                {booking.car?.model?.make || "Car"} {booking.car?.model?.model || ""}
                              </CardTitle>
                              <div className="flex items-center gap-3 flex-wrap">
                                <Badge className={getStatusBadge(booking.status)}>
                                  {booking.status?.toUpperCase() || "UNKNOWN"}
                                </Badge>
                                <span className="text-sm text-gray-600">
                                  Booking #: {booking.booking_number || booking.id}
                                </span>
                                {booking.confirmation_number && (
                                  <span className="text-sm text-gray-600">
                                    Confirmation: {booking.confirmation_number}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {parseFloat(booking.total_amount || 0).toFixed(2)} €
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.duration_days || 0} {booking.duration_days === 1 ? "day" : "days"}
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Car Image and Details */}
                          <div className="space-y-4">
                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                              {booking.car?.image_url ? (
                                <Image
                                  src={`https://resolvecars.softvencefsd.xyz/storage/${booking.car.image_url}`}
                                  alt={booking.car?.model?.make || "Car"}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Car className="w-16 h-16 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Package className="w-4 h-4" />
                                <span>
                                  Package: <span className="font-medium capitalize">
                                    {booking.package?.package_type || "N/A"}
                                  </span>
                                </span>
                              </div>
                              {booking.car?.model && (
                                <>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Type:</span> {booking.car.model.car_type?.name || "N/A"}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Transmission:</span> {booking.car.model.transmission_type || "N/A"}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Fuel:</span> {booking.car.model.fuel_type || "N/A"}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">Seats:</span> {booking.car.model.seats || "N/A"}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Rental Details */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-rose-600" />
                              Rental Period
                            </h3>
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Pickup</p>
                                <p className="font-medium">{formatDate(booking.pickup_datetime)}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{booking.pickup_location?.name || "N/A"}</span>
                                </div>
                                {booking.pickup_location?.address && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {booking.pickup_location.address}
                                  </p>
                                )}
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Return</p>
                                <p className="font-medium">{formatDate(booking.return_datetime)}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{booking.return_location?.name || "N/A"}</span>
                                </div>
                                {booking.return_location?.address && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {booking.return_location.address}
                                  </p>
                                )}
                              </div>
                              {booking.is_return_same_location && (
                                <p className="text-xs text-green-600 font-medium">
                                  ✓ Return to same location
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Pricing Breakdown */}
                          <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-rose-600" />
                              Price Breakdown
                            </h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Base Rental:</span>
                                <span className="font-medium">{parseFloat(booking.base_rental_cost || 0).toFixed(2)} €</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Package Cost:</span>
                                <span className="font-medium">{parseFloat(booking.package_cost || 0).toFixed(2)} €</span>
                              </div>
                              {parseFloat(booking.protection_plan_cost || 0) > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Protection Plan:</span>
                                  <span className="font-medium">{parseFloat(booking.protection_plan_cost || 0).toFixed(2)} €</span>
                                </div>
                              )}
                              {parseFloat(booking.addons_cost || 0) > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Addons:</span>
                                  <span className="font-medium">{parseFloat(booking.addons_cost || 0).toFixed(2)} €</span>
                                </div>
                              )}
                              <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="text-gray-600">Subtotal:</span>
                                <span className="font-medium">{parseFloat(booking.subtotal || 0).toFixed(2)} €</span>
                              </div>
                              {parseFloat(booking.tax_amount || 0) > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tax ({booking.tax_percentage || 0}%):</span>
                                  <span className="font-medium">{parseFloat(booking.tax_amount || 0).toFixed(2)} €</span>
                                </div>
                              )}
                              <div className="flex justify-between pt-2 border-t-2 border-gray-300 font-bold text-lg">
                                <span>Total:</span>
                                <span>{parseFloat(booking.total_amount || 0).toFixed(2)} €</span>
                              </div>
                            </div>

                            {/* Addons List */}
                            {booking.addons && booking.addons.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700 mb-2">Addons:</p>
                                <div className="space-y-1">
                                  {booking.addons.map((addonItem, idx) => (
                                    <div key={idx} className="flex justify-between text-xs text-gray-600">
                                      <span>
                                        {addonItem.addon?.name || "Addon"} (Qty: {addonItem.quantity || 1})
                                      </span>
                                      <span className="font-medium">
                                        {parseFloat(addonItem.total_cost || 0).toFixed(2)} €
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Booking Metadata */}
                        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>
                              Booked on: <span className="font-medium">{formatDateOnly(booking.booked_on)}</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>
                              Avg. Price/Day: <span className="font-medium">
                                {parseFloat(booking.price_per_day_avg || 0).toFixed(2)} €
                              </span>
                            </span>
                          </div>
                          {booking.driver_age_verified !== undefined && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <FileText className="w-4 h-4" />
                              <span>
                                Driver Age Verified: <span className="font-medium">
                                  {booking.driver_age_verified ? "Yes" : "No"}
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
                    <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
                    <Button asChild>
                      <Link href="/cars">Browse Cars</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {data.pagination && data.pagination.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {data.pagination.links
                      ?.filter((link) => link.label && link.label !== "&laquo; Previous" && link.label !== "Next &raquo;")
                      .map((link, idx) => {
                        const pageNum = link.page;
                        if (!pageNum) return null;

                        return (
                          <Button
                            key={idx}
                            variant={link.active ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoading}
                            className={link.active ? "bg-rose-600 hover:bg-rose-700" : ""}
                          >
                            {link.label}
                          </Button>
                        );
                      })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= data.pagination.last_page || isLoading}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              {data.pagination && (
                <div className="mt-4 text-center text-sm text-gray-600">
                  Showing {data.pagination.from || 0} to {data.pagination.to || 0} of {data.pagination.total || 0} bookings
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

