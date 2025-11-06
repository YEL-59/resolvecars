"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CreditCard, CheckCircle2 } from "lucide-react";
import { bookingStorage } from "@/lib/bookingStorage";
import { useMemo } from "react";
import Image from "next/image";

const countries = [
    "Spain", "United States", "Canada", "United Kingdom", "Germany", "France",
    "Australia", "Japan", "South Korea", "Singapore", "Netherlands"
];

export default function Step3Payment({ onPrev, onNext }) {
    const form = useFormContext();

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

    const selectedPackage = useMemo(() => {
        const step1Data = bookingStorage.getStep("step1") || {};
        return step1Data.protectionPlan || "premium";
    }, []);

    const selectedCoverage = useMemo(() => {
        const step1Data = bookingStorage.getStep("step1") || {};
        return step1Data.coveragePlan || "premium";
    }, []);

    // Calculate total price
    const calculateTotal = () => {
        const packagePrices = {
            premium: 25.83,
            smart: 24.57,
            lite: 11.00,
            standard: 13.18,
        };
        const baseRatePrice = packagePrices[selectedPackage] || 25.83;
        const baseRateTotal = baseRatePrice * rentalDays;

        let coveragePrice = 0;
        if (selectedCoverage === "premium") {
            coveragePrice = selectedPackage === "lite" || selectedPackage === "standard" ? 13.57 : 0;
        } else if (selectedCoverage === "superPremium") {
            coveragePrice = selectedPackage === "lite" || selectedPackage === "standard" ? 19.78 : 6.21;
        }

        return {
            baseRatePrice,
            baseRateTotal,
            coveragePrice: coveragePrice * rentalDays,
            total: baseRateTotal + (coveragePrice * rentalDays),
        };
    };

    const { baseRatePrice, baseRateTotal, coveragePrice, total } = calculateTotal();
    const installmentAmount = (total / 3).toFixed(2);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => onNext())} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Rental Summary */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {selectedCar?.name || "Car"} or similar
                            </h3>
                            <p className="text-xs text-red-600 mb-1">Best price for these dates</p>
                            <p className="text-sm text-gray-600 mb-3">{selectedCar?.type || "Small ESMS"}</p>
                            
                            {selectedCar?.image && (
                                <div className="relative w-full h-32 mb-4 bg-gray-50 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedCar.image}
                                        alt={selectedCar.name}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                            )}

                            <div className="bg-gray-100 rounded-lg p-3 mb-4">
                                <p className="text-sm text-gray-600">
                                    {selectedPackage === "premium" ? "Premium" : selectedPackage === "smart" ? "Smart" : selectedPackage === "lite" ? "Lite" : "Standard"} Rate x {rentalDays} days
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                    {total.toFixed(2)} €
                                </p>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                                <h4 className="text-sm font-bold text-gray-900 mb-2">
                                    SUMMARY OF YOUR RENTAL
                                </h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-700">
                                            {selectedCoverage === "basic" ? "Basic Cover" : selectedCoverage === "premium" ? "Premium Cover" : "Super Premium Cover"}
                                        </span>
                                        <span className="text-green-600 font-medium">INCLUDED</span>
                                    </div>
                                </div>
                            </div>

                            {/* Promotional Code */}
                            <div className="mb-4">
                                <Input
                                    placeholder="Add code"
                                    className="text-sm mb-2"
                                />
                                <Button type="button" variant="outline" size="sm" className="w-full">
                                    Apply
                                </Button>
                            </div>

                            {/* Discount Info */}
                            <div className="mb-4">
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
                            </div>

                            {/* Loyalty Points */}
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-600">
                                    Your booking gives you {Math.floor(total)} Points OK CLUB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form and Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Your Data Section */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Your data</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField 
                                    control={form.control} 
                                    name="firstName" 
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Driver's name *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nyssa" {...field} />
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
                                            <FormLabel>Driver's surname *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Mccall" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} 
                                />

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
                                />

                                <FormField 
                                    control={form.control} 
                                    name="phone" 
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact phone number *</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🇺🇸</span>
                                                    <Input 
                                                        placeholder="+1 (508) 614-8823" 
                                                        className="pl-10"
                                                        {...field} 
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
                                                <Input type="email" placeholder="hamipo@mailinator.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} 
                                />

                                <FormField 
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
                                />
                            </div>

                            {/* MeliáRewards Section */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
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
                            </div>

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
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                        field.value === "credit"
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
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                        field.value === "bizum"
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

                                {/* Scalapay */}
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                        field.value === "scalapay"
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

                                {/* Klarna */}
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div
                                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                                        field.value === "klarna"
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
                                />
                            </div>

                            {/* Credit Card Details (shown when credit card is selected) */}
                            {form.watch("paymentMethod") === "credit" && (
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
                            )}
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
                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-6 text-lg"
                            >
                                CONTINUE
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
