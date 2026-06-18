import dotenv from 'dotenv';
import supabase from './db';

dotenv.config();

async function addPodcastCategory() {
  const { error } = await supabase
    .from('categories')
    .insert([{ name: 'Podcasts', slug: 'podcasts', sort_order: 4 }]);
    
  if (error) {
    console.error('Failed to add Podcasts:', error.message);
  } else {
    console.log('✓ Podcasts category added successfully.');
  }
}

addPodcastCategory();
