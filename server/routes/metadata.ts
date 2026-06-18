import { Router } from 'express';
import * as cheerio from 'cheerio';

const router = Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch URL');
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || '';
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content') || '';
    const image = $('meta[property="og:image"]').attr('content') || '';
    
    res.json({ title, description, image });
  } catch (error) {
    console.error('Metadata fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch metadata. The site might block automated requests.' });
  }
});

export default router;
