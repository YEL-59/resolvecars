"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userStorage } from "@/lib/userStorage";
import toast from "react-hot-toast";

export default function PersonalInfo() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const user = userStorage.getUser();
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
    setIsLoading(false);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Get current user data
      const user = userStorage.getUser();
      if (!user) {
        toast.error("User not found. Please log in again.");
        return;
      }

      // Update user data
      const updatedUser = {
        ...user,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone,
        // address: address,
      };

      // Save to localStorage
      userStorage.setUser(updatedUser);

      // TODO: Make API call to update user profile on server
      // const response = await updateUserProfile(updatedUser);

      toast.success("Profile updated successfully!");

      // Dispatch event to update navbar if needed
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("userLogin"));
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 border rounded-xl shadow-sm">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-1 gap-6">
      {/* Left Card */}
      <div className="p-6 border rounded-xl shadow-sm space-y-4">
        {/* <div className="flex items-center gap-4">
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
        </div> */}

        <div>
          <h3 className="text-sm font-semibold mb-2">Personal Information</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Update your account details and contact information
          </p>

          <form onSubmit={handleSave}>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {/* <Input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              /> */}
              {/* <Input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              /> */}
              {/* <Button
                type="submit"
                className="w-full mt-3"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button> */}
            </div>
          </form>
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
