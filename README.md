# The Rooted Soul - Website

This is the codebase for **The Rooted Soul** web platform, built with a modern React (Vite) frontend. 

It features a fully functional public gallery for displaying content, and a secured Admin Dashboard for uploading content directly to the database. It uses a **100% Serverless** architecture, meaning there is no backend server to maintain—the frontend talks directly to Supabase!

## Tech Stack
- **Frontend**: React, TypeScript, Vite, React Router
- **Database, Auth & Storage**: Supabase (PostgreSQL)
- **Video Player**: Dynamic Native HTML5 `<video>` Player
- **Legacy Video Storage**: Google YouTube Data API v3 (Client-Side Resumable Uploads)
- **Deployment**: Static File Hosting (Hostinger)

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
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # YouTube API Integration (For Legacy Client-Side Uploads)
   VITE_YOUTUBE_CLIENT_ID=your_google_client_id

   # Web3Forms Integration (For Contact Form)
   VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_key
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   This command starts the Vite frontend at `http://localhost:5173`.

---

## 2. Admin Dashboard & Uploading Media

The Admin Dashboard is the control center for adding media to the website.
Access it by navigating to `/admin/login` on the website and logging in with your Supabase Auth credentials.

### Uploading a Video (Direct Upload)
To keep the website completely clean of any third-party branding, videos are uploaded directly to the database.
1. Select **Video** as the Media Type.
2. Select your video file (`.mp4` or `.mov`). *Note: Limit 50MB per file due to Supabase Free Tier.*
3. **Browser Magic Thumbnails:** The absolute moment you select a video, the browser silently fast-forwards 1.5 seconds into the video, snaps a picture, and prepares it as your thumbnail!
4. (Optional) If you don't like the auto-generated thumbnail, you can manually upload a Custom Thumbnail Image at the bottom of the form to override it.

### Uploading Google Drive Audio Links
1. Select **Article / External Link**.
2. Paste the Google Drive URL.
3. The system automatically intercepts Google Drive links and converts them to embedded audio players natively within the site's Video Modal!

### Reusable YouTube Functionality (Legacy)
We previously built a highly robust, 100% Serverless YouTube uploader. To ensure the codebase remains scalable, **we did not delete this feature!** 
If you ever have a massive video file that exceeds the 50MB Supabase limit, you can easily switch back to YouTube hosting.
- **How it works:** The code utilizes the Google Identity Services API (`VITE_YOUTUBE_CLIENT_ID`). When a user submits a video, it triggers an OAuth popup, gets an access token, initiates a resumable upload session with the YouTube Data API v3, and securely pushes the raw bytes from the browser directly to YouTube.
- **How to re-enable it:** Open `src/pages/admin/AdminMediaForm.tsx`, locate the `type` `<select>` dropdown around line 321, and uncomment/add the `<option value="video">YouTube Video</option>` tag. The entire upload logic is still perfectly intact under the hood.

---

## 3. Deployment (Hostinger)

This platform is completely Serverless, meaning you only need to host the static Frontend files. Since you are using Hostinger Shared Web Hosting, follow these exact manual steps:

### Deployment Checklist
1. Open your terminal in VS Code and run `npm run build`. This creates a `build` folder.
2. Open the newly created `build` folder in your File Explorer.
3. **Important:** Select ALL the files *inside* the `build` folder, right-click them, and click **Compress to ZIP file**.
4. Open your Hostinger File Manager and navigate to `public_html`.
5. Delete everything currently inside `public_html` (except `.htaccess` if you have one).
6. Upload your zip file and **Extract** it directly into `public_html`.
7. Your site is live! Hard-refresh your browser to clear cache.