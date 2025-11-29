"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, User, CalendarDays, Car, CreditCard, Package, DollarSign } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { useMemo } from "react";
import Image from "next/image";
import { extrasData } from "@/lib/coverageData";
import { useAddons } from "@/hooks/addons.hook";

export default function Step4Review({ onPrev }) {
    const { data: addonsData } = useAddons();

    const all = bookingStorage.getData() || {};
    const car = bookingStorage.getCar();
    const step1 = all.step1 || {};
    const step2 = all.step2 || {};
    const step3 = all.step3 || {};

    // Calculate rental days
    const rentalDays = useMemo(() => {
        if (!step1.pickupDate || !step1.dropoffDate) return 1;
        try {
            const pickup = new Date(step1.pickupDate);
            const dropoff = new Date(step1.dropoffDate);
            const diff = Math.ceil(Math.abs(dropoff - pickup) / (1000 * 60 * 60 * 24));
            return diff > 0 ? diff : 1;
        } catch {
            return 1;
        }
    }, [step1.pickupDate, step1.dropoffDate]);

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
            });
        } catch {
            return dateString;
        }
    };

    // Format time for display
    const formatTime = (timeString) => {
        if (!timeString) return "";
        return timeString;
    };

    // Get selected package
    const selectedPackage = step1.protectionPlan || "premium";
    const carPackages = car?.packages || [];
    const currentPackage = carPackages.find(pkg => {
        const pkgType = pkg.package_type?.toLowerCase();
        const pkgId = pkg.id?.toString().toLowerCase();
        const selected = selectedPackage?.toString().toLowerCase();
        return pkgType === selected || pkgId === selected;
    });

    // Calculate car base price (fixed, not per day)
    const carBasePrice = useMemo(() => {
        if (!car) return 0;
        const carPrices = car._apiData?.model?.car_prices || car._apiData?.car_prices;
        if (carPrices && Array.isArray(carPrices) && carPrices.length > 0) {
            const activePrice = carPrices.find(p => p.is_active !== false) || carPrices[0];
            return activePrice.price_per_day || 0;
        }
        return car.price || 0;
    }, [car]);

    // Calculate package price
    const baseRatePrice = useMemo(() => {
        if (currentPackage) {
            const rentalCalc = currentPackage.rental_calculation;
            if (rentalCalc) {
                return rentalCalc.daily_rate || rentalCalc.base_rental_cost || currentPackage.price_per_day || 0;
            }
            return currentPackage.price_per_day || 0;
        }
        const packagePrices = {
            premium: 25.83,
            smart: 24.57,
            standard: 13.18,
        };
        return packagePrices[selectedPackage] || 25.83;
    }, [currentPackage, selectedPackage]);

    const baseRateTotal = baseRatePrice * rentalDays;

    // Calculate addons total
    const { addonsTotal, addonsList } = useMemo(() => {
        const selectedExtras = step1.extras || [];
        let total = 0;
        const list = [];

        selectedExtras.forEach((extraId) => {
            const extra = extrasData.find(e => e.id === extraId);
            if (!extra) return;

            let apiAddon = null;
            if (addonsData && Array.isArray(addonsData) && addonsData.length > 0) {
                apiAddon = addonsData.find(a => {
                    const addonName = (a.name || "").toLowerCase();
                    const extraName = extra.name.toLowerCase();
                    return addonName === extraName ||
                        addonName.includes(extraName) ||
                        extraName.includes(addonName);
                });
            }

            let price = 0;
            let label = extra.name;

            if (extraId === "childSeat") {
                const quantities = step1.childSeatQuantities || {};
                const totalChildSeats = (quantities.babySeat || 0) +
                    (quantities.childSeat || 0) +
                    (quantities.boosterSeat || 0);
                if (totalChildSeats > 0) {
                    const pricePerSeat = apiAddon ? parseFloat(apiAddon.price_per_day || 0) : (extra.price || 0);
                    price = pricePerSeat * totalChildSeats * rentalDays;
                    label = `${extra.name} (${totalChildSeats}x)`;
                    list.push({ name: label, price, quantity: totalChildSeats });
                    total += price;
                }
            } else if (extraId === "foundationDonation") {
                const donation = step1.donationAmount || 0;
                price = parseFloat(donation) || 0;
                if (price > 0) {
                    list.push({ name: extra.name, price });
                    total += price;
                }
            } else {
                const pricePerDay = apiAddon ? parseFloat(apiAddon.price_per_day || 0) : (extra.price || 0);
                if (pricePerDay > 0) {
                    price = pricePerDay * rentalDays;
                    list.push({ name: extra.name, price });
                    total += price;
                }
            }
        });

        return { addonsTotal: total, addonsList: list };
    }, [step1.extras, step1.childSeatQuantities, step1.donationAmount, rentalDays, addonsData]);

    // Calculate grand total
    const grandTotal = carBasePrice + baseRateTotal + addonsTotal;

    // Get payment method display name
    const paymentMethodName = step3.paymentMethod === "credit" ? "Credit Card" :
        step3.paymentMethod === "bizum" ? "Bizum" :
            step3.paymentMethod === "scalapay" ? "Scalapay" :
                step3.paymentMethod === "klarna" ? "Klarna" :
                    step3.paymentMethod || "Not selected";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="rounded-xl border bg-rose-50/60 p-4 md:p-6">
                <div className="flex items-center gap-2 border-b pb-4">
                    <CheckCircle2 className="h-5 w-5 text-rose-600" />
                    <h2 className="text-lg md:text-xl font-semibold text-rose-900">Review Your Booking</h2>
                </div>

                {/* Booking ID if available */}
                {step1.bookingId && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-900">
                            <span className="font-semibold">Booking ID:</span> {step1.bookingId}
                        </p>
                    </div>
                )}

                {/* Car Information */}
                {car && (
                    <div className="mt-6 rounded-lg border border-rose-200 bg-white p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Car className="h-4 w-4 text-rose-600" />
                            <h3 className="text-sm font-medium text-rose-900">Vehicle</h3>
                        </div>
                        <div className="flex gap-4">
                            {car.image && (
                                <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={car.image || car.image_url || "/assets/cars/ridecard1.png"}
                                        alt={car.name || "Car"}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                    {car.name || `${car.model?.make || ""} ${car.model?.model || ""}`.trim() || "Car"} or similar
                                </p>
                                <p className="text-sm text-gray-600">{car.type || car.model?.car_type?.name?.toUpperCase() || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rental Details */}
                <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <CalendarDays className="h-4 w-4 text-rose-600" />
                        <h3 className="text-sm font-medium text-rose-900">Rental Period</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600 mb-1">Pickup:</p>
                            <p className="font-medium text-gray-900">{step1.pickupLocation || '-'}</p>
                            <p className="text-gray-700">
                                {formatDate(step1.pickupDate)} {formatTime(step1.pickupTime || "12:00")}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-1">Dropoff:</p>
                            <p className="font-medium text-gray-900">{step1.dropoffLocation || step1.pickupLocation || '-'}</p>
                            <p className="text-gray-700">
                                {formatDate(step1.dropoffDate)} {formatTime(step1.dropoffTime || "12:00")}
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-rose-200">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Duration:</span> {rentalDays} {rentalDays === 1 ? "day" : "days"}
                        </p>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-rose-600" />
                        <h3 className="text-sm font-medium text-rose-900">Customer Information</h3>
                    </div>
                    <div className="text-sm space-y-1">
                        <p className="font-semibold text-gray-900">
                            {`${step2.firstName || ''} ${step2.lastName || ''}`.trim() || '-'}
                        </p>
                        <p className="text-gray-700">{step2.email || '-'}</p>
                        <p className="text-gray-700">{step2.phone || '-'}</p>
                        {step2.flightNumber && (
                            <p className="text-gray-700"><span className="font-medium">Flight:</span> {step2.flightNumber}</p>
                        )}
                    </div>
                </div>

                {/* Package Information */}
                <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Package className="h-4 w-4 text-rose-600" />
                        <h3 className="text-sm font-medium text-rose-900">Protection Plan</h3>
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold text-gray-900">
                            {selectedPackage === "premium" ? "Premium" :
                                selectedPackage === "smart" ? "Smart" :
                                    selectedPackage === "standard" ? "Standard" :
                                        selectedPackage.toString().charAt(0).toUpperCase() + selectedPackage.toString().slice(1)} Package
                        </p>
                        <p className="text-gray-600 mt-1">Included in your booking</p>
                    </div>
                </div>

                {/* Addons/Extras */}
                {addonsList.length > 0 && (
                    <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 className="h-4 w-4 text-rose-600" />
                            <h3 className="text-sm font-medium text-rose-900">Addons & Extras</h3>
                        </div>
                        <div className="space-y-2 text-sm">
                            {addonsList.map((addon, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="text-gray-700">
                                        {addon.name}
                                        {addon.quantity && ` (${addon.quantity}x)`}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {addon.price.toFixed(2)} €
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Payment Information */}
                {step3.paymentMethod && (
                    <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CreditCard className="h-4 w-4 text-rose-600" />
                            <h3 className="text-sm font-medium text-rose-900">Payment Method</h3>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-gray-900">{paymentMethodName}</p>
                            {step3.paymentMethod === "credit" && step3.cardNumber && (
                                <p className="text-gray-600 mt-1">
                                    Card ending in {step3.cardNumber.slice(-4)}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Price Summary */}
                <div className="mt-4 rounded-lg border border-rose-200 bg-white p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4 text-rose-600" />
                        <h3 className="text-sm font-medium text-rose-900">Price Summary</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                        {carBasePrice > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Car Rental (fixed):</span>
                                <span className="text-gray-900 font-medium">{carBasePrice.toFixed(2)} €</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Package ({selectedPackage === "premium" ? "Premium" : selectedPackage === "smart" ? "Smart" : "Standard"}):
                            </span>
                            <span className="text-gray-900 font-medium">
                                {baseRatePrice.toFixed(2)} €/day × {rentalDays} days = {baseRateTotal.toFixed(2)} €
                            </span>
                        </div>
                        {addonsTotal > 0 && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Addons & Extras:</span>
                                <span className="text-gray-900 font-medium">{addonsTotal.toFixed(2)} €</span>
                            </div>
                        )}
                        <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                            <span className="text-gray-900 font-bold text-base">Total:</span>
                            <span className="text-gray-900 font-bold text-lg">{grandTotal.toFixed(2)} €</span>
                        </div>
                    </div>
                </div>

                {/* Back Button Only - View Only Mode */}
                <div className="flex justify-start pt-4 mt-6 border-t border-rose-200">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrev}
                        className="flex items-center gap-2 border-rose-300 text-rose-700 hover:bg-rose-50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
}















