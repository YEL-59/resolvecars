"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, CreditCard, IdCard, MapPin, Receipt, CheckCircle2 } from "lucide-react";

const countries = [
    "United States", "Canada", "United Kingdom", "Germany", "France",
    "Australia", "Japan", "South Korea", "Singapore", "Netherlands"
];

export default function Step3Payment({ onPrev, onNext }) {
    const form = useFormContext();

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : v;
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4);
        return v;
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(() => onNext())} className="space-y-6">
                {/* Panel header */}
                <div className="rounded-xl border bg-rose-50/60 p-4 md:p-6">
                    <div className="flex items-center gap-2 border-b pb-4">
                        <CreditCard className="h-5 w-5 text-rose-600" />
                        <h2 className="text-lg md:text-xl font-semibold text-rose-900">Payment Information</h2>
                    </div>

                    {/* Payment Method */}
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <Receipt className="h-4 w-4 text-rose-600" />
                            <h3 className="text-base font-medium text-rose-900">Payment Method</h3>
                        </div>

                        <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Method</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || 'credit'}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="credit">Credit Card</SelectItem>
                                        <SelectItem value="debit">Debit Card</SelectItem>
                                        <SelectItem value="paypal">PayPal</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cardholderName" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cardholder Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="cardNumber" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                                        value={field.value || ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* Driver Information (card security) */}
                    <div className="space-y-4 pt-6 border-t">
                        <div className="flex items-center gap-2">
                            <IdCard className="h-4 w-4 text-rose-600" />
                            <h3 className="text-base font-medium text-rose-900">Driver Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="expiryDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="cvv" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="123" maxLength={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>

                    {/* Billing Address */}
                    <div className="space-y-4 pt-6 border-t">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-rose-600" />
                            <h3 className="text-base font-medium text-rose-900">Billing Address</h3>
                        </div>

                        <FormField control={form.control} name="billingAddress" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="123 Main Street" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="New York" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="zipCode" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ZIP Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="10001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="country" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ''}>
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
                            )} />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between pt-6">
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
                            Review & Book
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Info banner */}
                <div className="rounded-lg border mt-4 p-3 bg-emerald-50 border-emerald-200 text-emerald-700 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Cancel up to 1 hour before pick-up and your booking will be fully refunded.</span>
                </div>
            </form>
        </Form>
    );
}




