# Documentação Completa - JobConnect

## 1. Visão Geral do Projeto

JobConnect é uma plataforma completa de recrutamento e seleção (clone do InfoJobs) que conecta empresas e candidatos. O projeto foi desenvolvido com tecnologias modernas e está pronto para produção, incluindo funcionalidades de monetização com Mercado Pago.

### 1.1. Links de Produção

| Componente | URL de Produção |
|------------|-----------------|
| Frontend (Vercel) | [https://jobconnect-inky.vercel.app](https://jobconnect-inky.vercel.app) |
| Backend (Render) | [https://jobconnect-i16a.onrender.com](https://jobconnect-i16a.onrender.com) |
| Repositório (GitHub) | [https://github.com/alansantos1989/jobconnect](https://github.com/alansantos1989/jobconnect) |

### 1.2. Tecnologias Utilizadas

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Zustand, Axios
- **Backend**: Node.js, Express, Prisma, PostgreSQL, JWT, Bcrypt
- **Banco de Dados**: Supabase (PostgreSQL)
- **Pagamentos**: Mercado Pago SDK
- **Deploy**: Vercel (Frontend), Render (Backend)
- **Versionamento**: Git, GitHub

## 2. Arquitetura do Sistema

A plataforma segue uma arquitetura de monorepo com frontend e backend desacoplados, comunicando-se via API REST.

- **Frontend (Vercel)**: Aplicação Next.js responsável pela interface do usuário, renderização de páginas e interação com o backend.
- **Backend (Render)**: API RESTful em Node.js/Express que gerencia a lógica de negócio, autenticação, acesso ao banco de dados e integração com o Mercado Pago.
- **Banco de Dados (Supabase)**: Instância PostgreSQL gerenciada que armazena todos os dados da aplicação (usuários, vagas, candidaturas, etc.).

## 3. Estrutura do Projeto

O projeto está organizado em um monorepo com a seguinte estrutura:

```
/jobconnect
├── backend/         # Aplicação Node.js/Express (API)
│   ├── prisma/      # Schema e migrações do banco de dados
│   ├── src/         # Código-fonte do backend
│   ├── .env         # Variáveis de ambiente (locais)
│   └── package.json
├── frontend/        # Aplicação Next.js (Interface)
│   ├── app/         # Rotas e páginas do Next.js 14
│   ├── components/  # Componentes React reutilizáveis
│   ├── lib/         # Funções utilitárias e API client
│   ├── store/       # Gerenciamento de estado com Zustand
│   ├── .env         # Variáveis de ambiente (locais)
│   └── package.json
├── .gitignore
├── DEPLOYMENT.md    # Instruções de deploy
├── DOCUMENTATION.md # Esta documentação
├── README.md        # Visão geral do projeto
└── render.yaml      # Configuração de deploy do Render
```

## 4. Guia de Instalação Local

Para rodar o projeto em sua máquina local, siga os passos abaixo.

### 4.1. Pré-requisitos

- Node.js (v18+)
- pnpm (ou npm/yarn)
- Git
- Conta no Supabase (para banco de dados)
- Conta no Mercado Pago (para credenciais de teste)

### 4.2. Passos de Instalação

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/alansantos1989/jobconnect.git
   cd jobconnect
   ```

2. **Configurar o Backend:**
   - Navegue até a pasta `backend`
   - Crie um arquivo `.env` a partir do `.env.example`
   - Preencha as variáveis de ambiente com suas credenciais do Supabase e Mercado Pago
   - Instale as dependências: `npm install`
   - Aplique as migrações do Prisma: `npx prisma migrate dev`
   - Inicie o servidor: `npm start`

3. **Configurar o Frontend:**
   - Navegue até a pasta `frontend`
   - Crie um arquivo `.env` a partir do `.env.example`
   - Preencha a variável `NEXT_PUBLIC_API_URL` com `http://localhost:5000`
   - Instale as dependências: `pnpm install`
   - Inicie o servidor de desenvolvimento: `pnpm dev`

4. **Acessar a aplicação:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

## 5. Instruções de Deploy

O deploy é automatizado via Git. Qualquer push para a branch `main` acionará um novo deploy no Render e na Vercel.

- **Backend (Render)**: O deploy é configurado pelo arquivo `render.yaml`. As variáveis de ambiente precisam ser configuradas no dashboard do Render.
- **Frontend (Vercel)**: O deploy é configurado automaticamente pela Vercel ao importar o repositório. A variável `NEXT_PUBLIC_API_URL` precisa ser configurada no dashboard da Vercel.

Para mais detalhes, consulte o arquivo `DEPLOYMENT.md`.

## 6. Referência da API

O backend expõe uma API RESTful completa para gerenciar a plataforma.

**URL Base**: `https://jobconnect-i16a.onrender.com`

### Endpoints Principais

| Método | Endpoint | Descrição |
|--------|-----------------------|-------------------------------------------|
| POST   | `/api/auth/register`  | Registrar novo usuário/empresa            |
| POST   | `/api/auth/login`     | Autenticar usuário/empresa                |
| GET    | `/api/jobs`           | Listar vagas com filtros                  |
| POST   | `/api/jobs`           | Criar nova vaga (requer autenticação)     |
| GET    | `/api/jobs/:id`       | Obter detalhes de uma vaga                |
| POST   | `/api/applications`   | Candidatar-se a uma vaga (requer auth)    |
| GET    | `/api/users/me`       | Obter dados do usuário logado             |
| POST   | `/api/payments/create`| Criar preferência de pagamento (Mercado Pago) |

Para a lista completa de endpoints, consulte os arquivos de rotas na pasta `backend/src/routes`.

---

*Documentação gerada por Manus AI em 22 de Outubro de 2025.*

