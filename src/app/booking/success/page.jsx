"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, MapPin, User, CreditCard, Car, Download, Mail, Home } from "lucide-react";
import { bookingStorage } from '@/lib/bookingStorage';

export default function BookingSuccess() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    // Get all booking data
    const allData = bookingStorage.getData();
    
    if (!allData || !allData.selectedCar || !allData.step1 || !allData.step2 || !allData.step3) {
      router.push('/cars');
      return;
    }

    setBookingData(allData);
    
    // Generate a booking ID
    const id = 'RC' + Date.now().toString().slice(-8);
    setBookingId(id);

    // Clear booking data after successful booking
    setTimeout(() => {
      bookingStorage.clear();
    }, 1000);
  }, [router]);

  const calculateTotalDays = () => {
    if (!bookingData?.step1) return 1;
    const pickup = new Date(bookingData.step1.pickupDate);
    const dropoff = new Date(bookingData.step1.dropoffDate);
    const diffTime = Math.abs(dropoff - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const calculateTotalPrice = () => {
    if (!bookingData?.selectedCar) return 0;
    const days = calculateTotalDays();
    const dailyRate = parseInt(bookingData.selectedCar.price) || 0;
    const planPrices = { basic: 0, standard: 19, premium: 39 };
    const extrasPrices = { gps: 8, childSeat: 6, additionalDriver: 12, wifi: 7 };
    const protectionPerDay = planPrices[bookingData.step1?.protectionPlan || 'basic'] || 0;
    const extrasPerDay = (bookingData.step1?.extras || []).reduce((sum, id) => sum + (extrasPrices[id] || 0), 0);
    const taxesAndFeesPerDay = 25;
    const totalPerDay = dailyRate + protectionPerDay + extrasPerDay + taxesAndFeesPerDay;
    return totalPerDay * days;
  };

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  const totalDays = calculateTotalDays();
  const totalPrice = calculateTotalPrice();
  const planPrices = { basic: 0, standard: 19, premium: 39 };
  const extrasPrices = { gps: 8, childSeat: 6, additionalDriver: 12, wifi: 7 };
  const protectionPerDay = planPrices[bookingData?.step1?.protectionPlan || 'basic'] || 0;
  const extrasPerDay = (bookingData?.step1?.extras || []).reduce((sum, id) => sum + (extrasPrices[id] || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600">Your car rental has been successfully booked.</p>
        <p className="text-lg font-semibold text-blue-600 mt-2">Booking ID: {bookingId}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={bookingData.selectedCar.image} 
                    alt={bookingData.selectedCar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{bookingData.selectedCar.name}</h3>
                  <p className="text-blue-600 font-medium text-lg">${bookingData.selectedCar.price}/day</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Your vehicle will be ready for pickup at the scheduled time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Rental Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Rental Period</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Pickup Date:</span> {bookingData?.step1?.pickupDate || 'N/A'}</p>
                    <p><span className="font-medium">Drop-off Date:</span> {bookingData?.step1?.dropoffDate || 'N/A'}</p>
                    <p><span className="font-medium">Duration:</span> {totalDays} day{totalDays > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Locations
                  </h4>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium">Pickup:</span> {bookingData?.step1?.pickupLocation || 'N/A'}</p>
                    <p><span className="font-medium">Drop-off:</span> {bookingData?.step1?.dropoffLocation || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {bookingData?.step1?.requirements && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium mb-2">Special Requirements</h4>
                  <p className="text-sm text-gray-600">{bookingData.step1.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {bookingData?.step2?.firstName || 'N/A'} {bookingData?.step2?.lastName || ''}</p>
                  <p><span className="font-medium">Email:</span> {bookingData?.step2?.email || 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {bookingData?.step2?.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium">Age:</span> {bookingData?.step2?.age || 'N/A'}</p>
                  <p><span className="font-medium">License Number:</span> {bookingData?.step2?.licenseNumber || 'N/A'}</p>
                  <p><span className="font-medium">License Expires:</span> {bookingData?.step2?.licenseExpiry || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Information */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Important Information</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700">
              <ul className="space-y-2 text-sm">
                <li>• Please arrive 15 minutes before your pickup time</li>
                <li>• Bring a valid driver's license and credit card</li>
                <li>• Vehicle inspection will be conducted before handover</li>
                <li>• Free cancellation up to 24 hours before pickup</li>
                <li>• Contact us at +1 (555) 123-4567 for any questions</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Daily rate × {totalDays}</span>
                    <span>${parseInt(bookingData.selectedCar.price) * totalDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Protection plan × {totalDays}</span>
                    <span>${protectionPerDay * totalDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Optional extras × {totalDays}</span>
                    <span>${extrasPerDay * totalDays}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxes & fees × {totalDays}</span>
                    <span>${25 * totalDays}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total Paid</span>
                    <span className="text-green-600">${totalPrice}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4" />
                    <span>Paid with {bookingData?.step3?.paymentMethod === 'credit' ? 'Credit Card' : bookingData?.step3?.paymentMethod === 'debit' ? 'Debit Card' : 'PayPal'}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    **** **** **** {bookingData?.step3?.cardNumber?.slice(-4) || '****'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Confirmation
              </Button>
              
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Confirmation
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => router.push('/cars')}
              >
                <Car className="w-4 h-4" />
                Book Another Car
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => router.push('/')}
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p><span className="font-medium">Phone:</span> +1 (555) 123-4567</p>
                <p><span className="font-medium">Email:</span> support@resolvecars.com</p>
                <p><span className="font-medium">Hours:</span> 24/7 Support</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}