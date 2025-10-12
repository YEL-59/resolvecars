'use client'

import { useState } from 'react'
import { ArrowLeft, Star, Users, Settings, Fuel, Calendar, MapPin, Clock, Shield, Car, CheckCircle, Heart, Share2, ChevronRight, Fan, Shield as ShieldIcon, Bluetooth, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useRouter } from 'next/navigation'
import Layout from '../layout/Layout'

// Sample car data - in a real app, this would come from an API
const carsData = [
  {
    id: '1',
    name: 'BMW 5 Series',
    type: 'Premium',
    year: 2023,
    image: '/assets/cars/bmw-5-series.jpg',
    rating: 4.8,
    reviews: 127,
    passengers: 5,
    luggage: '3 Large Bags',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engine: '2.0L Turbo',
    price: 89,
    description: 'Experience luxury and performance in this executive sedan',
    features: [
      'Air Conditioning',
      'Advanced Safety',
      'Bluetooth',
      'GPS Ready'
    ],
    location: 'Airport Terminal 1',
    pickupInfo: 'International Airport, Terminal 1, Rental Car Center, Level 1',
    available: 'Available 24/7'
  }
]

export default function CarDetailsPage({ carId }) {
  const router = useRouter()
  const [selectedProtection, setSelectedProtection] = useState('basic')
  const [selectedExtras, setSelectedExtras] = useState([])

  // Find the car by ID
  const car = carsData.find(c => c.id === carId) || carsData[0]

  const handleBookNow = () => {
    // Handle booking logic here
    console.log('Booking car:', car.name)
  }

  const handleExtraChange = (extra) => {
    setSelectedExtras(prev =>
      prev.includes(extra)
        ? prev.filter(item => item !== extra)
        : [...prev, extra]
    )
  }

  const protectionPlans = [
    {
      id: 'basic',
      name: 'Basic Rate',
      price: 89,
      description: 'Perfect for budget-conscious travelers who need reliable transportation.',
      selected: selectedProtection === 'basic',
      details: {
        pricing: {
          dailyRate: 89,
          securityDeposit: 'None',
          cancellation: 'Free'
        },
        features: [
          'Basic insurance',
          'Standard vehicle maintenance',
          '24/7 emergency support'
        ],
        cancellationPolicy: 'Cancel up to 24 hours before pickup'
      }
    },
    {
      id: 'standard',
      name: 'Standard Protection',
      price: 108,
      description: 'Enhanced protection with reduced liability and comprehensive coverage.',
      selected: selectedProtection === 'standard',
      details: {
        pricing: {
          dailyRate: 108,
          securityDeposit: '$200',
          cancellation: 'Free'
        },
        features: [
          'Collision Damage Waiver (CDW)',
          'Theft Protection (TP)',
          'Third Party Liability up to $1M',
          'Reduced excess to $500',
          'Personal Accident Insurance'
        ],
        cancellationPolicy: 'Cancel up to 24 hours before pickup'
      }
    },
    {
      id: 'premium',
      name: 'Premium Protection',
      price: 128,
      description: 'Maximum protection with zero excess and comprehensive coverage.',
      selected: selectedProtection === 'premium',
      details: {
        pricing: {
          dailyRate: 128,
          securityDeposit: 'None',
          cancellation: 'Free'
        },
        features: [
          'Full Collision Damage Waiver',
          'Complete Theft Protection',
          'Third Party Liability up to $5M',
          'Zero excess - no deductible',
          'Personal Effects Coverage',
          'Emergency Medical Coverage'
        ],
        cancellationPolicy: 'Cancel up to 24 hours before pickup'
      }
    }
  ]

  const optionalExtras = [
    {
      id: 'gps',
      name: 'GPS Navigation',
      price: 9,
      description: 'Never get lost with premium GPS'
    },
    {
      id: 'child-seat',
      name: 'Child Seat',
      price: 12,
      description: 'Safety first for your little ones'
    },
    {
      id: 'additional-driver',
      name: 'Additional Driver',
      price: 20,
      description: 'Add a second authorized driver'
    }
  ]

  const totalExtras = selectedExtras.reduce((sum, extraId) => {
    const extra = optionalExtras.find(e => e.id === extraId)
    return sum + (extra ? extra.price : 0)
  }, 0)

  const total = (car.price * 3) + totalExtras

  return (

    <Layout> <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Search
            </button>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Overview Card */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                    {car.type}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{car.rating}</span>
                    <span className="text-sm text-gray-500">({car.reviews} reviews)</span>
                  </div>
                </div>
                <p className="text-gray-600 text-lg">{car.description}</p>
              </CardContent>
            </Card>

            {/* Car Specifications Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <Car className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Type</p>
                      <p className="font-medium">Premium Sedan</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Passengers</p>
                      <p className="font-medium">{car.passengers} Adults</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Luggage</p>
                      <p className="font-medium">{car.luggage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <Fuel className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="font-medium">{car.fuelType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <Settings className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-medium">{car.transmission}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3">
                    <Car className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Engine</p>
                      <p className="font-medium">{car.engine}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Protection Plans */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Protection Plans</h2>
              <Accordion type="single" collapsible className="w-full">
                {protectionPlans.map((plan) => (
                  <AccordionItem key={plan.id} value={plan.id}>
                    <AccordionTrigger
                      className={`px-6 py-4 hover:no-underline ${plan.selected ? 'bg-red-50 border border-red-200' : ''
                        }`}
                      onClick={() => setSelectedProtection(plan.id)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{plan.name}</h3>
                            {plan.id === 'basic' && (
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{plan.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold">${plan.price}/day</span>
                          {plan.selected && <ChevronRight className="w-5 h-5 text-red-500" />}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <Card className={`border ${plan.selected ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                        <CardContent className="p-6">
                          <div className="space-y-6">
                            {/* Pricing Breakdown and Included Features */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Pricing Breakdown */}
                              <div>
                                <h4 className="font-bold text-gray-900 mb-3">Pricing Breakdown</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Daily Rate:</span>
                                    <span className="font-medium">${plan.details.pricing.dailyRate}/day</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Security Deposit:</span>
                                    <span className="font-medium">{plan.details.pricing.securityDeposit}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Cancellation:</span>
                                    <span className="font-medium text-green-600">{plan.details.pricing.cancellation}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Included Features */}
                              <div>
                                <h4 className="font-bold text-gray-900 mb-3">Included Features</h4>
                                <div className="space-y-2">
                                  {plan.details.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                      <span className="text-gray-700">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Cancellation Policy */}
                            <div className={`p-4 rounded-lg border ${plan.selected ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${plan.selected ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                                <div>
                                  <h5 className="font-medium text-gray-900 mb-1">Cancellation Policy</h5>
                                  <p className="text-sm text-gray-600">{plan.details.cancellationPolicy}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Included Features */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Included Features</h2>
              <div className="grid grid-cols-2 gap-4">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {feature === 'Air Conditioning' && <Fan className="w-5 h-5 text-gray-600" />}
                    {feature === 'Advanced Safety' && <ShieldIcon className="w-5 h-5 text-gray-600" />}
                    {feature === 'Bluetooth' && <Bluetooth className="w-5 h-5 text-gray-600" />}
                    {feature === 'GPS Ready' && <Navigation className="w-5 h-5 text-gray-600" />}
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Vehicle Description</h2>
              <p className="text-gray-600 leading-relaxed">
                The BMW 5 Series combines luxury and performance with a powerful yet efficient engine.
                This premium vehicle offers exceptional comfort, advanced safety features, and cutting-edge
                technology for an unparalleled driving experience. Perfect for business trips or special occasions.
              </p>
            </div>

            {/* Important Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Important Information</h2>
              <ul className="space-y-2 text-gray-600">
                <li>• Minimum age: 25 years</li>
                <li>• Valid driver's license required</li>
                <li>• Credit card for security deposit</li>
                <li>• Fuel policy: Return with same level</li>
              </ul>
            </div>

            {/* Pickup Location */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Pickup Location</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-medium text-lg">{car.location}</h3>
                    <p className="text-gray-600">{car.pickupInfo}</p>
                    <p className="text-sm text-gray-500">{car.available}</p>
                    <Button variant="outline" className="w-full border-red-500 text-red-500 hover:bg-red-50">
                      View in Map
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-bold">Booking Summary</h3>
                </div>

                {/* Pickup/Return Details */}
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pickup</p>
                    <p className="text-sm text-gray-600">Dec 15, 2024 • 10:00 AM</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Return</p>
                    <p className="text-sm text-gray-600">Dec 18, 2024 • 10:00 AM</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">{car.location}</span>
                  </div>
                </div>

                {/* Base Rate */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">Base rate (3 days)</span>
                  <span className="text-sm font-medium">$267</span>
                </div>

                {/* Protection Plans Selection */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium text-gray-900">Protection Plans</h4>
                  <div className="space-y-2">
                    {protectionPlans.map((plan) => (
                      <div key={plan.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={plan.id}
                            name="protection"
                            checked={plan.selected}
                            onChange={() => setSelectedProtection(plan.id)}
                            className="w-4 h-4 text-red-600"
                          />
                          <label htmlFor={plan.id} className="text-sm">
                            {plan.name}
                            {plan.id === 'basic' && (
                              <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                Included
                              </span>
                            )}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional Extras */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium text-gray-900">Optional Extras</h4>
                  <div className="space-y-3">
                    {optionalExtras.map((extra) => (
                      <div key={extra.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={extra.id}
                            checked={selectedExtras.includes(extra.id)}
                            onCheckedChange={() => handleExtraChange(extra.id)}
                          />
                          <div>
                            <label htmlFor={extra.id} className="text-sm font-medium">
                              {extra.name}
                            </label>
                            <p className="text-xs text-gray-500">{extra.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">${extra.price}/day</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold text-red-500">${total}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Includes all taxes and fees</p>
                </div>

                {/* Book Now Button */}
                <Button
                  onClick={handleBookNow}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg font-medium mb-3"
                >
                  Book Now
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Free cancellation up to 24 hours before pickup
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div></Layout>

  )
}