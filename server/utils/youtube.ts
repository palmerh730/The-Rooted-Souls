import { google } from 'googleapis';
import fs from 'fs';

export async function uploadVideo(
  filePath: string,
  title: string,
  description: string
): Promise<{ videoId: string; thumbnailUrl: string }> {
  try {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('YouTube API credentials are not configured in .env');
    }

    // Initialize OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground' // Must match the Authorized Redirect URI
    );

    // Set the refresh token
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    // Create YouTube service
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    const fileSize = fs.statSync(filePath).size;
    
    // Upload the video
    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title,
          description: description,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'unlisted', // Default to unlisted for review
          embeddable: true,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    const videoId = response.data.id;
    if (!videoId) {
      throw new Error('Upload succeeded but no videoId returned.');
    }

    // Attempt to wait for processing to generate high-res thumbnail.
    // YouTube's thumbnail API often returns 404 until processing finishes.
    // To keep it simple, we just construct the URL manually. The highest res might take time to appear.
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return { videoId, thumbnailUrl };
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw error;
  }
}
