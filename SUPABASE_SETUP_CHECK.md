# 🔍 Controllo configurazione Supabase per miky.ai

## ❓ **PRIMA DI TUTTO: Hai eseguito lo script SQL?**

**Vai su**: https://hxzkatnnkentldpwlqtd.supabase.co

### **1. Verifica tabelle esistenti**
1. **Vai su "Table Editor"** nel menu laterale
2. **Dovresti vedere queste tabelle**:
   - ✅ `users`
   - ✅ `conversations`
   - ✅ `messages`
   - ✅ `transactions`
   - ✅ `referrals`
   - ✅ `admin_settings`

### **2. Se NON vedi queste tabelle - ESEGUI LO SCRIPT:**
1. **Vai su "SQL Editor"**
2. **Copia TUTTO il contenuto** di `supabase-schema.sql`
3. **Incolla e clicca "Run"**

### **3. Verifica configurazione Auth**
1. **Vai su "Authentication" → "Settings"**
2. **Verifica**:
   - ✅ Email confirmations: Abilitato o disabilitato (a tua scelta)
   - ✅ Enable email confirmations: Come preferisci
   - ✅ Site URL: `https://miky-ai.netlify.app` (o il tuo dominio)

### **4. Verifica RLS (Row Level Security)**
1. **Vai su "Table Editor"**
2. **Per ogni tabella** clicca sull'icona lucchetto
3. **Dovrebbe dire "RLS enabled"**

### **5. Test connessione**
1. **Vai su "API"** nel menu laterale
2. **Copia l'URL**: `https://hxzkatnnkentldpwlqtd.supabase.co`
3. **Copia l'anon key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🚨 **Se il sign up ancora non funziona:**

### **Possibili cause:**
1. **Script SQL non eseguito** → Esegui `supabase-schema.sql`
2. **Environment variables sbagliate** → Controlla in Netlify
3. **Trigger utenti non funzionante** → Lo script li crea automaticamente
4. **RLS troppo restrittivo** → Le policy sono nel database

### **Come debuggare:**
1. **Apri la console browser** (F12)
2. **Prova a fare sign up**
3. **Guarda gli errori** nella console
4. **Cerca errori Supabase** nel Network tab

## 🔧 **Script SQL completo da eseguire:**

Se le tabelle non esistono, esegui questo nel SQL Editor di Supabase:

```sql
-- [Qui il contenuto di supabase-schema.sql]
```
