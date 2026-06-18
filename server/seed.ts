import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import supabase from './db';

dotenv.config();

const DEFAULT_CATEGORIES = [
  { name: 'Poem Recitations', slug: 'poem-recitations', sort_order: 1 },
  { name: 'Interviews', slug: 'interviews', sort_order: 2 },
  { name: 'News Features', slug: 'news-features', sort_order: 3 },
];

async function seed(): Promise<void> {
  console.log('🌱 Starting database seed with Supabase...\n');

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('✗ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  // 1. Create admin user
  const { data: existingAdmins, error: adminErr } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email);

  if (adminErr) {
    console.error('Failed to query admins:', adminErr.message);
    process.exit(1);
  }

  if (existingAdmins.length === 0) {
    const hash = await bcrypt.hash(password, 12);
    const { error } = await supabase
      .from('admin_users')
      .insert([{ email, password_hash: hash }]);
      
    if (error) {
      console.error('Failed to create admin:', error.message);
    } else {
      console.log(`✓ Admin user created: ${email}`);
    }
  } else {
    console.log(`✓ Admin user already exists: ${email}`);
  }

  // 2. Seed default categories
  for (const cat of DEFAULT_CATEGORIES) {
    const { data: existing, error: catErr } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', cat.slug);

    if (catErr) {
      console.error(`Failed to query category ${cat.slug}:`, catErr.message);
      continue;
    }

    if (existing.length === 0) {
      const { error } = await supabase
        .from('categories')
        .insert([{ name: cat.name, slug: cat.slug, sort_order: cat.sort_order }]);
        
      if (error) {
        console.error(`Failed to create category ${cat.name}:`, error.message);
      } else {
        console.log(`✓ Category created: ${cat.name}`);
      }
    } else {
      console.log(`✓ Category already exists: ${cat.name}`);
    }
  }

  console.log('\n✅ Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
