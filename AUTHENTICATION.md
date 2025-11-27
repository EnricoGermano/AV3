# Sistema de Autenticação Aerocode v3.0

## O que foi implementado

### 1. Páginas de Autenticação
- **Página de Login**: Para usuários já cadastrados
- **Página de Registro**: Para o primeiro usuário do sistema

### 2. Fluxo Automático
- Sistema verifica se há usuários no banco de dados
- Se não houver: redireciona para registro do primeiro usuário
- Se houver: mostra página de login
- Após autenticação bem-sucedida: acesso ao aplicativo completo

### 3. Backend - Endpoints de Autenticação

#### POST /api/auth/register
Registra um novo usuário
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "cargo": "administrador"
}
```

#### POST /api/auth/login
Faz login com email e senha
```json
{
  "email": "admin@aerocode.com",
  "senha": "admin123"
}
```

#### GET /api/auth/check
Verifica se há usuários no sistema
Resposta: `{ "hasUsers": true/false }`

### 4. Banco de Dados
Nova tabela `users` com os campos:
- id (auto-increment)
- nome (String)
- email (String, único)
- senha (String)
- cargo (String: administrador, gerente, operador)
- ativo (Boolean, padrão: true)
- createdAt (DateTime)
- updatedAt (DateTime)

### 5. Interface de Usuário
- Navbar agora mostra nome do usuário logado
- Botão "Sair" para fazer logout
- Estilos modernos para páginas de login e registro
- Mensagens de erro/sucesso para o usuário

## Credenciais Padrão (Seed)
Para testar após executar `npx prisma db seed`:
- Email: `admin@aerocode.com`
- Senha: `admin123`

## Como Usar

### Primeiro Acesso (Novo Sistema)
1. Executar: `npm run dev`
2. Acessar: `http://localhost:3000`
3. Será redirecionado para registro
4. Preencher dados do primeiro usuário
5. Após sucesso, terá acesso ao sistema

### Acessos Subsequentes
1. Executar: `npm run dev`
2. Acessar: `http://localhost:3000`
3. Fazer login com email e senha
4. Terá acesso ao sistema

### Logout
Clique no botão "Sair" na navbar para desconectar

## Tecnologias Utilizadas

- **Backend**: Node.js + Express + Prisma
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Database**: MySQL
- **Autenticação**: Session Storage (base64 token)

## Segurança

⚠️ **Nota de Segurança**: 
- Senhas estão armazenadas em texto plano (não é seguro para produção)
- Para produção, usar bcrypt para hash de senhas
- Implementar JWT (JSON Web Tokens) para sessões
- Adicionar HTTPS obrigatório
- Validação e sanitização de entrada

## Próximas Melhorias Sugeridas

1. Hash de senhas com bcrypt
2. JWT para sessões seguras
3. Recuperação de senha
4. Validação de força de senha
5. Rate limiting para login
6. Auditoria de login/logout
7. Permissões baseadas em cargo
8. Refresh tokens
