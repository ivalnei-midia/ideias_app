# 🚀 Guia de Deploy - IdeasApp

## Opções de Hospedagem

### 1. **Render (Recomendado - Gratuito)**

**Vantagens:**
- ✅ Gratuito permanentemente
- ✅ Suporte nativo ao SQLite
- ✅ Deploy automático via Git
- ✅ SSL grátis
- ✅ Fácil configuração

**Passos:**
1. Crie uma conta no [Render](https://render.com)
2. Conecte seu repositório GitHub
3. Crie um "Web Service"
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Node

**Arquivo de configuração:** `render.yaml` (já criado)

---

### 2. **Railway**

**Vantagens:**
- ✅ Deploy muito simples
- ✅ $5 grátis por mês
- ✅ Boa performance
- ✅ Suporte ao SQLite

**Passos:**
1. Crie uma conta no [Railway](https://railway.app)
2. Conecte seu repositório
3. Deploy automático
4. Configure variáveis de ambiente se necessário

**Arquivo de configuração:** `railway.json` (já criado)

---

### 3. **Vercel**

**Vantagens:**
- ✅ Gratuito
- ✅ Performance excelente
- ✅ Deploy automático
- ⚠️ Limitações com SQLite (requer adaptação)

**Nota:** Para Vercel, recomendo usar um banco em nuvem como:
- **Planetscale** (MySQL gratuito)
- **Neon** (PostgreSQL gratuito)
- **Supabase** (PostgreSQL gratuito)

---

### 4. **Heroku**

**Vantagens:**
- ✅ Confiável
- ⚠️ Não é mais gratuito

**Passos:**
1. Instale o Heroku CLI
2. `heroku create sua-app`
3. `git push heroku main`

---

### 5. **VPS (DigitalOcean, Linode, etc.)**

**Para aplicações profissionais:**

```bash
# 1. Conectar ao servidor
ssh user@seu-servidor

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PM2
sudo npm install -g pm2

# 4. Clonar repositório
git clone https://github.com/seu-usuario/ideias_app.git
cd ideias_app

# 5. Instalar dependências
cd backend && npm install

# 6. Configurar PM2
pm2 start index.js --name "ideasapp"
pm2 startup
pm2 save

# 7. Configurar Nginx (opcional)
sudo apt install nginx
```

---

## 🔧 Preparação para Deploy

### 1. **Verificar Dependências**

```bash
cd backend
npm install
npm audit fix
```

### 2. **Testar em Produção Localmente**

```bash
NODE_ENV=production npm start
```

### 3. **Configurar Variáveis de Ambiente**

Crie um arquivo `.env` no backend:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=caminho/para/banco.db
```

### 4. **Atualizar package.json**

```json
{
  "name": "ideasapp",
  "version": "2.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "build": "npm install"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

---

## 🌐 Deploy Passo a Passo (Render)

### 1. **Preparar Repositório**

```bash
# Adicionar arquivos ao Git
git add .
git commit -m "feat: Sistema completo de armazenamento com API"
git push origin main
```

### 2. **Configurar no Render**

1. Acesse [Render.com](https://render.com)
2. Clique em "New Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name:** ideasapp
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free

### 3. **Configurar Domínio Personalizado (Opcional)**

1. No dashboard do Render
2. Vá para "Settings" > "Custom Domains"
3. Adicione seu domínio
4. Configure DNS do seu provedor

---

## 📱 URLs de Acesso

Após o deploy, suas URLs serão:

- **Frontend:** `https://sua-app.onrender.com/app`
- **API:** `https://sua-app.onrender.com/api/health`
- **Backend:** `https://sua-app.onrender.com/`

---

## 🔍 Monitoramento

### Logs em Tempo Real:
```bash
# Render
# Acesse o dashboard > Logs

# Railway  
railway logs

# Heroku
heroku logs --tail
```

### Health Check:
```bash
curl https://sua-app.onrender.com/api/health
```

---

## 🛠️ Troubleshooting

### Problemas Comuns:

1. **Port Error:**
   - Verifique se está usando `process.env.PORT`

2. **SQLite Path:**
   - Certifique-se que o diretório `data/` existe

3. **CORS Error:**
   - Atualize as origens permitidas no CORS

4. **Build Error:**
   - Verifique o `package.json` e dependências

---

## 🚀 Próximos Passos

Após o deploy:

1. ✅ Testar todas as funcionalidades
2. ✅ Configurar domínio personalizado
3. ✅ Configurar SSL (automático na maioria dos serviços)
4. ✅ Implementar monitoramento
5. ✅ Backup regular do banco de dados

---

**Status:** ✅ Pronto para produção! 