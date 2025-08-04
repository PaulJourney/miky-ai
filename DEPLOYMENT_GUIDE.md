# 🚀 Miky.ai - Deployment Guide: Netlify + Supabase

## 🗄️ 1. Setup Supabase Database

### Crea un nuovo progetto Supabase
1. Vai su [supabase.com](https://supabase.com)
2. Crea un account e un nuovo progetto
3. Prendi nota di:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: dalla sezione API Settings

### Esegui lo schema del database
1. Vai alla sezione "SQL Editor" nel dashboard Supabase
2. Copia e incolla il contenuto di `supabase-schema.sql`
3. Clicca "Run" per creare tutte le tabelle e funzioni

### Configura l'autenticazione
1. Vai su "Authentication" → "Settings"
2. Abilita "Email confirmations" se vuoi la verifica email
3. Configura i provider di login desiderati (Email/Password è già abilitato)

### Configura le politiche RLS (Row Level Security)
Le politiche sono già create nello schema SQL, ma verifica che siano attive:
- Users: possono vedere/modificare solo i propri dati
- Conversations/Messages: accesso solo alle proprie conversazioni
- Transactions/Referrals: accesso solo ai propri dati

## 🌐 2. Deploy su Netlify

### Preparazione del codice
1. Assicurati che tutte le dipendenze siano installate:
   ```bash
   bun install
   ```

2. Testa il build localmente:
   ```bash
   bun run build
   ```

### Deploy su Netlify
1. Vai su [netlify.com](https://netlify.com)
2. Connetti il tuo repository GitHub
3. Configura le build settings:
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`

### Configurazione variabili d'ambiente
Nel dashboard Netlify, vai su "Site settings" → "Environment variables" e aggiungi:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI (per le funzionalità AI)
VITE_OPENAI_API_KEY=your-openai-api-key

# Stripe (per i pagamenti)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key
```

## 🔧 3. Configurazione Dominio miky.ai

### Setup DNS
1. Nel dashboard Netlify, vai su "Domain settings"
2. Clicca "Add custom domain"
3. Inserisci `miky.ai`
4. Configura i DNS del tuo dominio:
   ```
   Type: CNAME
   Name: www
   Value: your-site-name.netlify.app

   Type: A
   Name: @
   Value: 75.2.60.5 (IP di Netlify)
   ```

### SSL Certificate
- Netlify configurerà automaticamente Let's Encrypt SSL
- Il sito sarà accessibile su `https://miky.ai`

## 🤖 4. Configurazione OpenAI

### Ottieni API Key
1. Vai su [platform.openai.com](https://platform.openai.com)
2. Crea un account o fai login
3. Vai su "API Keys" e crea una nuova chiave
4. Aggiungi credito al tuo account OpenAI

### Implementazione Chat AI
Il codice è già predisposto per usare OpenAI API. Per implementare la chat reale:

1. Modifica `src/lib/supabaseApi.ts` nel metodo `chatApi.sendMessage`
2. Sostituisci la mock response con una chiamata reale a OpenAI
3. Implementa la logica per diverse personas

## 💳 5. Configurazione Stripe (Opzionale)

### Setup Stripe
1. Crea un account Stripe
2. Ottieni le chiavi API (Test e Live)
3. Configura i prodotti e prezzi per i piani Plus/Business
4. Aggiorna le variabili d'ambiente con le chiavi Stripe

### Webhook Configuration
1. Configura webhook Stripe che punta a Netlify Functions
2. Implementa Netlify Functions per gestire eventi Stripe

## 🔍 6. Testing e Monitoring

### Test del sito
1. Registra un nuovo utente
2. Testa login/logout
3. Prova le funzionalità di chat
4. Verifica il sistema di referral
5. Testa i pagamenti (se configurati)

### Monitoring
- Usa Netlify Analytics per il traffico
- Supabase Dashboard per database monitoring
- OpenAI Usage Dashboard per monitorare i costi API

## 🎉 7. Vai Live!

Una volta completati tutti i passaggi:
1. Testa tutto in ambiente staging
2. Aggiorna le variabili d'ambiente con chiavi di produzione
3. Configura il dominio finale
4. Comunica il lancio!

## 🚨 Note di Sicurezza

- ✅ RLS abilitato su tutte le tabelle Supabase
- ✅ Headers di sicurezza configurati in netlify.toml
- ✅ CORS configurato correttamente
- ✅ API keys protette (solo quelle pubbliche nel frontend)
- ✅ HTTPS abilitato automaticamente

## 🆘 Troubleshooting

### Problemi comuni:
1. **Build fallisce**: Verifica che tutte le env vars siano configurate
2. **Auth non funziona**: Controlla URL e chiavi Supabase
3. **Chat non risponde**: Verifica API key OpenAI e crediti
4. **404 su refresh**: Verifica che la regola redirect sia in netlify.toml

### Log e Debug:
- Netlify Deploy Logs: nel dashboard Netlify
- Supabase Logs: nel dashboard Supabase
- Browser Console: per errori frontend
