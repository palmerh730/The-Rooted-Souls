# Split Deployment: Render & Hostinger Setup Guide

This guide explains how to properly configure your website for a **Split Deployment**. The React frontend will live on Hostinger (so it's lightning fast and on your main domain), and the Node.js backend will live on Render.com (to safely process YouTube uploads and database queries).

## Step 1: Deploying the Backend to Render
1. Create a free account at [Render.com](https://render.com/).
2. Click **New** -> **Web Service**.
3. Choose **Build and deploy from a Git repository**.
4. Connect your GitHub account and select your repository.
5. In the configuration settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npx tsx server/index.ts`
   - **Instance Type**: Free
6. **Environment Variables**:
   Scroll down to Advanced -> Environment Variables and add ALL the secrets from your `.env` file EXACTLY as they appear locally:
   - `NODE_ENV` (Set to `production`)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `YOUTUBE_CLIENT_ID`
   - `YOUTUBE_CLIENT_SECRET`
   - `YOUTUBE_REFRESH_TOKEN`
7. Click **Create Web Service**. Render will now automatically deploy your backend. It will give you a public URL (like `https://rooted-soul-api.onrender.com`). Copy this URL!

## Step 2: Deploying the Frontend to Hostinger
Now we build the frontend and point it to the new Render backend!

1. On your local computer, open your `.env` file.
2. Add your new Render URL as the API variable:
   ```env
   VITE_API_URL=https://rooted-soul-api.onrender.com
   ```
3. Run the Vite build command:
   ```bash
   npm run build
   ```
4. This creates a new folder called `/build`.
5. Log into your Hostinger control panel. Open the **File Manager**.
6. Open your `public_html` folder.
7. Upload **all of the files** from inside your local `/build` folder directly into `public_html`.

You are done! Your live Hostinger domain now displays the website perfectly, and whenever you log into the admin dashboard, the frontend securely asks your Render backend to handle the heavy lifting!
