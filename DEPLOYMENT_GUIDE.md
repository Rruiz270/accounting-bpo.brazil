# 🚀 Guia de Deployment - BPO Financeiro

## Visão Geral

Este guia descreve como fazer o deploy do Sistema BPO Financeiro usando **Railway** para o backend e **Neon** para o banco de dados PostgreSQL.

## 🏗️ Arquitetura de Deploy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │    │    Backend      │    │   Database      │
│   (Vercel)      │◄──►│   (Railway)     │◄──►│    (Neon)       │
│                 │    │                 │    │                 │
│  - Next.js      │    │ - NestJS API    │    │ - PostgreSQL    │
│  - React 18     │    │ - GraphQL       │    │ - Row Level     │
│  - Tailwind     │    │ - WebSockets    │    │   Security      │
│                 │    │ - Bull Queue    │    │ - Backups       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │                 │
                       │     Redis       │
                       │   (Railway)     │
                       │                 │
                       │ - Cache         │
                       │ - Sessions      │
                       │ - Job Queue     │
                       └─────────────────┘
```

## 📋 Pré-requisitos

### 1. Contas Necessárias
- [Railway](https://railway.app) - Deploy do backend
- [Neon](https://neon.tech) - Banco PostgreSQL
- [Vercel](https://vercel.com) - Deploy do frontend
- [GitHub](https://github.com) - Versionamento

### 2. Ferramentas Locais
```bash
# Node.js 18+
node --version

# npm ou yarn
npm --version

# Git
git --version

# Railway CLI (opcional)
npm install -g @railway/cli
```

## 🗄️ Configuração do Banco (Neon)

### 1. Criar Projeto no Neon

1. Acesse [console.neon.tech](https://console.neon.tech)
2. Clique em "Create a project"
3. Escolha:
   - **Name**: `bpo-financeiro-prod`
   - **PostgreSQL Version**: 16
   - **Region**: São Paulo (se disponível) ou US East
4. Clique em "Create project"

### 2. Configurar Database

```sql
-- Conectar ao database via console Neon
-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Configurar row-level security
ALTER DATABASE bpo_financeiro SET row_security = on;

-- Criar role para aplicação
CREATE ROLE bpo_app_role;
GRANT CONNECT ON DATABASE bpo_financeiro TO bpo_app_role;
GRANT USAGE ON SCHEMA public TO bpo_app_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO bpo_app_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO bpo_app_role;

-- Alterar default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON TABLES TO bpo_app_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON SEQUENCES TO bpo_app_role;
```

### 3. Configurar Connection String

No painel do Neon:
1. Vá em "Connection Details"
2. Copie a connection string
3. Formato: `postgresql://username:password@ep-xxx.region.neon.tech/database?sslmode=require`

## 🚂 Deploy no Railway

### 1. Preparar Repositório

```bash
# Clonar e configurar
git clone <seu-repositório>
cd financial-bpo

# Instalar dependências
npm install

# Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### 2. Deploy Backend via GitHub

1. **Conectar Repositório**:
   - Acesse [railway.app](https://railway.app)
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha seu repositório

2. **Configurar Build**:
   ```yaml
   # railway.toml será criado automaticamente
   [build]
     command = "npm run build"
     
   [deploy]
     command = "npm run start:prod"
     workingDirectory = "apps/api"
   ```

3. **Configurar Variáveis de Ambiente**:
   ```bash
   # No painel Railway, vá em Variables
   # Adicionar todas as variáveis do .env.example
   ```

### 3. Adicionar Redis

1. No projeto Railway, clique em "+ New"
2. Selecione "Database" → "Redis"
3. Aguardar provisioning
4. Copiar `REDIS_URL` para as variáveis do backend

### 4. Configurar Domínio

```bash
# No painel Railway
1. Vá em Settings → Domains
2. Clique em "Generate Domain"
3. Opcional: adicionar domínio custom
```

## 🔧 Configuração de Ambiente

### Variáveis Críticas para Produção

```bash
# Railway Backend Variables
NODE_ENV=production
PORT=${{PORT}}
DATABASE_URL=${{NEON_CONNECTION_STRING}}
REDIS_URL=${{REDIS_URL}}

# Segurança (GERAR NOVOS!)
JWT_SECRET="$(openssl rand -hex 32)"
JWT_REFRESH_SECRET="$(openssl rand -hex 32)"
ENCRYPTION_KEY="$(openssl rand -hex 32)"
SESSION_SECRET="$(openssl rand -hex 32)"

