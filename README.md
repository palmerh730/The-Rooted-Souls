# The Rooted Soul - Website

This is the codebase for **The Rooted Soul** web platform, built with a modern React (Vite) frontend and a Node.js/Express backend. 

It features a fully functional public gallery for displaying content, and a secured Admin Dashboard for uploading content directly to YouTube and storing metadata in Supabase.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, React Router
- **Backend**: Node.js, Express, TypeScript, `tsx`
- **Database**: Supabase (PostgreSQL)
- **Video Storage**: Google YouTube Data API v3
- **Deployment**: Split Architecture (Hostinger + Render)

---

## 1. Local Development Setup

To run this application locally on your computer, follow these steps:

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory containing the following:
   ```env
   # Backend Port
   PORT=3001
   
   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   
   # Admin Authentication
   ADMIN_EMAIL=your_chosen_admin_email
   ADMIN_PASSWORD=your_chosen_admin_password
   JWT_SECRET=any_long_random_string
   
   # YouTube API Integration
   YOUTUBE_CLIENT_ID=your_google_client_id
   YOUTUBE_CLIENT_SECRET=your_google_client_secret
   YOUTUBE_REFRESH_TOKEN=your_oauth_refresh_token
   
   # Frontend API Endpoint (For Split Deployment)
   # Leave blank for local development
   VITE_API_URL=
   ```

3. **Start the Development Servers**
   ```bash
   npm run dev
   ```
   This command starts both the Vite frontend (Port 5173) and the Node.js backend (Port 3001) simultaneously.

---

## 2. Admin Dashboard & Uploading Media

The Admin Dashboard is the control center for adding media to the website.
Access it by navigating to `/admin/login` on the website.

### Categories
Before uploading media, ensure you have created categories in the **Categories** tab (e.g., "Poem Recitations", "Radio Interviews"). These categories act as filters on the public website.

### Uploading a Video (Direct Upload)
Because of the custom YouTube integration, you upload videos directly from the dashboard!
1. Select **Video** as the Media Type.
2. Select your video file (`.mp4` or `.mov`).
3. Click Save. The video uploads to your private YouTube channel securely in the background. The status will say **Processing**. Once Google finishes processing, it will say **Ready**.

### Uploading Audio (Interviews & Podcasts)
1. Select **Audio / Podcast**.
2. Upload a Cover Image (Thumbnail).
3. Paste the external link (e.g., Spotify, Google Drive). When visitors click this card, it opens the external audio link seamlessly.

### Uploading Articles
1. Select **Article**.
2. Paste the Article URL.
3. Click "Auto-fill details" to scrape the title and description from the external news site!
4. Upload a thumbnail (such as a screenshot of the article).

### Publishing
All newly uploaded media is saved as a **Draft**. Drafts are completely hidden from the public website. Once you verify the video works and the thumbnail looks correct, click **Publish** on the Dashboard to push it live!

---

## 3. Deployment (Split Architecture)

This platform is configured for a **Split Deployment**:
- The **Frontend** lives on Hostinger.
- The **Backend** lives on Render.com.

For full step-by-step instructions on setting this up, please read the `Render_Setup_Guide.md` file included in this repository.

### Quick Deployment Checklist
1. Deploy the `server/index.ts` code to Render.
2. In your local `.env`, set `VITE_API_URL=https://your-render-app-url.onrender.com`.
3. Run `npm run build` locally.
4. Upload the contents of the `/build` folder directly into your Hostinger `public_html` directory.