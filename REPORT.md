# Relatório Técnico — AV3

## 1. Introdução
Explique o sistema, contexto crítico (uso por fabricantes de aeronaves), requisitos de segurança, disponibilidade e confiabilidade.

## 2. Arquitetura e escolhas técnicas
- Backend: Node.js + TypeScript + Express
- ORM: Prisma
- DB: MySQL
- Ferramenta de benchmark: autocannon
- Observabilidade: endpoint `/metrics/summary` que agrega tempos de processamento server-side.

## 3. Preparação do ambiente
Descrever Docker Compose ou instalação local do MySQL.
- Use `.env` com `DATABASE_URL`.
- Comandos principais:
  - `npm install`
  - `npx prisma generate`
  - `npx prisma migrate dev --name init`
  - `npm run prisma:seed`
  - `npm run dev`

## 4. Método de coleta das métricas
- Latência: medido pelo `autocannon` (latency.mean em ms).
- Tempo de Processamento (server-side): middleware registra processamento (milissegundos) e `/metrics/summary` retorna avg/p50/p95/p99.
- Tempo de Resposta (cliente): medido no frontend via `performance.now()` para cada clique/fetch.

Cenários: 1, 5, 10 usuários simultâneos, cada um executado por N segundos (ex.: 10s / 20s).

## 5. Resultados
- Incluir as figuras geradas em `results/`:
  - `latency.png`
  - `server_processing_avg.png`
  - `requests_per_sec.png`

## 6. Discussão e justificativa
- Justificar linguagem, ORM (Prisma) e MySQL para cargas críticas, vantagens (tipagem, migrations).
- Considerações sobre segurança, disponibilidade e backup.

## 7. Considerações finais
- Pontos de melhoria: replicação MySQL, métricas persistidas (Prometheus/Grafana), testes E2E.