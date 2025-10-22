# JobConnect - Plataforma de Recrutamento

Clone completo do InfoJobs com funcionalidades de recrutamento, monetização via Mercado Pago e deploy em produção.

## 🚀 Funcionalidades

### Para Candidatos
- ✅ Cadastro e login
- ✅ Busca de vagas com filtros avançados
- ✅ Candidatura em um clique
- ✅ Dashboard com acompanhamento de candidaturas
- ✅ Perfil e currículo

### Para Empresas
- ✅ Cadastro e login
- ✅ Publicação de vagas (FREE: 1 vaga, PRO: ilimitadas)
- ✅ Gestão de candidaturas
- ✅ Dashboard com estatísticas
- ✅ Sistema de pagamentos via Mercado Pago
- ✅ Planos FREE e PRO

### Painel Administrativo
- ✅ Dashboard com estatísticas gerais
- ✅ Gestão de usuários e empresas
- ✅ Gestão de vagas e pagamentos

## 🛠️ Tecnologias

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Mercado Pago SDK
- Bcrypt

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- Axios
- React Hook Form + Zod

## 📦 Instalação Local

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- pnpm

### Backend

```bash
cd backend
pnpm install

# Configurar .env
cp .env.example .env
# Edite o .env com suas credenciais

# Rodar migrações
npx prisma migrate dev
npx prisma generate

# Iniciar servidor
pnpm dev
```

### Frontend

```bash
cd frontend
pnpm install

# Configurar .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Iniciar desenvolvimento
pnpm dev
```

## 🌐 Deploy em Produção

### Backend (Render)
1. Criar conta no Render.com
2. Criar novo Web Service
3. Conectar repositório GitHub
4. Configurar variáveis de ambiente
5. Deploy automático

### Frontend (Vercel)
1. Criar conta no Vercel.com
2. Importar projeto do GitHub
3. Configurar variáveis de ambiente
4. Deploy automático

### Banco de Dados (Supabase)
1. Criar conta no Supabase.com
2. Criar novo projeto PostgreSQL
3. Copiar connection string
4. Atualizar DATABASE_URL no backend

## 🔑 Variáveis de Ambiente

### Backend (.env)
```
DATABASE_URL="postgresql://..."
JWT_SECRET="seu-secret-jwt"
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
MERCADOPAGO_PUBLIC_KEY="APP_USR-..."
FRONTEND_URL="https://seu-frontend.vercel.app"
PORT=5000
NODE_ENV="production"
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="https://seu-backend.onrender.com"
```

## 💳 Mercado Pago - Credenciais de Teste

**Public Key:** APP_USR-80660a63-540f-4d83-bd73-3cecd35b8b58
**Access Token:** APP_USR-2918962003661390-102208-c6df43fb69f600678b0f5fe77e4f31b7-2939945546

### Cartões de Teste (Brasil)

| Cartão | Número | CVV | Validade |
|--------|--------|-----|----------|
| Mastercard | 5031 4332 1540 6351 | 123 | 11/30 |
| Visa | 4235 6477 2802 5682 | 123 | 11/30 |
| American Express | 3753 651535 56885 | 1234 | 11/30 |
| Elo Debito | 5067 7667 8388 8311 | 123 | 11/30 |

### Contas de Teste

**Comprador:**
- User ID: 2939945548
- Usuário: TESTUSER8175...
- Senha: KBCrmoIV3T

**Vendedor:**
- User ID: 2939945546
- Usuário: TESTUSER6361...
- Senha: Hs1r37IuVc

## 📊 Estrutura do Banco de Dados

- **User** - Candidatos
- **Company** - Empresas
- **Job** - Vagas
- **Application** - Candidaturas
- **Resume** - Currículos
- **Payment** - Pagamentos

## 🔒 Segurança

- ✅ Autenticação JWT
- ✅ Senhas criptografadas com bcrypt
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Validação de dados
- ✅ Cookies HTTP-only

## 📝 Licença

MIT License

## 👨‍💻 Autor

Desenvolvido para demonstração de habilidades full-stack.

---

**Nota:** Este é um projeto de demonstração. Para uso em produção, implemente medidas adicionais de segurança e teste extensivamente.

