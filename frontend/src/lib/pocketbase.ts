import PocketBase from 'pocketbase';

// Best Practice: Use Environment Variables for Vercel/Cloud Deployment
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://db.jobos.online';

export const pb = new PocketBase(PB_URL);
