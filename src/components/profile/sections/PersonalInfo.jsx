import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PersonalInfo() {
  return (
    <div className="grid md:grid-cols-1 gap-6">
      {/* Left Card */}
      <div className="p-6 border rounded-xl shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <img
            src="https://via.placeholder.com/80"
            alt="profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex flex-col gap-2">
            <Button variant="secondary">Upload Photo</Button>
            <Button variant="destructive" size="sm">
              Remove
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2">Personal Information</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Update your account details and contact information
          </p>

          <div className="space-y-3">
            <div className="flex gap-4">
              <div className="w-1/2">
                <Input placeholder="Full Name" defaultValue="John Smith" />
              </div>
              <div className="w-1/2">
                <Input
                  placeholder="Email"
                  defaultValue="john.smith@gmail.com"
                />
              </div>
            </div>
            <Input
              placeholder="Phone Number"
              defaultValue="+1 (555) 123–4567"
            />
            <Input placeholder="Address" />
            <Button className="w-full mt-3">Save Changes</Button>
          </div>
        </div>
      </div>

      {/* Right Card */}
      {/* <div className="p-6 border rounded-xl shadow-sm space-y-4">
        <h3 className="text-sm font-semibold mb-2">Rental Preferences</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Set your default preferences for faster booking
        </p>

        <div className="space-y-3">
          <Input placeholder="Preferred Car Type" />
          <Input placeholder="Transmission" />
          <Input placeholder="Fuel Type" />
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-600 hover:bg-red-50"
          >
            Update Preferences
          </Button>
        </div>
      </div> */}
    </div>
  );
}
