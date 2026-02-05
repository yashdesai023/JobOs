# 🚀 JobOs Deployment Guide (Netlify)

This guide walks you through deploying the JobOs Frontend to Netlify and configuring your custom domain **yash.jobos.online**.

## Prerequisites
- A GitHub repository containing your `JobOs` code.
- A Netlify account (can login with GitHub).
- Access to your domain DNS provider (where `jobos.online` is managed).

---

## Part 1: Deploying to Netlify

1. **Log in to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com) and log in.

2. **Add New Site**
   - Click **"Add new site"** > **"Import from Git"**.
   - Select **GitHub**.
   - Authorize Netlify and select your `JobOs` repository.

3. **Configure Build Settings**
   Netlify should auto-detect most settings, but verify these:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Environment Variables**
   - Click **"Show advanced"** or go to **Site Settings > Environment variables** after deployment.
   - Add the following variables:
     - `VITE_API_BASE_URL`: The URL of your backend (e.g., `https://jobos-brain.onrender.com`)
     - `VITE_POCKETBASE_URL`: The URL of your PocketBase (e.g., `https://db.jobos.online`)

5. **Deploy Site**
   - Click **"Deploy site"**.
   - Wait for the build to complete. Netlify will give you a random URL (e.g., `witty-badger-123456.netlify.app`).

---

## Part 2: Custom Domain Setup (yash.jobos.online)

1. **Add Domain in Netlify**
   - Go to **Site Configuration** > **Domain management**.
   - Click **"Add a domain"**.
   - Enter `yash.jobos.online`.
   - Click **"Verify"** > **"Add domain"**.

2. **Configure DNS Records**
   Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) where `jobos.online` is managed.

   Add a **CNAME Record**:
   - **Type**: `CNAME`
   - **Host/Name**: `yash`
   - **Value/Target**: `[your-site-name].netlify.app` (The random URL Netlify gave you)

   > **Note**: DNS propagation can take anywhere from a few minutes to 24 hours.

3. **SSL/HTTPS**
   - Once DNS is verified, Netlify generally issues an SSL certificate automatically via Let's Encrypt.
   - You can check the status under **Domain management** > **HTTPS**.

---

## Part 3: Verify Deployment

1. Visit `https://yash.jobos.online`.
2. Test the core flows:
   - **Job Hunter**: Verify it triggers the backend API (Network tab should show valid calls to `VITE_API_BASE_URL`).
   - **PocketBase**: Check if history loads (verifies `VITE_POCKETBASE_URL`).

## Troubleshooting

- **404 on Refresh**: If refreshing a page gives a 404, ensure `netlify.toml` was deployed correctly. It handles the "Rewrite to index.html" rule.
- **API Errors**: Check the browser console (F12). If you see CORS errors, ensure your Backend (`main.py`) allows the origin `https://yash.jobos.online`.

```python
# In backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://yash.jobos.online" # <--- Add this!
    ],
    ...
)
```
