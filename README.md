# The Rooted Soul - Website

This is the codebase for **The Rooted Soul** web platform, built with a modern React (Vite) frontend. 

It features a fully functional public gallery for displaying content, and a secured Admin Dashboard for uploading content directly to YouTube and storing metadata in Supabase. It uses a **100% Serverless** architecture, meaning there is no backend server to maintain—the frontend talks directly to the database and YouTube!

## Tech Stack
- **Frontend**: React, TypeScript, Vite, React Router
- **Database & Auth**: Supabase (PostgreSQL)
- **Video Storage**: Google YouTube Data API v3 (Client-Side Resumable Uploads)
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
   
   # YouTube API Integration (For Client-Side Uploads)
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

### Categories
Before uploading media, ensure you have created categories in the **Categories** tab (e.g., "Poem Recitations", "Radio Interviews"). These categories act as filters on the public website.

### Uploading a YouTube Video (Direct Client-Side Upload)
Because of the custom Serverless YouTube integration, you upload massive videos directly from your browser to YouTube!
1. Select **YouTube Video** as the Media Type.
2. Select your video file (`.mp4` or `.mov`).
3. Click Save. A **Google Login popup** will appear. Once you click "Allow", your browser will securely upload the bytes directly to YouTube!

### Uploading Articles & External Links
1. Select **Article / External Link**.
2. Paste the URL.
3. Click "Auto-fill details" to scrape the title and description from the external site!
4. Upload a thumbnail (such as a screenshot of the article).

### Uploading Images & Screenshots
1. Select **Image / Screenshot**.
2. Upload your image file. The file is uploaded securely to your Supabase `media` bucket, and the public URL is saved in the database automatically.

---

## 3. Deployment (Hostinger)

This platform is completely Serverless, meaning you only need to host the static Frontend files.

### Deployment Checklist
1. DO NOT upload your `.env` file!
2. Delete the `node_modules` folder.
3. Zip the entire `Alan MacDonald` folder.
4. Upload the zip to Hostinger using the **Vite** preset.
5. In the Hostinger Environment Variables UI (at the bottom of the deployment screen), add all 4 `VITE_` variables listed in step 1.
6. Click **Save and Redeploy**.
7. *Important:* Ensure your Hostinger domain is added to the "Authorized JavaScript origins" in your Google Cloud Console so the YouTube uploader popup functions correctly.