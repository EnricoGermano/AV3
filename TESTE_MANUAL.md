# 📋 Guia de Testes - Aerocode v3.0

## 1. Testes Manuais no Frontend

### Acessando a Aplicação

1. Inicie o servidor:
```bash
npm run dev
```

2. Abra o navegador em `http://localhost:3000`

### Teste do Dashboard
- [ ] Página carrega corretamente
- [ ] Cards mostram contagens (inicialmente 0)
- [ ] Botão "🔄 Atualizar Dados" funciona
- [ ] Contador de dados atualiza

### Teste de Cadastro - Aeronaves
1. Clique em "Cadastros" no navbar
2. Certifique-se que a aba "Aeronaves" está ativa
3. Preencha o formulário:
   - Código: `AER-TEST-001`
   - Modelo: `Boeing 787`
   - Tipo: `Comercial`
   - Capacidade: `242`
   - Alcance: `14685`
4. Clique em "✓ Cadastrar Aeronave"
5. Verifique a mensagem de sucesso
6. Verifique que o contador em Dashboard aumentou

### Teste de Cadastro - Peças
1. Na aba "Peças":
   - Nome: `Compressor`
   - Tipo: `Importada`
   - Fornecedor: `Pratt & Whitney`
   - Status: `Pronta`
2. Cadastre e verifique sucesso

### Teste de Cadastro - Funcionários
1. Na aba "Funcionários":
   - Nome: `Carlos Silva`
   - Email: `carlos@aerocode.com`
   - Telefone: `11987654321`
   - Cargo: `Engenheiro`
   - Endereço: `São Paulo, SP`
2. Cadastre e verifique sucesso

### Teste de Cadastro - Etapas
1. Na aba "Etapas":
   - Nome: `Inspeção Final`
   - Prazo: `5`
   - Status: `Em Andamento`
2. Cadastre e verifique sucesso

### Teste de Listagem
1. Clique em "Listagem" no navbar
2. Verifique que as 4 abas existem
3. Clique em cada aba e verifique os dados cadastrados
4. Verifique que as tabelas mostram os dados corretos

### Teste de Relatórios
1. Clique em "Relatórios" no navbar
2. Clique em "Gerar Relatório" em cada card:
   - Produção
   - Testes
   - Qualidade
   - Recursos
3. Verifique que os relatórios aparecem na lista
4. Clique em "📥 Download" e verifique que o arquivo é baixado

### Teste de Métricas
1. Clique em "Métricas" no navbar
2. Clique em "1 Usuário"
3. Observe o log em tempo real
4. Aguarde conclusão
5. Verifique os resultados (latência, tempo de resposta, etc)
6. Repita para 5 e 10 usuários

## 2. Testes Automatizados da API

### Via Node.js (Windows/Linux)

```bash
# Executar testes
node scripts/test-api.js
```

Esperado:
- ✓ Todos os endpoints retornam status 200 ou 201
- ✓ Dados são criados corretamente
- ✓ Respostas estão em JSON válido

### Via cURL (Linux/Mac)

```bash
# Listar aeronaves
curl http://localhost:3000/api/aircraft

# Criar aeronave
curl -X POST http://localhost:3000/api/aircraft \
  -H "Content-Type: application/json" \
  -d '{"codigo":"AER-CURL-01","modelo":"Test","tipo":"comercial","capacidade":100,"alcance":5000}'

# Verificar saúde
curl http://localhost:3000/api/health

# Métricas
curl http://localhost:3000/metrics/summary
```

## 3. Testes de Performance

### Teste de Carga Manual (1 usuário)

1. Frontend > Métricas > "1 Usuário"
2. Anote as métricas:
   - Latência média
   - Tempo de resposta máx
   - Taxa de sucesso

**Esperado**:
- Latência: < 10 ms
- Tempo de resposta: < 100 ms
- Taxa de sucesso: 100%

### Teste de Carga Manual (5 usuários)

1. Frontend > Métricas > "5 Usuários"
2. Anote as métricas

**Esperado**:
- Latência: < 15 ms
- Tempo de resposta: < 150 ms
- Taxa de sucesso: 99% ou mais

### Teste de Carga Manual (10 usuários)

1. Frontend > Métricas > "10 Usuários"
2. Anote as métricas

**Esperado**:
- Latência: < 20 ms
- Tempo de resposta: < 250 ms
- Taxa de sucesso: 95% ou mais

## 4. Testes de Compatibilidade

### Windows 10+
- [ ] Servidor inicia sem erros
- [ ] Frontend carrega corretamente
- [ ] Todos os cadastros funcionam
- [ ] Relatórios podem ser baixados
- [ ] Testes de carga executam

### Ubuntu 24.04+
- [ ] Servidor inicia sem erros
- [ ] Frontend carrega corretamente
- [ ] Todos os cadastros funcionam
- [ ] Relatórios podem ser baixados
- [ ] Testes de carga executam

### Navegadores
- [ ] Chrome/Chromium (última versão)
- [ ] Firefox (última versão)
- [ ] Safari (última versão em Mac)
- [ ] Edge (última versão)

### Dispositivos
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## 5. Testes de Validação

### Validação Frontend
1. Tente enviar formulário vazio:
   - [ ] Navegador valida campos obrigatórios
   
2. Tente email duplicado:
   - [ ] Sistema não permite
   
3. Tente código de aeronave duplicado:
   - [ ] Sistema não permite

### Validação Backend
```bash
# Teste sem campo obrigatório
curl -X POST http://localhost:3000/api/aircraft \
  -H "Content-Type: application/json" \
  -d '{"codigo":"AER-TEST"}'
  
# Esperado: 400 Bad Request
```

## 6. Testes de Armazenamento

### localStorage
1. Cadastre dados
2. Recarregue a página (F5)
3. Verifique que os dados persistem
4. Abra DevTools > Application > localStorage
5. Procure por `aerocodeStore`

## 7. Checklist Final

- [ ] Frontend interface responsiva em todos os tamanhos
- [ ] Navegação funciona entre todas as páginas
- [ ] Cadastro salva em localStorage
- [ ] Listagem mostra dados corretos
- [ ] Relatórios geram e baixam
- [ ] Métricas coletam dados corretamente
- [ ] Testes de carga executam sem erros
- [ ] API endpoints retornam dados esperados
- [ ] Validações funcionam
- [ ] Compatibilidade Windows confirmada
- [ ] Compatibilidade Linux confirmada
- [ ] Compatibilidade multi-navegador confirmada

## 8. Troubleshooting

### "Connection refused" ao iniciar servidor
```bash
# Verificar se porta 3000 está em uso
# Windows
netstat -ano | findstr :3000

# Linux
lsof -i :3000

# Matar processo se necessário
# Windows
taskkill /PID [PID] /F

# Linux
kill -9 [PID]
```

### "Database connection failed"
```bash
# Verifique .env
cat .env

# Verifique MySQL
mysql -u root -p -e "show databases;"

# Recrie banco
mysql -u root -p -e "DROP DATABASE aerocode_db; CREATE DATABASE aerocode_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### "Prisma migration failed"
```bash
# Reset banco
npx prisma migrate reset

# Aplique migrations
npx prisma migrate dev

# Execute seed
npx prisma db seed
```

---

**Data**: Novembro 2025  
**Versão**: 3.0.0
