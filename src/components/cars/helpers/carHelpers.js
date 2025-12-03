// Helper functions for car data processing

/**
 * Get car_prices from car object (check multiple locations)
 */
export const getCarPrices = (car) => {
  // Check direct model.car_prices
  if (car?.model?.car_prices && Array.isArray(car.model.car_prices)) {
    return car.model.car_prices;
  }
  // Check _apiData.model.car_prices (from transformed data)
  if (car?._apiData?.model?.car_prices && Array.isArray(car._apiData.model.car_prices)) {
    return car._apiData.model.car_prices;
  }
  return null;
};

/**
 * Parse date string (YYYY-MM-DD) as local date
 */
const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * Get dynamic car price based on selected date
 */
export const getCarPriceForDate = (car, selectedDate) => {
  const carPrices = getCarPrices(car);
  if (!carPrices || !selectedDate) {
    return null;
  }

  const selected = parseLocalDate(selectedDate);

  // Find the price range that matches the selected date
  const matchingPrice = carPrices.find((priceRange) => {
    if (!priceRange.is_active) return false;

    const startDate = parseLocalDate(priceRange.start_date);
    const endDate = parseLocalDate(priceRange.end_date);
    endDate.setHours(23, 59, 59, 999);

    return selected >= startDate && selected <= endDate;
  });

  return matchingPrice || null;
};

/**
 * Get car price for current date (today) - uses user's local time
 */
export const getCarPriceForCurrentDate = (car) => {
  const today = new Date();
  // Get local date string in YYYY-MM-DD format
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const localDateString = `${year}-${month}-${day}`;
  return getCarPriceForDate(car, localDateString);
};

/**
 * Get average car price for date range
 */
export const getCarPriceForDateRange = (car, pickupDate, returnDate) => {
  const carPrices = getCarPrices(car);
  if (!carPrices || !pickupDate || !returnDate) {
    return null;
  }

  const pickup = parseLocalDate(pickupDate);
  const returnD = parseLocalDate(returnDate);
  returnD.setHours(23, 59, 59, 999);

  // Get all active price ranges
  const activePrices = carPrices.filter(p => p.is_active);

  if (activePrices.length === 0) return null;

  // Find prices that overlap with the rental period
  const matchingPrices = activePrices.filter((priceRange) => {
    const startDate = parseLocalDate(priceRange.start_date);
    const endDate = parseLocalDate(priceRange.end_date);
    endDate.setHours(23, 59, 59, 999);

    // Check if price range overlaps with rental period
    return (pickup <= endDate && returnD >= startDate);
  });

  if (matchingPrices.length === 0) {
    // If no exact match, use the price for pickup date
    return getCarPriceForDate(car, pickupDate);
  }

  // If multiple price ranges, calculate weighted average based on days
  if (matchingPrices.length === 1) {
    return matchingPrices[0];
  }

  // For multiple ranges, use the price for the pickup date (primary date)
  return getCarPriceForDate(car, pickupDate) || matchingPrices[0];
};

/**
 * Check if car is unavailable based on status
 */
export const isCarUnavailable = (car) => {
  const carStatus = car.status || car._apiData?.status;
  if (!carStatus) return false;

  const statusLower = carStatus.toLowerCase();
  // Only show cars with status "available"
  // Hide "rented" (confirmed/active bookings) and other statuses like "booked"
  if (statusLower === "available") {
    return false; // Car is available for booking
  }
  // "rented" = confirmed/active (already booked), "booked" or any other status makes the car unavailable
  return true;
};

/**
 * Transform API package to pricing plan format
 */
export const transformPackageToPlan = (pkg, index) => {
  const packageType = pkg.package_type?.toLowerCase() || "standard";
  const isPremium = packageType === "premium";

  return {
    id: pkg.id || pkg.package_type || `package-${index}`,
    name: pkg.package_type_display?.toUpperCase() || pkg.package_type?.toUpperCase() || "STANDARD",
    headerColor: isPremium ? "bg-blue-900" : "bg-gray-600",
    features: (pkg.features || []).map((feature, featureIdx) => ({
      text: feature,
      hasInfo: feature.toLowerCase().includes("coverage") || feature.toLowerCase().includes("excess"),
      // Only show badge on the first feature of the first premium package
      badge: isPremium && index === 0 && featureIdx === 0 ? "RECOMMENDED" : undefined,
      badgeIcon: isPremium && index === 0 && featureIdx === 0,
    })),
    discount: pkg.discount_percentage || 0,
    originalPrice: pkg.original_price_per_day || pkg.price_per_day || 0,
    pricePerDay: pkg.price_per_day || 0,
    hasDiscount: pkg.has_discount || false,
    displayPrice: pkg.display_price,
    originalDisplayPrice: pkg.original_display_price,
  };
};

/**
 * Format date for display (e.g., "Nov 26, 2025")
 */
export const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
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

