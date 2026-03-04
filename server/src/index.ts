import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

async function getMongoUri(): Promise<string> {
  if (MONGODB_URI) return MONGODB_URI;
  // Fallback: in-memory MongoDB for local dev without MongoDB installed
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const memServer = await MongoMemoryServer.create();
  const uri = memServer.getUri();
  console.log('Using in-memory MongoDB (no external MongoDB needed)');
  return uri;
}

getMongoUri()
  .then(uri => mongoose.connect(uri))
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
