import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'routes', 'static')));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory processing times (ms)
const processingTimes: number[] = [];
const MAX_SAMPLES = 20000;

function recordProcessingTime(ms: number) {
  processingTimes.push(ms);
  if (processingTimes.length > MAX_SAMPLES) processingTimes.shift();
}

// middleware para medir tempo de processamento do servidor
app.use(async (req, res, next) => {
  const start = process.hrtime.bigint();
  // Quando response terminar, calcular
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const diff = Number((end - start) / BigInt(1_000_000)); // ms
    recordProcessingTime(diff);
    res.setHeader('X-Server-Time', diff.toString());
  });
  next();
});

// Endpoints API
app.get('/api/aircraft', async (req, res) => {
  const list = await prisma.aircraft.findMany({ orderBy: { id: 'asc' } });
  res.json(list);
});

app.post('/api/aircraft', async (req, res) => {
  const { name, manufacturer } = req.body;
  if (!name || !manufacturer) return res.status(400).json({ error: 'name & manufacturer required' });
  const created = await prisma.aircraft.create({ data: { name, manufacturer } });
  res.status(201).json(created);
});

// Metrics endpoint (summary)
app.get('/metrics/summary', (req, res) => {
  const arr = processingTimes.slice(-10000);
  if (arr.length === 0) return res.json({ samples: 0, avg: 0, p50: 0, p95: 0, p99: 0 });
  const sorted = [...arr].sort((a, b) => a - b);
  const avg = arr.reduce((s, v) => s + v, 0) / arr.length;
  const percentile = (p: number) => {
    const idx = Math.floor((p / 100) * sorted.length);
    return sorted[Math.max(0, Math.min(sorted.length - 1, idx))];
  };
  res.json({ samples: arr.length, avg, p50: percentile(50), p95: percentile(95), p99: percentile(99) });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});