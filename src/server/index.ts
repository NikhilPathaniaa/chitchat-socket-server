import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { initSocket } from './socket';
import type { Request, Response, NextFunction } from 'express';

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    message: 'ChitChat Socket Server Running',
    version: '1.0.0'
  });
});

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// Initialize socket server
initSocket(server);

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to check server status`);
});
