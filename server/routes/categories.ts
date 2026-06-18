import { Router } from 'express';
import supabase from '../db';
import { requireAuth } from '../middleware/auth';

const router = Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
      
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Fetch categories error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new category (protected)
router.post('/', requireAuth, async (req, res) => {
  const { name, slug, description, sort_order } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'Name and slug required' });

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug, description, sort_order }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Create category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update category (protected)
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, sort_order } = req.body;

  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ name, slug, description, sort_order })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error('Update category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE category (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    // Check if there are media items attached
    const { count, error: countError } = await supabase
      .from('media_items')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    if (countError) throw countError;
    if (count && count > 0) {
      return res.status(400).json({ error: `Cannot delete category with ${count} items attached.` });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
