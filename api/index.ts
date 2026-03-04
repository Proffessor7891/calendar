import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import taskRoutes from '../server/src/routes/tasks';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const MONGODB_URI = process.env.MONGODB_URI || '';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  if (!MONGODB_URI) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    await mongoose.connect(mem.getUri());
  } else {
    await mongoose.connect(MONGODB_URI);
  }
  isConnected = true;
};

export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}
