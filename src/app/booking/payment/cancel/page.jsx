"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [bookingId, setBookingId] = useState(null);

    useEffect(() => {
        const bookingIdParam = searchParams.get("booking_id");
        if (bookingIdParam) {
            setBookingId(bookingIdParam);
        }
    }, [searchParams]);

    const handleRetry = () => {
        // Navigate back to payment step
        router.push("/booking/step3");
    };

    const handleBack = () => {
        // Navigate back to previous step
        router.push("/booking/step2");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <XCircle className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Cancelled
                </h1>
                <p className="text-gray-600 mb-6">
                    Your payment was cancelled. No charges have been made.
                    {bookingId && (
                        <span className="block mt-2 text-sm">
                            Booking ID: {bookingId}
                        </span>
                    )}
                </p>
                <div className="flex gap-4">
                    <Button
                        onClick={handleRetry}
                        variant="outline"
                        className="flex-1"
                    >
                        Try Again
                    </Button>
                    <Button
                        onClick={handleBack}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}

