#!/usr/bin/env bash

# Aerocode v3.0 - Guia Rápido de Início
# Compatível com Windows (PowerShell/Git Bash) e Linux

echo "========================================================"
echo "  AEROCODE v3.0 - GUIA RÁPIDO DE INÍCIO"
echo "========================================================"
echo ""

# Verificar Node.js
echo "Verificando pré-requisitos..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "OK - Node.js: $NODE_VERSION"
else
    echo "ERRO - Node.js não encontrado"
    echo "   Baixe em: https://nodejs.org"
    exit 1
fi

# Verificar npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "OK - npm: $NPM_VERSION"
else
    echo "ERRO - npm não encontrado"
    exit 1
fi

# Verificar MySQL
if command -v mysql &> /dev/null; then
    echo "OK - MySQL encontrado"
else
    echo "AVISO - MySQL não encontrado no PATH"
    echo "   Você pode instalá-lo em: https://www.mysql.com/downloads/mysql/"
    echo "   Mas você ainda pode configurar o banco manualmente"
fi

echo ""
echo "========================================================"
echo "ETAPA 1: Instalar Dependências"
echo "========================================================"
echo ""
echo "Executando: npm install"
npm install

if [ $? -eq 0 ]; then
    echo "OK - Dependências instaladas com sucesso"
else
    echo "ERRO - Problema ao instalar dependências"
    exit 1
fi

echo ""
echo "========================================================"
echo "ETAPA 2: Configurar Banco de Dados"
echo "========================================================"
echo ""

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "AVISO - Arquivo .env não encontrado"
    echo ""
    echo "Criando .env padrão..."
    cat > .env << 'EOF'
DATABASE_URL="mysql://root:senha@localhost:3306/aerocode_db"
PORT=3000
NODE_ENV=development
EOF
    echo "OK - Arquivo .env criado"
    echo ""
    echo "IMPORTANTE: Edite o arquivo .env com suas credenciais MySQL"
    echo "   Localizações possíveis:"
    echo "   - Windows: c:\\Users\\$USERNAME\\Documents\\AV3\\.env"
    echo "   - Linux: ~/AV3/.env"
    echo ""
else
    echo "OK - Arquivo .env já existe"
fi

echo ""
echo "Próximas ações (execute em seu terminal):"
echo ""
echo "1. Se você tem MySQL instalado:"
echo "   mysql -u root -p -e \"CREATE DATABASE aerocode_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
echo ""
echo "2. Executar migrations:"
echo "   npx prisma migrate dev --name init"
echo ""
echo "3. Preencher banco com dados de exemplo:"
echo "   npx prisma db seed"
echo ""

echo ""
echo "========================================================"
echo "ETAPA 3: Iniciar Servidor"
echo "========================================================"
echo ""
echo "Execute:"
echo "   npm run dev"
echo ""
echo "O servidor iniciará em http://localhost:3000"
echo ""

echo "========================================================"
echo "EXECUTAR TESTES"
echo "========================================================"
echo ""
echo "Com o servidor rodando, em outro terminal:"
echo "   node scripts/test-api.js"
echo ""

echo "========================================================"
echo "DOCUMENTAÇÃO"
echo "========================================================"
echo ""
echo "Leia os arquivos:"
echo "  README_v3.md              - Documentação completa"
echo "  TESTE_MANUAL.md           - Guia de testes"
echo "  IMPLEMENTACAO_v3.md       - Detalhes de implementação"
echo "  ENTREGA_FINAL.md          - Resumo do que foi entregue"
echo ""

echo "========================================================"
echo "GUIA RÁPIDO COMPLETO!"
echo "========================================================"
echo ""
echo "Próximas ações:"
echo "   1. Editar .env com credenciais MySQL"
echo "   2. Criar banco de dados"
echo "   3. Executar migrations"
echo "   4. Executar seed"
echo "   5. Iniciar servidor (npm run dev)"
echo "   6. Abrir http://localhost:3000"
echo "   7. Executar testes (node scripts/test-api.js)"
echo ""
echo "Desenvolvido para a Aerocode"
echo "Versão 3.0.0 - Novembro 2025"
echo ""
