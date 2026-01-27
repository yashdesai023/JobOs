// START: Centralized API Configuration
// Best Practice: Use Environment Variables for Vercel/Cloud Deployment
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://jobos-brain.onrender.com';
// Fallback is currently set to the Production Render URL
// END: Centralized API Configuration
