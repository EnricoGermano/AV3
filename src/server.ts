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

// Middleware para medir tempo de processamento do servidor
app.use(async (req, res, next) => {
  const start = process.hrtime.bigint();
  // Quando response terminar, calcular
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const diff = Number((end - start) / BigInt(1_000_000)); // ms
    recordProcessingTime(diff);
  });
  next();
});

// ======================================
// AUTENTICAÇÃO (LOGIN/REGISTER)
// ======================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { nome, email, senha, cargo } = req.body;
    
    if (!nome || !email || !senha || !cargo) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha,
        cargo
      }
    });

    res.status(201).json({ 
      id: user.id, 
      nome: user.nome, 
      email: user.email,
      cargo: user.cargo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || user.senha !== senha) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    if (!user.ativo) {
      return res.status(403).json({ error: 'Usuário inativo' });
    }

    res.json({ 
      id: user.id,
      nome: user.nome,
      email: user.email,
      cargo: user.cargo,
      token: Buffer.from(`${user.id}:${user.email}`).toString('base64')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.get('/api/auth/check', async (req, res) => {
  try {
    const count = await prisma.user.count();
    res.json({ hasUsers: count > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar usuários' });
  }
});

// ======================================
// AIRCRAFT (AERONAVES)
// ======================================

app.get('/api/aircraft', async (req, res) => {
  try {
    const list = await prisma.aeronave.findMany({ orderBy: { id: 'asc' } });
    res.json(list);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch aircraft' });
  }
});

app.post('/api/aircraft', async (req, res) => {
  try {
    const { codigo, modelo, tipo, capacidade, alcance } = req.body;
    
    if (!codigo || !modelo || !tipo || !capacidade || !alcance) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const created = await prisma.aeronave.create({
      data: {
        codigo,
        modelo,
        tipo,
        capacidade: parseInt(capacidade),
        alcance: parseInt(alcance)
      }
    });

    res.status(201).json(created);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Aircraft code already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create aircraft' });
    }
  }
});

app.get('/api/aircraft/:id', async (req, res) => {
  try {
    const aircraft = await prisma.aeronave.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!aircraft) return res.status(404).json({ error: 'Aircraft not found' });
    res.json(aircraft);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch aircraft' });
  }
});

app.delete('/api/aircraft/:id', async (req, res) => {
  try {
    const deleted = await prisma.aeronave.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete aircraft' });
  }
});

// ======================================
// PARTS (PEÇAS)
// ======================================

app.get('/api/parts', async (req, res) => {
  try {
    const list = await prisma.peca.findMany({ orderBy: { id: 'asc' } });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parts' });
  }
});

app.post('/api/parts', async (req, res) => {
  try {
    const { nome, tipo, fornecedor, status } = req.body;
    
    if (!nome || !tipo || !fornecedor || !status) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const created = await prisma.peca.create({
      data: { nome, tipo, fornecedor, status }
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create part' });
  }
});

app.delete('/api/parts/:id', async (req, res) => {
  try {
    const deleted = await prisma.peca.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete part' });
  }
});

// ======================================
// EMPLOYEES (FUNCIONÁRIOS)
// ======================================

app.get('/api/employees', async (req, res) => {
  try {
    const list = await prisma.funcionario.findMany({ orderBy: { id: 'asc' } });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const { nome, email, telefone, cargo, endereco } = req.body;
    
    if (!nome || !email || !telefone || !cargo || !endereco) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const created = await prisma.funcionario.create({
      data: { nome, email, telefone, cargo, endereco }
    });

    res.status(201).json(created);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create employee' });
    }
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deleted = await prisma.funcionario.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// ======================================
// STAGES (ETAPAS)
// ======================================

app.get('/api/stages', async (req, res) => {
  try {
    const list = await prisma.etapa.findMany({ orderBy: { id: 'asc' } });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stages' });
  }
});

app.post('/api/stages', async (req, res) => {
  try {
    const { nome, prazo, status } = req.body;
    
    if (!nome || !prazo || !status) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const created = await prisma.etapa.create({
      data: {
        nome,
        prazo: parseInt(prazo),
        status
      }
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create stage' });
  }
});

app.delete('/api/stages/:id', async (req, res) => {
  try {
    const deleted = await prisma.etapa.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json(deleted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stage' });
  }
});

// ======================================
// TESTS (TESTES)
// ======================================

app.get('/api/tests', async (req, res) => {
  try {
    const list = await prisma.teste.findMany({ orderBy: { id: 'asc' } });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

app.post('/api/tests', async (req, res) => {
  try {
    const { tipo, descricao, resultado, responsavel } = req.body;
    
    if (!tipo || !resultado || !responsavel) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const created = await prisma.teste.create({
      data: { tipo, descricao, resultado, responsavel }
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create test' });
  }
});

// ======================================
// REPORTS (RELATÓRIOS)
// ======================================

app.get('/api/reports', async (req, res) => {
  try {
    const list = await prisma.relatorio.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

app.post('/api/reports', async (req, res) => {
  try {
    const { titulo, tipo, conteudo, geradoPor } = req.body;
    
    if (!titulo || !tipo || !conteudo || !geradoPor) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const created = await prisma.relatorio.create({
      data: { titulo, tipo, conteudo, geradoPor }
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// ======================================
// METRICS (MÉTRICAS)
// ======================================

app.get('/api/metrics', async (req, res) => {
  try {
    const list = await prisma.metrica.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

app.post('/api/metrics', async (req, res) => {
  try {
    const { endpoint, latencia, tempoResposta, tempoProcessamento, usuariosConcorrentes, statusRequisicao } = req.body;
    
    const created = await prisma.metrica.create({
      data: {
        endpoint,
        latencia: parseFloat(latencia),
        tempoResposta: parseFloat(tempoResposta),
        tempoProcessamento: parseFloat(tempoProcessamento),
        usuariosConcorrentes: parseInt(usuariosConcorrentes),
        statusRequisicao
      }
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to record metric' });
  }
});

// ======================================
// HEALTH CHECK
// ======================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ======================================
// SERVER STARTUP
// ======================================

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  console.log(`Aerocode v3.0 servidor rodando em http://localhost:${port}`);
});