# URLs
APP_URL="https://seu-backend.railway.app"
CORS_ORIGINS="https://seu-frontend.vercel.app"

# Email (configurar com seu provedor)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="seu-email@gmail.com"
EMAIL_PASSWORD="sua-senha-app"

# Monitoramento
SENTRY_DSN="https://seu-sentry-dsn"
LOG_LEVEL="warn"
```

### Gerar Chaves Seguras

```bash
# Gerar chaves criptográficas
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
```

## 🌐 Deploy Frontend (Vercel)

### 1. Configurar Next.js

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL="https://seu-backend.railway.app"
NEXT_PUBLIC_ENVIRONMENT="production"
```

### 2. Deploy

1. Conecte repositório no Vercel
2. Configure build settings:
   ```yaml
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: .next
   ```

## 📊 Monitoramento e Logs

### 1. Railway Logs

```bash
# Via CLI
railway logs --follow

# Via Dashboard
Project → Deployments → View Logs
```

### 2. Health Checks

```bash
# Endpoint de saúde
curl https://seu-backend.railway.app/health

# Response esperado:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production",
  "version": "1.0.0"
}
```

### 3. Database Health

```bash
# Via Neon Console
SELECT version(), current_database(), current_user;

# Verificar conexões ativas
SELECT count(*) FROM pg_stat_activity;
```

## 🔒 Segurança em Produção

### 1. Banco de Dados

```sql
-- Backup automático (Neon faz automaticamente)
-- Point-in-time recovery habilitado

-- Configurar connection pooling
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
```

### 2. API Security

```typescript
// Já configurado no main.ts
- Helmet para headers security
- Rate limiting (100 req/min)
- CORS configurado
- JWT com refresh tokens
- Criptografia AES-256
```

### 3. Monitoring

```bash
# Adicionar Sentry para error tracking
npm install @sentry/node @sentry/nestjs

# Configurar no main.ts
import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Database Connection Failed**
   ```bash
   # Verificar connection string
   # Verificar firewall/IP whitelist no Neon
   # Verificar se SSL está habilitado
   ```

2. **Redis Connection Failed**
   ```bash
   # Verificar REDIS_URL no Railway
   # Restart do serviço Redis
   ```

3. **Build Failures**
   ```bash
   # Verificar Node.js version (20+)
   # Limpar node_modules e reinstalar
   # Verificar TypeScript errors
   ```

4. **Memory Issues**
   ```bash
   # Aumentar memory limit no Railway
   # Otimizar queries do Prisma
   # Implementar pagination
   ```

## 📈 Performance Optimization

### 1. Database

```sql
-- Indexes críticos (já definidos no schema.prisma)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_accounts_payable_tenant_status 
  ON accounts_payable(tenant_id, payment_status);

-- Configurar autovacuum
ALTER TABLE accounts_payable SET (autovacuum_vacuum_scale_factor = 0.1);
```

### 2. Redis Caching

```typescript
// Cache queries frequentes
@Cacheable('dashboard-metrics', 300) // 5 minutos
async getDashboardMetrics(tenantId: string) {
  // Implementation
}
```

### 3. Railway Optimizations

```yaml
# railway.toml
[deploy]
  healthcheckPath = "/health"
  healthcheckTimeout = 30
  restartPolicyType = "ON_FAILURE"
  restartPolicyMaxRetries = 3
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
        
      - name: Deploy Backend
        run: railway up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
          
      - name: Run Migrations
        run: railway run npm run prisma:deploy
```

## 📊 Métricas e Alertas

### 1. Application Metrics

```typescript
// Prometheus metrics (opcional)
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
  ],
})
```

### 2. Business Metrics

- Número de tenants ativos
- Volume de transações/hora
- Tempo de resposta das APIs
- Taxa de erro por endpoint
- Utilização de recursos

## 🎯 Next Steps

1. **Configurar monitoring avançado** (New Relic/DataDog)
2. **Implementar backup strategy** para uploads
3. **Configurar CDN** para static assets
4. **Setup load balancing** para alta disponibilidade
5. **Implementar auto-scaling** baseado em métricas

---

## 🆘 Suporte

- **Documentação Railway**: [docs.railway.app](https://docs.railway.app)
- **Documentação Neon**: [neon.tech/docs](https://neon.tech/docs)
- **Issues GitHub**: [Criar issue](https://github.com/seu-repo/issues)

**Status**: ✅ Sistema pronto para produção com arquitetura escalável!