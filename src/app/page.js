import Image from "next/image";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, CalendarDays, Users, Star, Fuel, Settings, Shield } from "lucide-react";

export default function Home() {
  const featuredCars = [
    {
      id: 1,
      name: "BMW 3 Series",
      image: "/assets/logo.png",
      price: "$45",
      rating: 4.8,
      features: ["Automatic", "5 Seats", "Petrol"],
      location: "Downtown"
    },
    {
      id: 2,
      name: "Mercedes C-Class",
      image: "/assets/logo.png",
      price: "$55",
      rating: 4.9,
      features: ["Automatic", "5 Seats", "Hybrid"],
      location: "Airport"
    },
    {
      id: 3,
      name: "Audi A4",
      image: "/assets/logo.png",
      price: "$50",
      rating: 4.7,
      features: ["Automatic", "5 Seats", "Diesel"],
      location: "City Center"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Find Your Perfect Ride</h2>
          <p className="text-xl mb-8 opacity-90">Rent premium cars at unbeatable prices. Your journey starts here.</p>
          
          {/* Search Form */}
          <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pickup-location" className="text-sm font-medium">Pickup Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="downtown">Downtown</SelectItem>
                      <SelectItem value="airport">Airport</SelectItem>
                      <SelectItem value="city-center">City Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickup-date" className="text-sm font-medium">Pickup Date</Label>
                  <Input type="date" id="pickup-date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="return-date" className="text-sm font-medium">Return Date</Label>
                  <Input type="date" id="return-date" />
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full h-10">Search Cars</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose ResolveCars?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Multiple Locations</h4>
              <p className="text-muted-foreground">Pick up and drop off at convenient locations across the city.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Premium Quality</h4>
              <p className="text-muted-foreground">Well-maintained, clean vehicles with the latest features.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Flexible Booking</h4>
              <p className="text-muted-foreground">Easy online booking with flexible cancellation policies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Featured Cars</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <Card key={car.id} className="car-card-hover cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{car.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {car.location}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Premium</Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {car.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{car.rating}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{car.price}</div>
                      <div className="text-sm text-muted-foreground">per day</div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
}
