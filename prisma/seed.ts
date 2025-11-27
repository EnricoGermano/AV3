import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes (ordem importa!)
  await prisma.metric.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.test.deleteMany({});
  await prisma.stage.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.part.deleteMany({});
  await prisma.aircraft.deleteMany({});
  await prisma.user.deleteMany({});

  // Usuário padrão comentado - será criado pelo sistema na primeira vez
  // const user = await prisma.user.create({
  //   data: {
  //     nome: 'Administrador',
  //     email: 'admin@aerocode.com',
  //     senha: 'admin123',
  //     cargo: 'administrador'
  //   }
  // });
  // console.log('Usuário padrão criado:', user.email);

  // Criar Aeronaves
  const aircrafts = await prisma.aeronave.createMany({
    data: [
      { codigo: 'AER-001', modelo: 'Boeing 737', tipo: 'comercial', capacidade: 180, alcance: 5000 },
      { codigo: 'AER-002', modelo: 'Embraer E195', tipo: 'comercial', capacidade: 146, alcance: 4800 },
      { codigo: 'AER-003', modelo: 'F-16 Fighting Falcon', tipo: 'militar', capacidade: 1, alcance: 3200 }
    ]
  });
  console.log(`${aircrafts.count} aeronaves criadas`);

  // Criar Peças
  const parts = await prisma.peca.createMany({
    data: [
      { nome: 'Turbina CFM56', tipo: 'importada', fornecedor: 'CFM International', status: 'pronta' },
      { nome: 'Asa Principal', tipo: 'nacional', fornecedor: 'Embraer', status: 'producao' },
      { nome: 'Trem de Pouso', tipo: 'importada', fornecedor: 'Liebherr', status: 'transporte' }
    ]
  });
  console.log(`${parts.count} peças criadas`);

  // Criar Funcionários
  const employees = await prisma.employee.createMany({
    data: [
      { nome: 'João Silva', email: 'joao.silva@aerocode.com', telefone: '11987654321', cargo: 'administrador', endereco: 'São Paulo, SP' },
      { nome: 'Maria Santos', email: 'maria.santos@aerocode.com', telefone: '11912345678', cargo: 'engenheiro', endereco: 'São José dos Campos, SP' },
      { nome: 'Pedro Oliveira', email: 'pedro.oliveira@aerocode.com', telefone: '11998765432', cargo: 'operador', endereco: 'Campinas, SP' }
    ]
  });
  console.log(`${employees.count} funcionários criados`);

  // Criar Etapas
  const stages = await prisma.stage.createMany({
    data: [
      { nome: 'Montagem de Fuselagem', prazo: 30, status: 'em_andamento' },
      { nome: 'Instalação de Sistemas', prazo: 20, status: 'concluida' },
      { nome: 'Testes de Voo', prazo: 15, status: 'em_andamento' }
    ]
  });
  console.log(`${stages.count} etapas criadas`);

  // Criar Testes
  const tests = await prisma.test.createMany({
    data: [
      { tipo: 'eletrico', descricao: 'Teste do sistema elétrico', resultado: 'aprovado', responsavel: 'Maria Santos' },
      { tipo: 'hidraulico', descricao: 'Teste do sistema hidráulico', resultado: 'aprovado', responsavel: 'Pedro Oliveira' },
      { tipo: 'aerodinamico', descricao: 'Teste de aerodinâmica em túnel de vento', resultado: 'pendente', responsavel: 'Maria Santos' }
    ]
  });
  console.log(`${tests.count} testes criados`);

  // Criar Relatórios
  const reports = await prisma.report.createMany({
    data: [
      {
        titulo: 'Relatório de Produção - Semana 1',
        tipo: 'producao',
        conteudo: 'Análise da produção na primeira semana. Progresso: 35%',
        geradoPor: 'João Silva'
      },
      {
        titulo: 'Relatório de Qualidade - Novembro 2025',
        tipo: 'qualidade',
        conteudo: 'Conformidade com padrões de qualidade: 98%',
        geradoPor: 'Maria Santos'
      }
    ]
  });
  console.log(`${reports.count} relatórios criados`);

  // Criar Métricas de Exemplo
  const metrics = await prisma.metric.createMany({
    data: [
      { endpoint: '/api/aircraft', latencia: 5.2, tempoResposta: 12.3, tempoProcessamento: 8.1, usuariosConcorrentes: 1, statusRequisicao: 'sucesso' },
      { endpoint: '/api/parts', latencia: 4.8, tempoResposta: 14.5, tempoProcessamento: 9.7, usuariosConcorrentes: 5, statusRequisicao: 'sucesso' },
      { endpoint: '/api/employees', latencia: 6.1, tempoResposta: 16.2, tempoProcessamento: 10.1, usuariosConcorrentes: 10, statusRequisicao: 'sucesso' }
    ]
  });
  console.log(`${metrics.count} métricas criadas`);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch(e => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
