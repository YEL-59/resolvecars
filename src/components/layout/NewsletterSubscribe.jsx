"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";

export const NewsletterSubscribe = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!name || !email || !consent) {
      alert("Please fill all fields and give consent.");
      return;
    }
    // handle subscription logic here
    console.log({ name, email, consent });
  };

  return (
    <div className="bg-[#fdf5f5] py-16 px-6 sm:px-12 lg:px-24 rounded-lg flex flex-col lg:flex-row items-center justify-between gap-6">
      {/* Left Text */}
      <div className="max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Stay Updated with Our Latest Offers
        </h2>
        <p className="text-gray-600">
          Join now and don't let any promotions slip through your fingers.
        </p>
      </div>
      <div>
        {/* Right Form */}
        <form
          onSubmit={handleSubscribe}
          className="flex flex-wrap gap-5 w-full max-w-xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full max-w-xl">
            <Input
              type="text"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="email"
              placeholder="Enter your e-mail address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              className="bg-[#ff6b6b] hover:bg-[#ff5252] text-white"
            >
              Subscribe
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:flex-1 justify-start">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={setConsent}
            />
            <Label
              htmlFor="consent"
              className="text-xs text-gray-500 flex-1 max-w-lg"
            >
              Yes, I give my consent to receive information and personalized
              offers from View.{" "}
              <span className="text-gray-700">
                <Link href="/privacy" className="underline truncate">
                  Privacy Policy
                </Link>
              </span>
            </Label>
          </div>
        </form>
      </div>
    </div>
  );
};
