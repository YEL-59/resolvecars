"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CheckCircle2, User, MapPin, CalendarDays } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { useRouter } from "next/navigation";

export default function Step4Review({ onPrev }) {
    const form = useFormContext();
    const router = useRouter();

    const onConfirm = () => {
        bookingStorage.updateStep('step4', {
            termsAccepted: !!form.getValues('termsAccepted')
        });
        router.push('/booking/success');
    };

    const all = bookingStorage.getData() || {};
    const car = bookingStorage.getCar();
    const step1 = all.step1 || {};
    const step2 = all.step2 || {};
    const step3 = all.step3 || {};

    // Days for display, if needed in messaging
    const days = (() => {
        if (!step1.pickupDate || !step1.dropoffDate) return 1;
        const pickup = new Date(step1.pickupDate);
        const dropoff = new Date(step1.dropoffDate);
        const diff = Math.ceil(Math.abs(dropoff - pickup) / (1000 * 60 * 60 * 24));
        return diff || 1;
    })();

    return (
        <div className="space-y-6">
            {/* Header panel */}
            <div className="rounded-xl border bg-rose-50/60 p-4 md:p-6">
                <div className="flex items-center gap-2 border-b pb-4">
                    <CheckCircle2 className="h-5 w-5 text-rose-600" />
                    <h2 className="text-lg md:text-xl font-semibold text-rose-900">Review Your Booking</h2>
                </div>

                {/* Rental Details */}
                <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <CalendarDays className="h-4 w-4 text-rose-600" />
                        <h3 className="text-sm font-medium text-rose-900">Rental Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Pickup:</p>
                            <p className="font-medium">{step1.pickupLocation || '-'}</p>
                            <p className="text-gray-700">{step1.pickupDate ? `${step1.pickupDate} ${step1.pickupTime || ''}` : '-'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Dropoff:</p>
                            <p className="font-medium">{step1.dropoffLocation || '-'}</p>
                            <p className="text-gray-700">{step1.dropoffDate ? `${step1.dropoffDate} ${step1.dropoffTime || ''}` : '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <User className="h-4 w-4 text-rose-600" />
                        <h3 className="text-sm font-medium text-rose-900">Customer Information</h3>
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold">{`${step2.firstName || ''} ${step2.lastName || ''}`.trim() || '-'}</p>
                        <p className="text-gray-700">{step2.email || '-'}</p>
                        <p className="text-gray-700">{step2.phone || '-'}</p>
                    </div>
                </div>

                {/* Agreement */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onConfirm)} className="space-y-4 mt-6">
                        <FormField control={form.control} name="termsAccepted" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>I agree to the Terms and Conditions</FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )} />

                        <div className="flex justify-between pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onPrev}
                                className="flex items-center gap-2 border-rose-300 text-rose-700 hover:bg-rose-50"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                            <Button type="submit" className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white">
                                Complete Booking
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}






