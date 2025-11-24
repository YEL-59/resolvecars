// Mapping from extras IDs (used in UI) to API addon IDs
// These IDs match the actual API response from /api/v1/addons
export const addonIdMapping = {
  roadAssistance: 1,      // Road Assistance - ID 1
  petPack: 2,             // Pet Pack - ID 2
  additionalDriver: 3,     // Additional Driver - ID 3
  childSeat: 4,           // Child car seats - ID 4 (quantity based on child seat types)
  youngDriver: 5,         // Young Driver - ID 5
  fastTrack: 6,           // Fast Track - ID 6
  gps: 7,                 // GPS - ID 7
  // Note: foundationDonation is NOT in the addons API - it might be handled separately
  foundationDonation: null,  // Othman Khtri Foundation Donation - not in addons API
};

// Get addon ID from extra ID
export const getAddonId = (extraId) => {
  return addonIdMapping[extraId] || null;
};

// Get all addon IDs
export const getAllAddonIds = () => {
  return addonIdMapping;
};

