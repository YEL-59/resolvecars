import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CarFront } from "lucide-react";

const bookings = [
  {
    id: 1,
    car: "Toyota Corolla",
    type: "Compact",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
    price: "$240",
    date: "Dec 15, 2024 – Dec 18, 2024",
    pickup: "Airport Terminal 1",
    dropoff: "Downtown Branch",
    showCancel: false,
  },
  {
    id: 2,
    car: "BMW X3",
    type: "Compact",
    status: "Confirmed",
    statusColor: "bg-blue-100 text-blue-700",
    price: "$240",
    date: "Dec 15, 2024 – Dec 18, 2024",
    pickup: "Airport Terminal 1",
    dropoff: "Downtown Branch",
    showCancel: true,
  },
  {
    id: 3,
    car: "Ford Focus",
    type: "Compact",
    status: "Canceled",
    statusColor: "bg-red-100 text-red-700",
    price: "$240",
    date: "Dec 15, 2024 – Dec 18, 2024",
    pickup: "Airport Terminal 1",
    dropoff: "Downtown Branch",
    showCancel: false,
  },
];

const BookingHistory = () => {
  return (
    <div className="border rounded-xl p-6">
      <h2 className="text-lg font-semibold">Booking History</h2>
      <p className="text-sm text-muted-foreground mb-6">
        View and manage your past and upcoming reservations
      </p>

      <div className="space-y-4">
        {bookings.map((item) => (
          <Card
            key={item.id}
            className="border shadow-none hover:shadow-sm transition rounded-xl"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="bg-red-50 p-2 rounded-lg">
                  <CarFront className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{item.car}</h3>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium rounded-full"
                    >
                      {item.type}
                    </Badge>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.statusColor}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{item.pickup}</span>
                    <span>→</span>
                    <MapPin className="w-4 h-4" />
                    <span>{item.dropoff}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-row flex-col w-full sm:w-auto">
                <span className="text-lg font-semibold">{item.price}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {item.showCancel && (
                    <Button variant="destructive" size="sm">
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
