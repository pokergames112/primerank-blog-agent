# 🚀 Agente de Conteúdo & Blog Autônomo — Prime Rank Marketing

Sistema inteligente de criação de artigos de blog para **[primerankmarketing.com.br](https://primerankmarketing.com.br)**, que monitora diariamente as tendências em alta no **Google Trends Brasil**, redige artigos aprofundados com **mais de 1.500 palavras** focados em SEO e conversão, e permite **validação com 1 toque no celular** antes de publicar automaticamente.

---

## 📱 Fluxo de Validação no Celular

O sistema disponibiliza **dois canais práticos** para você aprovar o roteiro/artigo pelo celular:

### 1. Dashboard Web Mobile-First (PWA)
- Acesse `http://localhost:3006/dashboard` (ou o IP/Domínio do seu servidor) no navegador do seu smartphone.
- Veja os cards dos artigos gerados com contagem de palavras, tempo de leitura e pauta do Google Trends.
- Clique em **"Aprovar (1-Toque)"** para publicar instantaneamente ou **"Ler Completo"** para revisar o markdown renderizado.

### 2. Notificação & Aprovação via Telegram Bot (Opcional)
- Quando uma nova pauta é gerada, você recebe uma notificação instantânea no Telegram com o resumo do artigo.
- Botões interativos direto na mensagem do Telegram:
  - 🚀 `[Aprovar & Publicar]`
  - 🔄 `[Regerar Artigo]`
  - ❌ `[Descartar]`
  - 📱 `[Abrir no Web App]`

---

## 🛠️ Como Configurar e Iniciar

### 1. Configuração do `.env`
Edite o arquivo `.env` com suas credenciais:

```env
PORT=3006
HOST=http://localhost:3006

# Provedor de IA (OpenAI ou Gemini):
OPENAI_API_KEY=sua_chave_aqui
OPENAI_MODEL=gpt-4o-mini

# Provedor Alternativo (opcional):
GEMINI_API_KEY=

# Bot do Telegram para Validação no Celular (Opcional):
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=

# Frequência de Execução Automática (Cron):
CRON_SCHEDULE="0 8 * * *"
AUTO_DISCOVER_TRENDS=true
```

> **Nota:** O sistema possui um gerador estruturado inteligente nativo. Mesmo sem chave de API inserida no momento, ele pesquisa o Google Trends real e gera artigos completos com mais de 1.500 palavras estruturados para a Prime Rank Marketing para você testar tudo de imediato.

### 2. Comandos Disponíveis

- **Iniciar o Servidor em Modo Desenvolvimento:**
  ```bash
  npm run dev
  ```
- **Disparar Pesquisa de Tendências e Geração Imediata:**
  ```bash
  npm run generate
  ```
- **Gerar para um Tema Específico Manual:**
  ```bash
  npm run generate -- "Como Reduzir o CPL no Google Ads em 2026"
  ```

---

## 📡 Integração com a Nova Aba do Blog no Site

O agente expõe endpoints REST prontos para alimentar a aba do blog no site `primerankmarketing.com.br`:

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/blog/posts` | Lista todos os artigos aprovados/publicados com paginação, categorias, tags e tempo de leitura. |
| `GET` | `/api/blog/posts/:slug` | Retorna o artigo completo com conteúdo em Markdown/HTML, FAQs estruturadas e Schema JSON-LD para SEO. |
| `POST` | `/api/generate` | Permite disparar uma geração sob demanda via webhook/API externa. |
| `GET` | `/api/trends` | Lista as principais tendências ativas do Google Trends no Brasil. |

---

## 🏢 Perfil Editorial da Prime Rank Marketing
As diretrizes de tom de voz, autoridade, público-alvo, chamadas para ação (CTA) e links para diagnóstico gratuito estão centralizados em:
`config/brand_profile.json`
