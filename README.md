# AeroCode - AV3

Sistema de Gestão de Produção de Aeronaves com Node.js, Express e Prisma.

## Instalação 


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
DATABASE_URL="mysql://usuario:senha@localhost:3306/av3"
PORT=3000
```

#### 4. Configure o banco de dados

```bash
# Crie a tabela no banco de dados
"CREATE DATABASE av3;"

# Execute as migrations
npx prisma migrate dev --name init

# Execute o seed (dados de exemplo)
npx prisma db seed
```

#### 5. Inicie o servidor

```bash
npm run dev
```
## Uso

O servidor inicia em `http://localhost:3000`


## Relatorios de Performance

```bash
# Acessar relatorio com graficos
http://localhost:3000/relatorio
```



