import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PersonalInfo from "./PersonalInfo";
import BookingHistory from "./BookingHistory";
import SavedVehicles from "./SavedVehicles";

export default function ProfileMain() {
  return (
    <div className="max-w-6xl mx-auto mt-10">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted rounded-full">
          <TabsTrigger
            value="profile"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Booking History
          </TabsTrigger>
          {/* <TabsTrigger
            value="vehicles"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black"
          >
            Saved Vehicles
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="profile">
          <PersonalInfo />
        </TabsContent>

        <TabsContent value="history">
          <BookingHistory />
        </TabsContent>

        <TabsContent value="vehicles">
          <SavedVehicles />
        </TabsContent>
      </Tabs>
    </div>
  );
}
