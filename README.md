# Paciente360 - Sistema de Gerenciamento de Tarefas

Sistema full-stack de gerenciamento de tarefas desenvolvido com NestJS, React, e PostgreSQL.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Configuração Inicial](#configuração-inicial)
- [Executando o Projeto](#executando-o-projeto)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [API Endpoints](#api-endpoints)
- [Testes](#testes)

## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- **Banco de Dados** (escolha uma opção):
  - [Docker](https://www.docker.com/get-started) - para rodar PostgreSQL em container (recomendado)
  - [PostgreSQL](https://www.postgresql.org/download/) (versão 15 ou superior) - instalação local

## 🛠 Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js progressivo
- **Prisma ORM** - ORM TypeScript moderno
- **PostgreSQL** - Banco de dados relacional
- **Class Validator** - Validação de dados
- **Jest** - Framework de testes

### Frontend
- **React** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **Chakra UI** - Biblioteca de componentes
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP
- **Zod** - Validação de schemas

## 📁 Estrutura do Projeto

```
Paciente360/
├── backend/              # API NestJS
│   ├── prisma/          # Schema e migrations do Prisma
│   └── src/             # Código fonte do backend
└── frontend/            # Aplicação React
    └── src/             # Código fonte do frontend
```

## ⚙️ Configuração Inicial

### 1. Clone o repositório

```bash
git clone [<url-do-repositorio>](https://github.com/MatheusSCristo/Paciente360TesteTecnico.git)
cd Paciente360
```

### 2. Configure o Banco de Dados PostgreSQL

Você pode usar o PostgreSQL de duas formas:

**Opção A: Usando Docker (Recomendado)**

O projeto já possui um `docker-compose.yml` configurado para o banco de dados:

```bash
# Inicie apenas o container do PostgreSQL
docker compose up db -d
```

Isso irá criar o banco de dados `taskmanager` automaticamente na porta 5432.

**Opção B: PostgreSQL Local**

Se preferir instalar o PostgreSQL localmente, certifique-se de que ele está rodando e crie o banco de dados:

```sql
CREATE DATABASE taskmanager;
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta **backend** com as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskmanager?schema=public"

# Server
PORT=3000
```

> **Nota**: Ajuste o usuário, senha e porta do PostgreSQL conforme sua configuração local.

Crie um arquivo `.env` na pasta **frontend** com:

```env
# API URL
VITE_API_URL=http://localhost:3000
```

## 🚀 Executando o Projeto

### 1. Configure e Inicie o Backend

```bash
cd backend

# Instale as dependências
npm install

# Gere o cliente Prisma
npx prisma generate

# Execute as migrations do banco de dados
npx prisma migrate deploy

# Inicie o servidor de desenvolvimento
npm run dev
```

O backend estará rodando em **http://localhost:3000**

### 2. Configure e Inicie o Frontend

Em um **novo terminal**:

```bash
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em **http://localhost:5173**

### 3. Acesse a aplicação

Abra seu navegador e acesse: **http://localhost:5173**

## 🧪 Testes

### Backend

```bash
cd backend

# Testes unitários
npm run test

# Cobertura de testes
npm run test:cov
```

### Comandos úteis do Docker (para o banco de dados)

```bash
# Iniciar o PostgreSQL
docker compose up db -d

# Parar o PostgreSQL
docker compose stop db

# Parar e remover o container (mantém os dados)
docker compose down

# Parar e remover o container e volumes (apaga os dados)
docker compose down -v

# Ver logs do banco de dados
docker compose logs db

# Acessar o PostgreSQL via linha de comando
docker compose exec db psql -U postgres -d taskmanager
```
