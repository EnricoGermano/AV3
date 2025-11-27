# Aerocode v3.0 - Atualização do Sistema de Autenticação

## Mudanças Realizadas

### 1. Banco de Dados
- Adicionado modelo `User` ao Prisma schema
- Criada tabela `users` com campos: id, nome, email, senha, cargo, ativo, createdAt, updatedAt
- Adicionada migração: `20251127_add_users`

### 2. Backend API
- Adicionados endpoints de autenticação:
  - `POST /api/auth/register` - Registrar novo usuário
  - `POST /api/auth/login` - Fazer login
  - `GET /api/auth/check` - Verificar se existem usuários no sistema

### 3. Frontend
- Adicionada página de Login
- Adicionada página de Registro do Primeiro Usuário
- Sistema redireciona automaticamente para registro se não houver usuários
- Após login, acesso ao aplicativo completo

## Instruções para Usar

### Primeiro Acesso (Sem usuários)
1. Limpar o banco de dados anterior (opcional)
2. Executar migrações: `npx prisma migrate dev`
3. Acessar http://localhost:3000
4. Será redirecionado para a página de registro
5. Cadastrar o primeiro usuário (administrador)
6. Após sucesso, terá acesso ao sistema

### Acessos Subsequentes
1. Executar `npm run dev`
2. Acessar http://localhost:3000
3. Fazer login com email e senha
4. Terá acesso ao sistema

## Credenciais Padrão (Seed)
- Email: admin@aerocode.com
- Senha: admin123
- Cargo: administrador

## Regenerar Prisma Client

Se receber erros de tipos, regenere o Prisma Client:

```bash
npx prisma generate
```

## Próximos Passos

- Implementar logout
- Adicionar persistência de sessão (JWT ou Similar)
- Adicionar validação de permissões
- Melhorar segurança de senha (hash com bcrypt)
- Adicionar recuperação de senha
