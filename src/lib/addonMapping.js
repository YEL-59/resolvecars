// Dynamic addon mapping - no static IDs
// Addons are matched dynamically from API by name/slug

// Get addon ID from extra ID by matching with API addons data
// This function matches extras by name with API addons dynamically
export const getAddonId = (extraId, addonsData, extrasData) => {
  // If addonsData is not provided, return null (no static mapping)
  if (!addonsData || !Array.isArray(addonsData) || addonsData.length === 0) {
    return null;
  }

  // Find the extra by ID
  const extra = extrasData?.find(e => e.id === extraId);
  if (!extra || !extra.name) {
    return null;
  }

  // Match by name with API addons
  const extraNameLower = extra.name.toLowerCase();
  const matchingAddon = addonsData.find(a => {
    const addonName = (a.name || "").toLowerCase();
    const addonSlug = (a.slug || "").toLowerCase();
    return addonName === extraNameLower ||
           addonSlug === extraNameLower ||
           addonName.includes(extraNameLower) ||
           extraNameLower.includes(addonName);
  });

  return matchingAddon?.id || null;
};

// Get addon by extra ID (returns full addon object, not just ID)
export const getAddonByExtraId = (extraId, addonsData, extrasData) => {
  if (!addonsData || !Array.isArray(addonsData) || addonsData.length === 0) {
    return null;
  }

  const extra = extrasData?.find(e => e.id === extraId);
  if (!extra || !extra.name) {
    return null;
  }

  const extraNameLower = extra.name.toLowerCase();
  const matchingAddon = addonsData.find(a => {
    const addonName = (a.name || "").toLowerCase();
    const addonSlug = (a.slug || "").toLowerCase();
    return addonName === extraNameLower ||
           addonSlug === extraNameLower ||
           addonName.includes(extraNameLower) ||
           extraNameLower.includes(addonName);
  });

  return matchingAddon || null;
};

