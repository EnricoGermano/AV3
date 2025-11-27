#!/bin/bash

# ============================================
# Aerocode v3.0 - Script de Teste
# ============================================

echo "🧪 Iniciando testes do Aerocode v3.0"
echo "===================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para teste
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4

  echo ""
  echo -e "${YELLOW}📝 ${description}${NC}"
  
  if [ -z "$data" ]; then
    curl -s -X $method "http://localhost:3000${endpoint}" \
      -H "Content-Type: application/json" | jq '.' || echo "erro"
  else
    curl -s -X $method "http://localhost:3000${endpoint}" \
      -H "Content-Type: application/json" \
      -d "$data" | jq '.' || echo "erro"
  fi
}

echo -e "\n${GREEN}✓ Testando Health Check${NC}"
curl -s http://localhost:3000/api/health | jq '.'

echo -e "\n${GREEN}✓ Testando Aeronaves${NC}"
test_endpoint "GET" "/api/aircraft" "" "Listar aeronaves"

test_endpoint "POST" "/api/aircraft" \
  '{"codigo":"AER-100","modelo":"Airbus A320","tipo":"comercial","capacidade":190,"alcance":6000}' \
  "Criar nova aeronave"

echo -e "\n${GREEN}✓ Testando Peças${NC}"
test_endpoint "GET" "/api/parts" "" "Listar peças"

test_endpoint "POST" "/api/parts" \
  '{"nome":"Motor Jet","tipo":"importada","fornecedor":"Rolls-Royce","status":"pronta"}' \
  "Criar nova peça"

echo -e "\n${GREEN}✓ Testando Funcionários${NC}"
test_endpoint "GET" "/api/employees" "" "Listar funcionários"

test_endpoint "POST" "/api/employees" \
  '{"nome":"Ana Costa","email":"ana.costa@aerocode.com","telefone":"11991234567","cargo":"engenheiro","endereco":"São Paulo, SP"}' \
  "Criar novo funcionário"

echo -e "\n${GREEN}✓ Testando Etapas${NC}"
test_endpoint "GET" "/api/stages" "" "Listar etapas"

test_endpoint "POST" "/api/stages" \
  '{"nome":"Testes Finais","prazo":10,"status":"planejamento"}' \
  "Criar nova etapa"

echo -e "\n${GREEN}✓ Testando Métricas${NC}"
curl -s http://localhost:3000/metrics/summary | jq '.'

echo -e "\n${GREEN}✓ Testando Relatórios${NC}"
test_endpoint "POST" "/api/reports" \
  '{"titulo":"Teste Report","tipo":"producao","conteudo":"Conteúdo do relatório","geradoPor":"Sistema"}' \
  "Criar novo relatório"

echo -e "\n${GREEN}✓ Testes concluídos!${NC}"
echo "===================================="
