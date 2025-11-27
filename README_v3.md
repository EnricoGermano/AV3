# Aerocode v3.0 - Sistema de Gestão da Produção Aeronáutica

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com)
[![Prisma](https://img.shields.io/badge/Prisma-5.0+-lightblue.svg)](https://www.prisma.io)

Sistema enterprise para gerenciar a produção de aeronaves civis e militares, com suporte a múltiplos perfis de usuário, controle de qualidade, relatórios detalhados e monitoramento de desempenho.

## 📋 Sumário Executivo

Este projeto é um sistema crítico para as maiores fabricantes de aeronaves do mundo. A AV3 foi desenvolvida com foco em:

- **Segurança**: Controle de acesso baseado em roles
- **Disponibilidade**: Medição contínua de métricas
- **Confiabilidade**: Testes de carga e performance
- **Escalabilidade**: Arquitetura preparada para múltiplos usuários

## ✨ Características Principais

### 🎨 Frontend Moderno (JavaScript Vanilla + CSS3)
- Interface responsiva e intuitiva
- Navegação SPA (Single Page Application)
- Dashboard em tempo real com cards informativos
- Formulários modernos com validação
- Tabelas interativas
- Sistema de abas intuitivo
- Suporte para múltiplos dispositivos (mobile, tablet, desktop)
- Armazenamento local (localStorage) para offline
- Animações suaves e transições

### 🛠️ Backend Robusto (Node.js + TypeScript)
- Arquitetura RESTful completa
- Prisma ORM para MySQL
- Middleware de medição de performance
- Tratamento de erros robusta com códigos HTTP apropriados
- Validação de entrada em todos os endpoints
- Compressão de resposta
- CORS configurado

### 📊 Funcionalidades Principais

#### Cadastros
- **Aeronaves**: Código, modelo, tipo (comercial/militar), capacidade, alcance
- **Peças**: Nome, tipo (nacional/importada), fornecedor, status
- **Funcionários**: Nome, email, telefone, cargo, endereço
- **Etapas**: Nome, prazo (dias), status (planejamento, em andamento, concluída, atrasada)

#### Listagem
- Visualização de todos os registros em tabelas responsivas
- Filtros por tipo
- Status com badges coloridas
- Design intuitivo e acessível

#### Relatórios
- Relatório de Produção (progresso das etapas)
- Relatório de Testes (resultados dos testes)
- Relatório de Qualidade (conformidade)
- Relatório de Recursos (funcionários)
- Download em formato TXT

#### Métricas de Desempenho
- **Latência**: Tempo ida-volta entre cliente-servidor (ms)
- **Tempo de Resposta**: Tempo total medido no cliente (ms)
- **Tempo de Processamento**: Tempo gasto no servidor (ms)
- **Taxa de Sucesso**: Porcentagem de requisições bem-sucedidas

#### Testes de Carga
- Simulação com 1 usuário
- Simulação com 5 usuários simultâneos
- Simulação com 10 usuários simultâneos
- Logs em tempo real do progresso
- Estatísticas de min/máx/médio

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org))
- **MySQL** 8.0+ ([Download](https://www.mysql.com/downloads/mysql/))
- **npm** 9+ (incluído com Node.js)

### Instalação

#### 1. Clone o repositório

```bash
git clone https://github.com/EnricoGermano/AV3.git
cd AV3
```

#### 2. Instale as dependências

```bash
npm install
```

#### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="mysql://usuario:senha@localhost:3306/aerocode_db"
PORT=3000
NODE_ENV=development
```

#### 4. Configure o banco de dados

```bash
# Crie o banco de dados
mysql -u root -p -e "CREATE DATABASE aerocode_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Execute as migrations
npx prisma migrate dev --name init

# Execute o seed (dados de exemplo)
npx prisma db seed
```

#### 5. Inicie o servidor

```bash
npm run dev
```

O sistema estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
AV3/
├── src/
│   ├── server.ts              # Servidor Express principal
│   ├── public/
│   │   └── js/
│   │       └── app.js         # Frontend JavaScript
│   └── routes/
│       └── static/
│           ├── index.html     # Interface principal
│           └── css/
│               └── styles.css # Estilos modernos
├── prisma/
│   ├── schema.prisma          # Definição do banco de dados
│   ├── seed.ts                # Dados de exemplo
│   └── migrations/            # Histórico de alterações
├── package.json               # Dependências e scripts
├── tsconfig.json              # Configuração TypeScript
└── README.md                  # Este arquivo
```

## 📊 Arquitetura de Dados

### Modelos Prisma

#### Aircraft (Aeronaves)
```typescript
- id: Int (primary key)
- codigo: String (unique)
- modelo: String
- tipo: String (comercial | militar)
- capacidade: Int
- alcance: Int
- createdAt: DateTime
- updatedAt: DateTime
```

#### Part (Peças)
```typescript
- id: Int (primary key)
- nome: String
- tipo: String (nacional | importada)
- fornecedor: String
- status: String (producao | transporte | pronta)
- createdAt: DateTime
- updatedAt: DateTime
```

#### Employee (Funcionários)
```typescript
- id: Int (primary key)
- nome: String
- email: String (unique)
- telefone: String
- cargo: String (administrador | engenheiro | operador)
- endereco: String
- createdAt: DateTime
- updatedAt: DateTime
```

#### Stage (Etapas)
```typescript
- id: Int (primary key)
- nome: String
- prazo: Int (dias)
- status: String (planejamento | em_andamento | concluida | atrasada)
- createdAt: DateTime
- updatedAt: DateTime
```

#### Test (Testes)
```typescript
- id: Int (primary key)
- tipo: String (eletrico | hidraulico | aerodinamico)
- descricao: String (optional)
- resultado: String (aprovado | reprovado | pendente)
- responsavel: String
- createdAt: DateTime
- updatedAt: DateTime
```

#### Report (Relatórios)
```typescript
- id: Int (primary key)
- titulo: String
- tipo: String (producao | testes | qualidade | recursos)
- conteudo: String (LongText)
- geradoPor: String
- createdAt: DateTime
```

#### Metric (Métricas)
```typescript
- id: Int (primary key)
- endpoint: String
- latencia: Float (ms)
- tempoResposta: Float (ms)
- tempoProcessamento: Float (ms)
- usuariosConcorrentes: Int
- statusRequisicao: String (sucesso | erro)
- createdAt: DateTime
```

## 🔌 API Endpoints

### Aeronaves
```
GET    /api/aircraft            # Listar todas
POST   /api/aircraft            # Criar nova
GET    /api/aircraft/:id        # Obter uma
DELETE /api/aircraft/:id        # Deletar uma
```

### Peças
```
GET    /api/parts               # Listar todas
POST   /api/parts               # Criar nova
DELETE /api/parts/:id           # Deletar uma
```

### Funcionários
```
GET    /api/employees           # Listar todos
POST   /api/employees           # Criar novo
DELETE /api/employees/:id       # Deletar um
```

### Etapas
```
GET    /api/stages              # Listar todas
POST   /api/stages              # Criar nova
DELETE /api/stages/:id          # Deletar uma
```

### Testes
```
GET    /api/tests               # Listar todos
POST   /api/tests               # Criar novo
```

### Relatórios
```
GET    /api/reports             # Listar últimos 50
POST   /api/reports             # Criar novo
```

### Métricas
```
GET    /api/metrics             # Listar últimas 100
POST   /api/metrics             # Registrar nova
GET    /metrics/summary         # Resumo agregado
```

### Saúde
```
GET    /api/health              # Status do servidor
```

## 📊 Métricas de Desempenho

### Metodologia de Coleta

1. **Latência (Network RTT)**: Diferença entre o envio e recebimento
2. **Tempo de Resposta**: Tempo total medido no cliente
3. **Tempo de Processamento**: Tempo gasto pelo servidor (header `X-Server-Time`)

### Cenários de Teste

- **1 Usuário**: Baseline de performance
- **5 Usuários**: Teste de carga moderada
- **10 Usuários**: Teste de limite de concorrência

Os testes são executados via interface web com visualização em tempo real.

## 🧪 Testes

### Executar Testes Manuais

Na interface do dashboard, use o botão "Testar com Múltiplos Usuários" para:
- Executar requisições simultâneas
- Coletar métricas em tempo real
- Visualizar estatísticas (min, máx, média)

### Executar Testes de Load via CLI

```bash
# Com autocannon
npx autocannon http://localhost:3000/api/aircraft -c 10 -d 30

# Com artilharia
npm run test:load
```

## 📱 Compatibilidade

Testado e compatível com:

- **Windows**: 10, 11, Server 2019+
- **Ubuntu**: 24.04.03+
- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas 2 versões)
- **Dispositivos**: Desktop, Tablet, Mobile

## 🔒 Segurança

- Validação de entrada em todos os endpoints
- Proteção CORS
- Tratamento seguro de erros (sem exposição de stack traces em produção)
- Sanitização de dados
- Preparado para autenticação JWT (próxima versão)

## 📝 Scripts Disponíveis

```bash
npm run dev              # Iniciar em modo desenvolvimento
npm run build            # Compilar TypeScript
npm run start            # Iniciar versão compilada
npm run db:seed          # Executar seed
npm run db:migrate       # Executar migrations
npm run db:studio        # Abrir Prisma Studio
npm run test:load        # Teste de carga
```

## 📄 Licença

Propriedade confidencial - Uso exclusivo da Aerocode

## 👥 Contribuidores

- Enrico Germano - Desenvolvedor Principal

## 📞 Suporte

Para suporte ou reportar bugs, entre em contato com:
- Email: suporte@aerocode.com
- GitHub Issues: [Reportar Bug](https://github.com/EnricoGermano/AV3/issues)

---

**Versão**: 3.0.0  
**Data**: Novembro 2025  
**Status**: ✅ Pronto para Produção
