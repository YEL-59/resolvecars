// Coverage Plans Data
export const coveragePlans = {
  basic: {
    id: "basic",
    name: "Basic Cover",
    status: "MUCHO",
    basePrice: 0, // Included in base rate
    franchise: 1200, // €
    included: [
      {
        name: "Civil liability insurance",
        checked: true,
      },
    ],
    excluded: [
      "Cover against damage to bodywork, windows and wheels",
      "Pick-up at Lounge Plus",
      "Roadside assistance",
      "Telemedicine services",
    ],
    refundable: false,
    cancellationFree: false,
    amendmentFree: false,
  },
  premium: {
    id: "premium",
    name: "Premium Cover",
    status: "SELECTED",
    basePrice: 25.83, // €/day (from the pricing card)
    totalFor23Days: 594, // Total for 23 days
    included: [
      {
        name: "EXCESS WAIVER",
        hasInfo: true,
      },
      {
        name: "Civil liability insurance",
        checked: true,
      },
      {
        name: "Cover against damage to bodywork, windows and wheels",
        checked: true,
      },
      {
        name: "Fast Track",
        checked: true,
      },
    ],
    excluded: [
      "Pick-up at Lounge Plus",
      "Roadside assistance",
      "Telemedicine services",
    ],
    refundable: true,
    cancellationFree: true,
    amendmentFree: true,
  },
  superPremium: {
    id: "superPremium",
    name: "Super Premium Cover",
    status: "MORE COMPREHENSIVE",
    dailyPrice: 6.21, // Additional €/day
    included: [
      {
        name: "EXCESS WAIVER",
        hasInfo: true,
      },
      {
        name: "Civil liability insurance",
        checked: true,
      },
      {
        name: "Cover against damage to bodywork, windows and wheels",
        checked: true,
      },
      {
        name: "Fast Track",
        checked: true,
      },
      {
        name: "Pick-up at Lounge Plus",
        checked: true,
      },
      {
        name: "Roadside assistance",
        checked: true,
      },
      {
        name: "Telemedicine services",
        checked: true,
      },
    ],
    excluded: [],
    refundable: true,
    cancellationFree: true,
    amendmentFree: true,
  },
};

// Extras and Add-ons Data
export const extrasData = [
  {
    id: "roadAssistance",
    name: "Road Assistance",
    description: "In case of a breakdown we replace your vehicle with another one of our fleet.",
    price: 61.0,
    pricingType: "per_booking", // per_booking or per_day
    category: "coverage",
  },
  {
    id: "foundationDonation",
    name: "Othman Khtri Foundation Donation",
    description: "Get on board with our global social and humanitarian project.",
    price: 0, // User selects amount
    pricingType: "per_booking",
    category: "charity",
    donationOptions: [1, 5, 10, 20, 0], // 0 means "Other"
  },
  {
    id: "petPack",
    name: "Pet Pack",
    description: "The perfect solution for people traveling with animals. Includes:",
    includes: [
      "Pet safety belt",
      "Separation net",
      "OK Mobility pet",
    ],
    price: 25.0,
    pricingType: "per_booking",
    category: "accessories",
  },
  {
    id: "additionalDriver",
    name: "Additional Driver",
    description: "Add a second driver to your booking.",
    price: 5.22,
    pricingType: "per_day",
    category: "driver",
  },
  {
    id: "childSeat",
    name: "Child car seats",
    description: "If you are traveling with children under 12 years or up to 135 cm in height, include a child seat in your reservation and travel safely. In Spain children under 35 kg of weight must use a safety seat.",
    price: 5.22,
    pricingType: "per_day",
    category: "accessories",
  },
  {
    id: "youngDriver",
    name: "Young Driver",
    description: "If you are between 18 and 25 years old, you must include this extra to your booking.",
    price: 12.0,
    pricingType: "per_day",
    category: "driver",
    required: false, // Can be required based on age
  },
  {
    id: "fastTrack",
    name: "Fast Track",
    description: "When you arrive at the rental car pick-up store, you will be seen to quickly, saving time.",
    price: 0.0,
    pricingType: "per_booking",
    category: "service",
    includedInPremium: true, // Already included in Premium Cover
    autoInclude: true, // Auto-include when premium coverage is selected
  },
  {
    id: "gps",
    name: "GPS",
    description: "Add a GPS to your booking and discover the best routes during your trip.",
    price: 5.22,
    pricingType: "per_day",
    category: "accessories",
  },
];

// Mapping from car card package IDs to coverage plans
export const packageToCoverageMap = {
  premium: "premium",
  smart: "premium", // Smart also uses Premium Cover
  lite: "lite", // Lite might have different coverage
  standard: "standard", // Standard might have different coverage
};

