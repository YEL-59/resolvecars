"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CreditCard, CheckCircle2 } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { useMemo, useEffect, useState } from "react";
import Image from "next/image";
import { extrasData } from "@/lib/coverageData";
import { useAddons } from "@/hooks/addons.hook";
import { useCreatePaymentIntent } from "@/hooks/payment.hook";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const countries = [
    "Spain", "United States", "Canada", "United Kingdom", "Germany", "France",
    "Australia", "Japan", "South Korea", "Singapore", "Netherlands"
];

export default function Step3Payment({ onPrev, onNext }) {
    const form = useFormContext();
    const router = useRouter();
    const { data: addonsData } = useAddons();
    const createPaymentIntent = useCreatePaymentIntent();
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Get rental days and selected car
    const rentalDays = useMemo(() => {
        const step1Data = bookingStorage.getStep("step1") || {};
        if (step1Data.pickupDate && step1Data.dropoffDate) {
            try {
                const pickup = new Date(step1Data.pickupDate);
                const dropoff = new Date(step1Data.dropoffDate);
                const diffTime = Math.abs(dropoff - pickup);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays > 0 ? diffDays : 23;
            } catch {
                return 23;
            }
        }
        return 23;
    }, []);

    const selectedCar = useMemo(() => {
        return bookingStorage.getCar();
    }, []);

    // Get all step1 data - ensure we have complete access to all step1 fields
    const step1Data = useMemo(() => {
        const step1 = bookingStorage.getStep("step1") || {};
        // Also get from bookingStorage.getData() to ensure we have all fields
        const allData = bookingStorage.getData() || {};
        return {
            ...allData.step1,
            ...step1,
        };
    }, []);

    // Get booking data from API response (source of truth)
    const bookingData = useMemo(() => {
        const bookingResponse = step1Data.bookingResponse || step1Data.bookingData || {};
        const bookingResponseData = bookingResponse.data?.data || bookingResponse.data || bookingResponse;
        return bookingResponseData;
    }, [step1Data.bookingResponse, step1Data.bookingData]);

    const step2Data = useMemo(() => {
        return bookingStorage.getStep("step2") || {};
    }, []);

    const selectedPackage = useMemo(() => {
        return step1Data.protectionPlan || "premium";
    }, [step1Data]);

    const selectedCoverage = useMemo(() => {
        return step1Data.coveragePlan || "premium";
    }, [step1Data]);

    // Get booking ID from step1 data
    const bookingId = useMemo(() => {
        return step1Data.bookingId || step1Data.booking_id || null;
    }, [step1Data]);

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
        if (!timeString) return "N/A";
        return timeString;
    };

    // Calculate addons total - matching Step1Rental logic
    const calculateAddonsTotal = () => {
        const selectedExtras = step1Data.extras || [];
        let addonsTotal = 0;
        const addonsList = [];

        selectedExtras.forEach((extraId) => {
            const extra = extrasData.find(e => e.id === extraId);
            if (!extra) return;

            // Get addon from API if available
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
                const quantities = step1Data.childSeatQuantities || {};
                const totalChildSeats = (quantities.babySeat || 0) +
                    (quantities.childSeat || 0) +
                    (quantities.boosterSeat || 0);
                if (totalChildSeats > 0) {
                    // Use API price if available, otherwise use extrasData price
                    const pricePerSeat = apiAddon ? parseFloat(apiAddon.price_per_day || 0) : (extra.price || 0);
                    // Child seats are per_day - multiply by quantity and days
                    price = pricePerSeat * totalChildSeats * rentalDays;
                    label = `${extra.name} (${totalChildSeats}x)`;
                    addonsList.push({
                        name: label,
                        price: price,
                        quantity: totalChildSeats
                    });
                    addonsTotal += price;
                }
            } else if (extraId === "foundationDonation") {
                // Donations are fixed amounts, not multiplied by days
                const donation = step1Data.donationAmount || 0;
                price = parseFloat(donation) || 0;
                if (price > 0) {
                    addonsList.push({
                        name: extra.name,
                        price: price
                    });
                    addonsTotal += price;
                }
            } else {
                // All other addons are multiplied by days (matching Step1Rental)
                const pricePerDay = apiAddon ? parseFloat(apiAddon.price_per_day || 0) : (extra.price || 0);
                if (pricePerDay > 0) {
                    price = pricePerDay * rentalDays;
                    addonsList.push({
                        name: extra.name,
                        price: price
                    });
                    addonsTotal += price;
                }
            }
        });

        return { addonsTotal, addonsList };
    };

    // Calculate car base price (fixed, not per day) - matching Step1Rental
    const carBasePrice = useMemo(() => {
        if (!selectedCar) return 0;
        const carPrices = selectedCar._apiData?.model?.car_prices || selectedCar._apiData?.car_prices;
        if (carPrices && Array.isArray(carPrices) && carPrices.length > 0) {
            const activePrice = carPrices.find(p => p.is_active !== false) || carPrices[0];
            return activePrice.price_per_day || 0;
        }
        return selectedCar.price || 0;
    }, [selectedCar]);

    // Get pricing from booking API response (source of truth)
    const getBookingPricing = () => {
        // If we have booking data from API, use it
        if (bookingData && Object.keys(bookingData).length > 0) {
            const baseRentalCost = parseFloat(bookingData.base_rental_cost || 0);
            const packageCost = parseFloat(bookingData.package_cost || 0);
            const addonsCost = parseFloat(bookingData.addons_cost || 0);
            const subtotal = parseFloat(bookingData.subtotal || 0);
            const taxAmount = parseFloat(bookingData.tax_amount || 0);
            const totalAmount = parseFloat(bookingData.total_amount || 0);

            // Get addons list from booking API
            const bookingAddons = bookingData.addons || [];
            const addonsList = bookingAddons.map(bookingAddon => ({
                name: bookingAddon.addon?.name || "Unknown",
                price: parseFloat(bookingAddon.total_cost || 0),
                quantity: bookingAddon.quantity || 1,
                pricePerDay: parseFloat(bookingAddon.price_at_booking || 0),
            }));

            // Calculate package price per day
            const baseRatePrice = rentalDays > 0 ? packageCost / rentalDays : 0;

            return {
                carBasePrice: baseRentalCost,
                baseRatePrice: baseRatePrice,
                baseRateTotal: packageCost,
                addonsTotal: addonsCost,
                addonsList: addonsList,
                subtotal: subtotal,
                taxAmount: taxAmount,
                taxPercentage: parseFloat(bookingData.tax_percentage || 0),
                total: totalAmount,
                fromBookingAPI: true, // Flag to indicate this is from API
            };
        }

        // Fallback to manual calculation if booking data not available
        const selectedCar = bookingStorage.getCar();
        const carPackages = selectedCar?.packages || [];
        const currentPackage = carPackages.find(pkg => {
            const pkgType = pkg.package_type?.toLowerCase();
            const pkgId = pkg.id?.toString().toLowerCase();
            const selected = selectedPackage?.toString().toLowerCase();
            return pkgType === selected || pkgId === selected;
        });

        let baseRatePrice = 0;
        if (currentPackage) {
            const rentalCalc = currentPackage.rental_calculation;
            if (rentalCalc) {
                baseRatePrice = rentalCalc.daily_rate || rentalCalc.base_rental_cost || currentPackage.price_per_day || 0;
            } else {
                baseRatePrice = currentPackage.price_per_day || 0;
            }
        } else {
            // Fallback to default prices
            const packagePrices = {
                premium: 25.83,
                smart: 24.57,
                lite: 11.00,
                standard: 13.18,
            };
            baseRatePrice = packagePrices[selectedPackage] || 25.83;
        }

        const baseRateTotal = baseRatePrice * rentalDays;
        const { addonsTotal, addonsList } = calculateAddonsTotal();

        // Grand total = car base price (fixed) + package price + addons
        const calculatedTotal = carBasePrice + baseRateTotal + addonsTotal;

        // Use total_amount from booking API if available
        const bookingTotalAmount = step1Data.total_amount;
        let finalTotal = calculatedTotal;

        if (bookingTotalAmount) {
            finalTotal = parseFloat(bookingTotalAmount);
        } else {
            const storedTotal = step1Data.total;
            if (storedTotal && storedTotal > 0) {
                finalTotal = storedTotal;
            }
        }

        return {
            carBasePrice,
            baseRatePrice,
            baseRateTotal,
            addonsTotal,
            addonsList,
            subtotal: finalTotal,
            taxAmount: 0,
            taxPercentage: 0,
            total: finalTotal,
            fromBookingAPI: false,
        };
    };

    // Calculate total price - use booking API data if available
    const calculateTotal = () => {
        return getBookingPricing();
    };

    const {
        carBasePrice: displayCarBasePrice,
        baseRatePrice,
        baseRateTotal,
        addonsTotal,
        addonsList,
        subtotal,
        taxAmount,
        taxPercentage,
        total,
        fromBookingAPI
    } = calculateTotal();

    // Calculate payment breakdown: 30% upfront, 70% after journey
    const upfrontPaymentPercentage = 30;
    const remainingPaymentPercentage = 70;
    const upfrontPayment = (total * upfrontPaymentPercentage) / 100;
    const remainingPayment = (total * remainingPaymentPercentage) / 100;

    const installmentAmount = (total / 3).toFixed(2);

    // Prefill form with step 2 data and auto-select payment method
    useEffect(() => {
        if (step2Data) {
            if (step2Data.firstName) {
                form.setValue("firstName", step2Data.firstName);
            }
            if (step2Data.lastName) {
                form.setValue("lastName", step2Data.lastName);
            }
            if (step2Data.email) {
                form.setValue("email", step2Data.email);
            }
            if (step2Data.phone) {
                form.setValue("phone", step2Data.phone);
            }
        }

        // Auto-select credit card as payment method if not already set
        const currentPaymentMethod = form.getValues("paymentMethod");
        if (!currentPaymentMethod) {
            form.setValue("paymentMethod", "credit");
        }
    }, [step2Data, form]);

    // Handle Stripe payment
    const handleStripePayment = async () => {
        if (!bookingId) {
            toast.error("Booking ID is missing. Please complete the booking first.");
            return;
        }

        setIsProcessingPayment(true);

        try {
            // Get the full total amount (100%)
            const fullTotal = parseFloat(bookingData?.total_amount || step1Data.total_amount || total || 0);

            // Calculate 30% upfront payment
            const paymentTotal = (fullTotal * upfrontPaymentPercentage) / 100;
            const amountInCents = Math.round(paymentTotal * 100);

            if (!paymentTotal || paymentTotal <= 0) {
                throw new Error("Invalid payment amount calculation.");
            }

            // Create success and cancel URLs
            const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
            const successUrl = `${baseUrl}/booking/payment/success?booking_id=${bookingId}`;
            const cancelUrl = `${baseUrl}/booking/payment/cancel?booking_id=${bookingId}`;

            // Create payment intent with the 30% amount 
            const paymentPayload = {
                booking_id: bookingId,
                amount: paymentTotal, // 30%
                amount_cents: amountInCents, // 30% in cents
                total: paymentTotal, // 30%
                total_amount: paymentTotal, // 30%
                price: paymentTotal, // 30%
                upfront_payment_amount: paymentTotal, // 30%
                payment_type: "upfront",
                payment_part: "upfront",
                success_url: successUrl,
                cancel_url: cancelUrl,
                // Include full breakdown but OVERRIDE the total fields here too
                step1_data: {
                    ...step1Data,
                    amount: paymentTotal,
                    total: paymentTotal,
                    total_amount: paymentTotal,
                    price: paymentTotal,
                    upfront_payment_amount: paymentTotal,
                    full_booking_total: fullTotal,
                    remaining_amount_70: fullTotal - paymentTotal,
                }
            };

            // LOGGING THE PAYLOAD FOR DEBUGGING
            console.warn("🚀 DEBUG: PAYMENT PAYLOAD BEING SENT TO BACKEND:");
            console.table({
                "Booking ID": paymentPayload.booking_id,
                "Amount (30%)": paymentPayload.amount,
                "Full Total (100%)": fullTotal,
                "Amount in Cents": paymentPayload.amount_cents,
                "Endpoint": "/payments/create-intent"
            });
            console.log("Full Payload Object:", paymentPayload);

            const response = await createPaymentIntent.mutateAsync(paymentPayload);

            // If response contains a redirect URL (Stripe Checkout), redirect to it
            if (response?.data?.checkout_url || response?.checkout_url) {
                window.location.href = response.data?.checkout_url || response.checkout_url;
            } else if (response?.data?.client_secret) {
                console.log("Stripe client secret received:", response.data.client_secret);
            } else {
                onNext();
            }
        } catch (error) {
            console.error("Payment processing error:", error);
            const errorMessage = error.message || "Failed to process payment.";
            toast.error(errorMessage);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();

        // Get form values
        const paymentMethod = form.watch("paymentMethod");
        const termsAccepted = form.watch("termsAccepted");
        const newsletterSubscribe = form.watch("newsletterSubscribe");
        const clubOk = form.watch("clubOk");

        // Validate payment method selection
        if (!paymentMethod) {
            toast.error("Please select a payment method by clicking on 'Select type of payment'");
            return;
        }

        // Validate all 3 checkboxes are checked
        if (!termsAccepted) {
            toast.error("Please accept the General Terms and Conditions to continue");
            return;
        }

        if (!newsletterSubscribe) {
            toast.error("Please accept the newsletter subscription to continue");
            return;
        }

        if (!clubOk) {
            toast.error("Please accept the Club OK terms to continue");
            return;
        }

        // If credit card is selected, process Stripe payment
        if (paymentMethod === "credit") {
            await handleStripePayment();
        } else {
            // For other payment methods (Bizum, Scalapay, Klarna), just move to next step
            // Form values are automatically saved via form.watch() in BookingRoot
            onNext();
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={handleNext} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Rental Summary */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            {/* Car Information */}
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {selectedCar?.name || `${selectedCar?.model?.make || ""} ${selectedCar?.model?.model || ""}`.trim() || "Car"} or similar
                            </h3>
                            <p className="text-xs text-red-600 mb-1">Best price for these dates</p>
                            <p className="text-sm text-gray-600 mb-3">
                                {selectedCar?.type || selectedCar?.model?.car_type?.name?.toUpperCase() || "Small ESMS"}
                            </p>

                            {selectedCar?.image && (
                                <div className="relative w-full h-32 mb-4 bg-gray-50 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedCar.image || selectedCar.image_url || "/assets/cars/ridecard1.png"}
                                        alt={selectedCar.name || "Car"}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                            )}

                            {/* Rental Period */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                <h4 className="text-sm font-bold text-gray-900 mb-2">Rental Period</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <p className="text-gray-600">Pickup</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatDate(step1Data.pickupDate)} {formatTime(step1Data.pickupTime || "12:00")}
                                        </p>
                                        <p className="text-xs text-gray-500">{step1Data.pickupLocation || "N/A"}</p>
                                    </div>
                                    <div className="border-t border-blue-200 pt-2">
                                        <p className="text-gray-600">Drop-off</p>
                                        <p className="font-semibold text-gray-900">
                                            {formatDate(step1Data.dropoffDate)} {formatTime(step1Data.dropoffTime || "12:00")}
                                        </p>
                                        <p className="text-xs text-gray-500">{step1Data.dropoffLocation || step1Data.pickupLocation || "N/A"}</p>
                                    </div>
                                    <div className="pt-2 border-t border-blue-200">
                                        <p className="text-gray-600">Duration</p>
                                        <p className="font-semibold text-gray-900">{rentalDays} {rentalDays === 1 ? "day" : "days"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* User Information */}
                            {(step2Data.firstName || step2Data.lastName || step2Data.email || step2Data.phone) && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                                    <h4 className="text-sm font-bold text-gray-900 mb-2">Customer Information</h4>
                                    <div className="space-y-1 text-sm">
                                        {(step2Data.firstName || step2Data.lastName) && (
                                            <p className="text-gray-700">
                                                <span className="font-medium">Name:</span> {step2Data.firstName || ""} {step2Data.lastName || ""}
                                            </p>
                                        )}
                                        {step2Data.email && (
                                            <p className="text-gray-700">
                                                <span className="font-medium">Email:</span> {step2Data.email}
                                            </p>
                                        )}
                                        {step2Data.phone && (
                                            <p className="text-gray-700">
                                                <span className="font-medium">Phone:</span> {step2Data.phone}
                                            </p>
                                        )}
                                        {step2Data.flightNumber && (
                                            <p className="text-gray-700">
                                                <span className="font-medium">Flight:</span> {step2Data.flightNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Package and Pricing */}
                            <div className="bg-gray-100 rounded-lg p-3 mb-4">
                                <p className="text-sm text-gray-600">
                                    {selectedPackage === "premium" ? "Premium" : selectedPackage === "smart" ? "Smart" : selectedPackage === "lite" ? "Lite" : "Standard"} Rate x {rentalDays} days
                                </p>
                                <div>
                                    <p className="text-xl font-bold text-blue-700">
                                        {upfrontPayment.toFixed(2)} €
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1 font-medium">
                                        Pay now (30% of {total.toFixed(2)} €)
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Remaining {remainingPayment.toFixed(2)} € after journey
                                    </p>
                                </div>
                            </div>

                            {/* Summary of Your Rental */}
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                                <h4 className="text-sm font-bold text-gray-900 mb-2">
                                    SUMMARY OF YOUR RENTAL
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {displayCarBasePrice > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Car Rental</span>
                                            <span className="text-gray-900 font-medium">
                                                {displayCarBasePrice.toFixed(2)} €
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">
                                            {selectedPackage === "premium" ? "Premium" : selectedPackage === "smart" ? "Smart" : selectedPackage === "lite" ? "Lite" : "Standard"} Package
                                        </span>
                                        <span className="text-gray-900 font-medium">
                                            {baseRateTotal.toFixed(2)} €
                                        </span>
                                    </div>
                                    {addonsList && addonsList.length > 0 && (
                                        <div className="pt-2 border-t border-purple-200 space-y-1">
                                            {addonsList.map((addon, index) => (
                                                <div key={index} className="flex justify-between">
                                                    <span className="text-gray-700">{addon.name}</span>
                                                    <span className="text-gray-900 font-medium">
                                                        {addon.price.toFixed(2)} €
                                                        {addon.quantity && addon.quantity > 1 && ` (x${addon.quantity})`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {fromBookingAPI && subtotal > 0 && (
                                        <div className="pt-2 border-t border-purple-200">
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">Subtotal</span>
                                                <span className="text-gray-900 font-medium">
                                                    {subtotal.toFixed(2)} €
                                                </span>
                                            </div>
                                            {taxAmount > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-700">Tax ({taxPercentage}%)</span>
                                                    <span className="text-gray-900 font-medium">
                                                        {taxAmount.toFixed(2)} €
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                                <div className="space-y-2 text-sm">
                                    {displayCarBasePrice > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Car Price:</span>
                                            <span className="text-gray-900 font-medium">
                                                {displayCarBasePrice.toFixed(2)} € {fromBookingAPI ? "" : "(fixed)"}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Package Rate:</span>
                                        <span className="text-gray-900 font-medium">
                                            {baseRatePrice.toFixed(2)} €/day
                                        </span>
                                    </div>
                                    {addonsTotal > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Addons:</span>
                                            <span className="text-gray-900 font-medium">
                                                {addonsTotal.toFixed(2)} €
                                            </span>
                                        </div>
                                    )}
                                    {fromBookingAPI && subtotal > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="text-gray-900 font-medium">
                                                {subtotal.toFixed(2)} €
                                            </span>
                                        </div>
                                    )}
                                    {fromBookingAPI && taxAmount > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tax ({taxPercentage}%):</span>
                                            <span className="text-gray-900 font-medium">
                                                {taxAmount.toFixed(2)} €
                                            </span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-900 font-semibold">Total:</span>
                                            <span className="text-gray-900 font-bold">
                                                {total.toFixed(2)} €
                                            </span>
                                        </div>
                                        {/* Payment Breakdown: 30% upfront, 70% after journey */}
                                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-blue-700">Payment Now (30%):</span>
                                                <span className="text-base font-bold text-blue-700">
                                                    {upfrontPayment.toFixed(2)} €
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">Balance After Journey (70%):</span>
                                                <span className="text-xs font-medium text-gray-600">
                                                    {remainingPayment.toFixed(2)} €
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {fromBookingAPI ? (
                                            `From booking API - ${displayCarBasePrice.toFixed(0)} € car + ${baseRateTotal.toFixed(0)} € package + ${addonsTotal.toFixed(0)} € addons`
                                        ) : (
                                            <>
                                                {displayCarBasePrice > 0 && `${displayCarBasePrice.toFixed(0)} € car + `}
                                                {baseRateTotal.toFixed(0)} € package ({rentalDays} {rentalDays === 1 ? "day" : "days"})
                                                {addonsTotal > 0 && ` + ${addonsTotal.toFixed(2)} € addons`}
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Promotional Code */}
                            {/* <div className="mb-4">
                                <Input
                                    placeholder="Add code"
                                    className="text-sm mb-2"
                                />
                                <Button type="button" variant="outline" size="sm" className="w-full">
                                    Apply
                                </Button>
                            </div> */}

                            {/* Discount Info */}
                            {/* <div className="mb-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                                        -20%
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    {baseRatePrice.toFixed(2)} € / day
                                </p>
                                <p className="text-sm text-gray-500 line-through">
                                    {total.toFixed(0)} € ({rentalDays} days)
                                </p>
                            </div> */}

                            {/* Loyalty Points */}
                            {/* <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-600">
                                    Your booking gives you {Math.floor(total)} Points OK CLUB
                                </p>
                            </div> */}
                        </div>
                    </div>

                    {/* Right Column - Form and Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Frist name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nyssa" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mccall" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* 
                                <FormField
                                    control={form.control}
                                    name="licenseNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ID/passport number *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="681" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact phone number *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🇺🇸</span> */}
                                                    <Input
                                                        placeholder="+1 (508) 614-8823"
                                                        className="pl-2"
                                                        {...field}
                                                        value={field.value || ""}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email *</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="hamipo@mailinator.com" {...field} value={field.value || ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country *</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || 'Spain'}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select country" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {countries.map((c) => (
                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                            </div>

                            {/* MeliáRewards Section */}
                            {/* <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">
                                        Earn points on your MeliáRewards card MELIÁREWARDS
                                    </span>
                                    <Select>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="yes">Yes</SelectItem>
                                            <SelectItem value="no">No</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div> */}

                            {/* Checkboxes */}
                            <div className="mt-6 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="termsAccepted"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm font-normal">
                                                    I have read and accept the General Terms and Conditions for Vehicle Rental and the Privacy Policy.
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="newsletterSubscribe"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm font-normal">
                                                    Yes, I give my consent to receive information and personalized offers from OK MOBILITY GROUP. View our Privacy Policy.
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="clubOk"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm font-normal">
                                                    I would like to join Club OK. I have read and accept the Club OK Program Terms and Conditions and the Privacy Policy.
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Free Cancellation Banner */}
                            <div className="mt-6 bg-green-100 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-800 font-medium">
                                    Free cancellation and amendment up to 1 hour before pick-up.
                                </p>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Select type of payment</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Credit Card */}
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${field.value === "credit"
                                                        ? "border-blue-600 bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    onClick={() => field.onChange("credit")}
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-semibold text-gray-900">Credit card</span>
                                                        {field.value === "credit" && (
                                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-gray-500">VISA</span>
                                                        <span className="text-xs text-gray-500">Mastercard</span>
                                                        <span className="text-xs text-gray-500">Amex</span>
                                                    </div>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                {/* Bizum */}
                                {/* <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${field.value === "bizum"
                                                        ? "border-blue-600 bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    onClick={() => field.onChange("bizum")}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-gray-900">Bizum</span>
                                                        {field.value === "bizum" && (
                                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">Pay with Bizum</p>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                             
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${field.value === "scalapay"
                                                        ? "border-blue-600 bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    onClick={() => field.onChange("scalapay")}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-gray-900">Scalapay</span>
                                                        {field.value === "scalapay" && (
                                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        3 installments of {installmentAmount} € without interest
                                                    </p>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                              
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${field.value === "klarna"
                                                        ? "border-blue-600 bg-blue-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                        }`}
                                                    onClick={() => field.onChange("klarna")}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold text-gray-900">Klarna</span>
                                                        {field.value === "klarna" && (
                                                            <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        3 instalments or 30 days interest free
                                                    </p>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                /> */}
                            </div>

                            {/* Credit Card Details (shown when credit card is selected) */}
                            {/* {form.watch("paymentMethod") === "credit" && (
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="cardholderName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cardholder Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="cardNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Card Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="1234 5678 9012 3456"
                                                        maxLength={19}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="expiryDate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Expiry Date</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="MM/YY" maxLength={5} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="cvv"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>CVV</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="123" maxLength={4} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            )} */}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onPrev}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={isProcessingPayment || createPaymentIntent.isPending}
                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessingPayment || createPaymentIntent.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        PAY {upfrontPaymentPercentage}% NOW ({upfrontPayment.toFixed(2)} €) & CONTINUE
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
