// Booking data storage utility for managing data across pages

const BOOKING_STORAGE_KEY = 'booking_data';

export const bookingStorage = {
  // Get all booking data
  getData: () => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(BOOKING_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading booking data:', error);
      return null;
    }
  },

  // Set booking data
  setData: (data) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving booking data:', error);
    }
  },

  // Update specific step data
  updateStep: (step, stepData) => {
    const currentData = bookingStorage.getData() || {};
    // Merge with existing step data to preserve all fields
    const existingStepData = currentData[step] || {};
    const updatedData = {
      ...currentData,
      [step]: {
        ...existingStepData, // Preserve existing step data
        ...stepData, // Override with new data
      },
      lastUpdated: new Date().toISOString()
    };
    bookingStorage.setData(updatedData);
    return updatedData;
  },

  // Get specific step data
  getStep: (step) => {
    const data = bookingStorage.getData();
    return data ? data[step] : null;
  },

  // Clear all booking data
  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(BOOKING_STORAGE_KEY);
  },

  // Get selected car data
  getCar: () => {
    const data = bookingStorage.getData();
    return data ? data.selectedCar : null;
  },

  // Set selected car data
  setCar: (carData) => {
    const currentData = bookingStorage.getData() || {};
    const updatedData = {
      ...currentData,
      selectedCar: carData,
      lastUpdated: new Date().toISOString()
    };
    bookingStorage.setData(updatedData);
    return updatedData;
  }
};

// Default form data structure
export const defaultBookingData = {
  selectedCar: null,
  step1: {
    pickupDate: '',
    dropoffDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    requirements: '',
    protectionPlan: 'basic',
    extras: []
  },
  step2: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    age: ''
  },
  step3: {
    paymentMethod: 'credit',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  },
  step4: {
    termsAccepted: false,
    newsletterSubscribe: false
  }
};