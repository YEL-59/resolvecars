// Utility functions for managing user data in localStorage

const USER_KEY = "user_data";
const TOKEN_KEY = "auth_token";

export const userStorage = {
  // Get user data from localStorage
  getUser() {
    if (typeof window === "undefined") return null;
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Error reading user data from localStorage:", error);
      return null;
    }
  },

  // Set user data in localStorage
  setUser(user) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user data to localStorage:", error);
    }
  },

  // Get auth token from localStorage
  getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set auth token in localStorage
  setToken(token) {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Clear user data and token
  clear() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("remember_me");
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  // Get user's full name
  getUserName() {
    const user = this.getUser();
    if (!user) return null;
    return `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
  },

  // Get user's initials for avatar
  getUserInitials() {
    const user = this.getUser();
    if (!user) return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  },
};

export default userStorage;

