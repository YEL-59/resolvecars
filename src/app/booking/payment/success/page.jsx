"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookingStorage } from "@/lib/bookingStorage";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [bookingId, setBookingId] = useState(null);

    useEffect(() => {
        const bookingIdParam = searchParams.get("booking_id");
        if (bookingIdParam) {
            setBookingId(bookingIdParam);
        }
    }, [searchParams]);

    const handleContinue = () => {
        // Navigate to booking success/confirmation page
        router.push("/booking/step4");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                    Your payment has been processed successfully.
                    {bookingId && (
                        <span className="block mt-2 text-sm">
                            Booking ID: {bookingId}
                        </span>
                    )}
                </p>
                <Button
                    onClick={handleContinue}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                >
                    Continue to Booking Confirmation
                </Button>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}

