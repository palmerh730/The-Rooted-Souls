import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Removed local db initialization
import authRoutes from './routes/auth';
import categoryRoutes from './routes/categories';
import mediaRoutes from './routes/media';
import uploadRoutes from './routes/upload';
import metadataRoutes from './routes/metadata';

// ── Ensure uploads directory exists ──────────────────────────────────────────

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Express app ──────────────────────────────────────────────────────────────

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: isProduction ? undefined : false,
}));

app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://therootedsoulbooks.com', 
    'https://www.therootedsoulbooks.com'
  ],
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Static files ─────────────────────────────────────────────────────────────

app.use('/uploads', express.static(uploadsDir));

// ── API routes ───────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/metadata', metadataRoutes);

// ── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Production: serve Vite build + SPA fallback ──────────────────────────────

if (isProduction) {
  const buildDir = path.join(__dirname, '..', 'build');
  app.use(express.static(buildDir));

  // SPA fallback: serve index.html for all non-API, non-upload routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.sendFile(path.join(buildDir, 'index.html'));
  });
}

// ── Start server ─────────────────────────────────────────────────────────────

async function start(): Promise<void> {
  try {
    // Database initialization is handled via Supabase SQL Editor

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`   Mode: ${isProduction ? 'production' : 'development'}`);
      console.log(`   Uploads: ${uploadsDir}\n`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
