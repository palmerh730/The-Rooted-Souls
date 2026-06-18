import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../db';
import { requireAuth } from '../middleware/auth';
import { uploadVideo } from '../utils/youtube';

const router = Router();

// Setup Multer for handling both video and image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 } // 2GB limit
});

// GET all published media (public)
router.get('/', async (req, res) => {
  try {
    let query = supabase
      .from('media_items')
      .select('*, categories(name)')
      .eq('published', true)
      .neq('status', 'processing')
      .order('sort_order', { ascending: true })
      .order('publish_date', { ascending: false });

    if (req.query.category) {
      // Need to find category id by slug first, or just join and filter.
      // Supabase supports foreign table filtering:
      query = query.eq('categories.slug', req.query.category);
    }
    if (req.query.type) {
      query = query.eq('media_type', req.query.type);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Fetch public media error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET all media (protected)
router.get('/all', requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('media_items')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Fetch all media error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single media (public)
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('media_items')
      .select('*, categories(name)')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Media not found' });
  }
});

// POST create media (protected)
router.post('/', requireAuth, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'video_file', maxCount: 1 }]), async (req, res) => {
  const { title, description, category_id, media_type, article_url, article_source, published, featured, publish_date } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const thumbnailPath = files?.['thumbnail']?.[0] ? `/uploads/${files['thumbnail'][0].filename}` : null;
  const videoFile = files?.['video_file']?.[0];

  const status = (media_type === 'video' && videoFile) ? 'processing' : 'ready';
  const videoPlatform = media_type === 'video' ? 'youtube' : null;

  try {
    // 1. Save entry to DB
    const { data, error } = await supabase
      .from('media_items')
      .insert([{
        title,
        description,
        category_id: category_id || null,
        media_type,
        video_platform: videoPlatform,
        article_url,
        article_source,
        thumbnail_path: thumbnailPath,
        published: published === 'true',
        featured: featured === 'true',
        publish_date: publish_date || null,
        status
      }])
      .select()
      .single();

    if (error) throw error;
    const newItem = data;

    // Return response immediately so UI doesn't block
    res.status(201).json(newItem);

    // 2. Background YouTube Upload
    if (status === 'processing' && videoFile) {
      // Run async, catch errors internally
      (async () => {
        try {
          console.log(`Starting background upload for item ${newItem.id}...`);
          const result = await uploadVideo(videoFile.path, title, description || '');
          const videoUrl = `https://www.youtube.com/watch?v=${result.videoId}`;
          
          // Update DB
          await supabase
            .from('media_items')
            .update({
              video_url: videoUrl,
              thumbnail_path: thumbnailPath || result.thumbnailUrl, // keep uploaded thumb if exists
              status: 'ready'
            })
            .eq('id', newItem.id);

          console.log(`Successfully uploaded video ${result.videoId} for item ${newItem.id}`);
        } catch (uploadErr) {
          console.error(`Failed to upload video for item ${newItem.id}:`, uploadErr);
          await supabase.from('media_items').update({ status: 'failed' }).eq('id', newItem.id);
        } finally {
          // Cleanup local video file
          fs.unlink(videoFile.path, (err) => {
            if (err) console.error('Failed to delete temporary video file:', err);
          });
        }
      })();
    }

  } catch (err) {
    console.error('Create media error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update media (protected)
// To keep it simple, we don't allow re-uploading video files here, just metadata and thumbnails.
router.put('/:id', requireAuth, upload.single('thumbnail'), async (req, res) => {
  const { id } = req.params;
  const { title, description, category_id, published, featured, publish_date } = req.body;
  
  const updateData: any = {
    title,
    description,
    category_id: category_id || null,
    published: published === 'true' || published === true,
    featured: featured === 'true' || featured === true,
    publish_date: publish_date || null,
    updated_at: new Date()
  };

  if (req.file) {
    updateData.thumbnail_path = `/uploads/${req.file.filename}`;
  }

  try {
    const { data, error } = await supabase
      .from('media_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Update media error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE media (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const { data: item, error: fetchError } = await supabase
      .from('media_items')
      .select('thumbnail_path')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const { error } = await supabase
      .from('media_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Delete local thumbnail if exists and is local
    if (item.thumbnail_path && item.thumbnail_path.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', item.thumbnail_path);
      fs.unlink(filePath, () => {}); // ignore errors
    }

    res.status(204).send();
  } catch (err) {
    console.error('Delete media error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
