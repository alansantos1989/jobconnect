# 🚀 Guia de Deploy - JobConnect

Este guia contém instruções passo a passo para fazer o deploy completo da plataforma JobConnect em produção.

## 📋 Pré-requisitos

- ✅ Conta no GitHub (já configurada)
- ✅ Conta no Supabase (já configurada)
- ✅ Conta no Mercado Pago (credenciais já obtidas)
- ⚠️ Conta no Render (para backend) - **CRIAR**
- ⚠️ Conta na Vercel (para frontend) - **CRIAR**

## 🗄️ Banco de Dados (Supabase) - ✅ CONCLUÍDO

### Credenciais do Supabase:
```
Project URL: https://fqpjckycmoagthidvxhr.supabase.co
Project ID: fqpjckycmoagthidvxhr
Database Password: @Alansantos89

Connection String:
postgresql://postgres:@Alansantos89@db.fqpjckycmoagthidvxhr.supabase.co:5432/postgres
```

### Tabelas criadas:
- ✅ users
- ✅ companies
- ✅ resumes
- ✅ jobs
- ✅ applications
- ✅ payments
- ✅ notifications
- ✅ favorites

## 🔧 Backend (Render)

### 1. Criar conta no Render
1. Acesse https://render.com/
2. Clique em "Get Started"
3. Faça login com GitHub

### 2. Criar Web Service
1. No dashboard, clique em "New +"
2. Selecione "Web Service"
3. Conecte o repositório: `alansantos1989/jobconnect`
4. Configure:
   - **Name**: `jobconnect-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Adicionar Variáveis de Ambiente
No painel do Render, vá em "Environment" e adicione:

```
DATABASE_URL=postgresql://postgres:@Alansantos89@db.fqpjckycmoagthidvxhr.supabase.co:5432/postgres
JWT_SECRET=jobconnect_super_secret_key_2024_production_change_this
NODE_ENV=production
PORT=5000
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2918962003661390-102208-c6df43fb69f600678b0f5fe77e4f31b7-2939945546
MERCADOPAGO_PUBLIC_KEY=APP_USR-80660a63-540f-4d83-bd73-3cecd35b8b58
FRONTEND_URL=https://jobconnect.vercel.app
```

### 4. Deploy
- Clique em "Create Web Service"
- Aguarde o deploy (5-10 minutos)
- Anote a URL gerada (ex: `https://jobconnect-backend.onrender.com`)

## 🎨 Frontend (Vercel)

### 1. Criar conta na Vercel
1. Acesse https://vercel.com/
2. Clique em "Sign Up"
3. Faça login com GitHub

### 2. Importar Projeto
1. No dashboard, clique em "Add New..."
2. Selecione "Project"
3. Importe o repositório: `alansantos1989/jobconnect`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `pnpm install && pnpm build`
   - **Output Directory**: `.next`

### 3. Adicionar Variáveis de Ambiente
No painel da Vercel, vá em "Settings" > "Environment Variables" e adicione:

```
NEXT_PUBLIC_API_URL=https://jobconnect-backend.onrender.com/api
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-80660a63-540f-4d83-bd73-3cecd35b8b58
```

### 4. Deploy
- Clique em "Deploy"
- Aguarde o deploy (3-5 minutos)
- Anote a URL gerada (ex: `https://jobconnect.vercel.app`)

### 5. Atualizar FRONTEND_URL no Backend
Volte no Render e atualize a variável `FRONTEND_URL` com a URL da Vercel.

## 💳 Mercado Pago - ✅ CONFIGURADO

### Credenciais de Teste:
```
Access Token: APP_USR-2918962003661390-102208-c6df43fb69f600678b0f5fe77e4f31b7-2939945546
Public Key: APP_USR-80660a63-540f-4d83-bd73-3cecd35b8b58
```

### Contas de Teste:
- **Comprador**: User ID 2939945548
- **Vendedor**: User ID 2939945546

### Cartões de Teste:
- **Mastercard**: 5031 4332 1540 6351 | CVV: 123 | Validade: 11/30
- **Visa**: 4235 6477 2802 5682 | CVV: 123 | Validade: 11/30

## 🔐 Credenciais de Acesso

### Admin Padrão:
```
Email: admin@jobconnect.com
Senha: admin123
```

## 📝 Checklist Final

- [ ] Backend deployado no Render
- [ ] Frontend deployado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado (backend aceita requisições do frontend)
- [ ] Testar login
- [ ] Testar cadastro de empresa
- [ ] Testar criação de vaga
- [ ] Testar candidatura
- [ ] Testar pagamento (Mercado Pago)

## 🐛 Troubleshooting

### Backend não inicia:
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs no Render
- Certifique-se que o Prisma foi gerado corretamente

### Frontend não conecta ao backend:
- Verifique se a URL do backend está correta em `NEXT_PUBLIC_API_URL`
- Verifique se o CORS está configurado no backend
- Verifique os logs do navegador (F12)

### Erro de conexão com banco de dados:
- Verifique se a `DATABASE_URL` está correta
- Verifique se a senha do banco está correta
- Teste a conexão diretamente no Supabase

## 📚 Recursos Adicionais

- [Documentação do Render](https://render.com/docs)
- [Documentação da Vercel](https://vercel.com/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Mercado Pago](https://www.mercadopago.com.br/developers)

## 🎉 URLs Finais

Após o deploy completo, você terá:

- **Frontend**: https://jobconnect.vercel.app
- **Backend API**: https://jobconnect-backend.onrender.com
- **Banco de Dados**: Supabase (gerenciado)
- **Repositório**: https://github.com/alansantos1989/jobconnect

