# �� CV-Parser System - Production Deployment Guide

## Quick Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kiliansmd/BACKUP.git)

### 1. **One-Click Vercel Deployment**

1. **Click Deploy Button** above or go to [Vercel](https://vercel.com)
2. **Import from GitHub**: `https://github.com/kiliansmd/BACKUP.git`
3. **Project Name**: `cv-parser-system` (or custom name)
4. **Framework**: Auto-detected as Next.js
5. **Deploy**: Click "Deploy" button

### 2. **Environment Variables Setup**

After successful deployment, configure these environment variables in Vercel Dashboard:

#### **Required for Production:**

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"

# Resume Parser API
NEXT_PUBLIC_RESUME_PARSER_API=your-resume-parser-api-key
NEXT_PUBLIC_RESUME_PARSER_URL=https://resumeparser.app/resume/parse
```

#### **Auto-configured by Vercel:**

```env
# Vercel KV (Add via Vercel Dashboard > Storage > KV)
KV_URL=auto-generated
KV_REST_API_URL=auto-generated
KV_REST_API_TOKEN=auto-generated
KV_REST_API_READ_ONLY_TOKEN=auto-generated
```

### 3. **Add Vercel KV Storage**

1. Go to **Vercel Dashboard** > Your Project
2. Click **Storage** tab
3. Click **Create Database** > **KV**
4. Name: `cv-parser-cache`
5. Environment variables will be auto-added

### 4. **Firebase Setup**

1. **Create Firebase Project**: [console.firebase.google.com](https://console.firebase.google.com)
2. **Enable Firestore**: Database > Create database > Production mode
3. **Service Account**: 
   - Project Settings > Service Accounts
   - Generate new private key
   - Use email and private key in environment variables

### 5. **Resume Parser API**

1. **Sign up**: [resumeparser.app](https://resumeparser.app)
2. **Get API Key**: Dashboard > API Keys
3. **Add to environment variables**

---

## 🎯 **Mock Mode (Development)**

The application works **without any environment variables** in development mode:

- ✅ **Runs immediately** with `npm run dev`
- ✅ **3 test candidates** with full profiles
- ✅ **All UI features** functional
- ✅ **PDF export** working

Perfect for testing and development!

---

## 🏗️ **Manual Deployment Options**

### **Netlify**

```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
# Same as Vercel setup above
```

### **Digital Ocean App Platform**

```yaml
# app.yaml
name: cv-parser-system
services:
- name: web
  source_dir: /
  github:
    repo: kiliansmd/BACKUP
    branch: main
  run_command: npm start
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
```

### **Railway**

```bash
# Connect GitHub repo
railway link https://github.com/kiliansmd/BACKUP.git

# Deploy
railway up
```

---

## 🔧 **Local Development**

```bash
# 1. Clone repository
git clone https://github.com/kiliansmd/BACKUP.git
cd BACKUP

# 2. Install dependencies
npm install

# 3. Start development server (Mock mode)
npm run dev
# Opens on http://localhost:3000

# 4. Optional: Add environment variables
cp .env.example .env.local
# Fill in your actual values
```

---

## 📊 **Performance & Monitoring**

### **Built-in Features:**

- ✅ **Static Generation**: Optimized for Vercel Edge
- ✅ **Redis Caching**: Vercel KV for sub-second responses  
- ✅ **Image Optimization**: Next.js automatic optimization
- ✅ **Bundle Analysis**: Code splitting + tree shaking
- ✅ **Error Handling**: Graceful fallbacks

### **Monitoring Setup:**

```javascript
// Add to vercel.json for analytics
{
  "analytics": true,
  "speedInsights": {
    "enabled": true
  }
}
```

---

## 🔒 **Security & Compliance**

### **Environment Isolation:**

- ✅ **Development**: Mock data, no external APIs
- ✅ **Production**: Real Firebase + API integration
- ✅ **Staging**: Separate Firebase project recommended

### **Data Protection:**

- ✅ **DSGVO-compliant**: Automatic pseudonymization
- ✅ **API Security**: Rate limiting + input validation
- ✅ **Firebase Security**: Firestore security rules

---

## 🚨 **Troubleshooting**

### **Build Errors:**

```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm install
npm run build
```

### **Environment Variables:**

```bash
# Verify in Vercel Dashboard
vercel env ls

# Test locally
npm run build
# Should work in mock mode
```

### **Firebase Connection:**

```javascript
// Test Firebase connection
// Check logs in Vercel > Functions > View Details
```

---

## 📈 **Scaling & Production**

### **Vercel Pro Features:**

- ✅ **Unlimited bandwidth**
- ✅ **Advanced analytics** 
- ✅ **Team collaboration**
- ✅ **Preview deployments**

### **Database Scaling:**

- ✅ **Firestore**: 1M+ documents supported
- ✅ **Vercel KV**: Redis scaling
- ✅ **CDN**: Global edge distribution

---

## 🎯 **Production Checklist**

- [ ] **Vercel deployment** successful
- [ ] **Environment variables** configured
- [ ] **Vercel KV** database added
- [ ] **Firebase project** created & connected
- [ ] **Resume Parser API** key added
- [ ] **Custom domain** (optional)
- [ ] **SSL certificate** (auto by Vercel)
- [ ] **Analytics** enabled
- [ ] **Monitoring** setup

---

## 🔗 **Useful Links**

- **Live Demo**: [Your Vercel URL after deployment]
- **GitHub Repo**: https://github.com/kiliansmd/BACKUP.git
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com
- **Resume Parser**: https://resumeparser.app

---

**🎉 Ready for Production!**

The application is fully optimized for modern deployment platforms with automatic scaling, caching, and monitoring. 

# Vercel Deployment Checkliste

## Vor dem Deployment

### 1. Umgebungsvariablen vorbereiten
```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----"

# Resume Parser API
NEXT_PUBLIC_RESUME_PARSER_API=your-api-key
NEXT_PUBLIC_RESUME_PARSER_URL=https://api.resumeparser.com
```

### 2. Firebase-Konfiguration
- [ ] Firebase-Projekt erstellt
- [ ] Service Account erstellt und Schlüssel heruntergeladen
- [ ] Firestore-Datenbank initialisiert
- [ ] Firestore-Regeln konfiguriert
- [ ] CORS-Einstellungen überprüft

### 3. Lokale Tests
```bash
# Dependencies installieren
npm install

# TypeScript-Prüfung
npm run type-check

# Build testen
npm run build

# Linting
npm run lint
```

## Deployment-Prozess

### 1. Vercel CLI Installation (optional)
```bash
npm i -g vercel
```

### 2. Vercel Projekt einrichten
- [ ] GitHub-Repository mit Vercel verbinden
- [ ] Framework-Preset auf Next.js setzen
- [ ] Build-Einstellungen überprüfen
- [ ] Umgebungsvariablen in Vercel Dashboard eintragen

### 3. Deployment-Einstellungen
- [ ] Region auf "fra1" setzen
- [ ] Build-Cache aktivieren
- [ ] Serverless Function Limits anpassen
- [ ] Edge Config aktivieren (optional)

## Nach dem Deployment

### 1. Funktionstest
- [ ] Firebase-Verbindung testen
- [ ] Resume-Parser-Integration testen
- [ ] File Upload testen
- [ ] PDF Export testen

### 2. Performance
- [ ] Lighthouse Score überprüfen
- [ ] Core Web Vitals überprüfen
- [ ] API Response Times monitoren

### 3. Monitoring einrichten
- [ ] Error Tracking aktivieren
- [ ] Performance Monitoring aktivieren
- [ ] Usage Alerts konfigurieren

### 4. Backup & Recovery
- [ ] Firestore Backup einrichten
- [ ] Deployment Rollback-Strategie testen
- [ ] Disaster Recovery Plan dokumentieren

## Troubleshooting

### Firebase Verbindungsprobleme
1. Private Key Format überprüfen:
   - Newlines müssen korrekt escaped sein
   - Key muss in Anführungszeichen sein
   - Keine zusätzlichen Spaces

2. CORS-Fehler:
   ```json
   {
     "origin": ["https://your-domain.vercel.app"],
     "methods": ["GET", "POST", "PUT", "DELETE"],
     "maxAgeSeconds": 3600
   }
   ```

3. Firestore Timeouts:
   - Prüfen Sie die Serverless Function Timeout-Einstellungen
   - Erhöhen Sie ggf. die Memory-Allocation

### Resume Parser Integration
1. API Key Validation:
   ```bash
   curl -X POST https://api.resumeparser.com/validate \
     -H "Authorization: Bearer $YOUR_API_KEY"
   ```

2. File Upload Limits:
   - Maximum file size in `next.config.mjs` anpassen
   - Vercel Payload Limits beachten

## Sicherheits-Checkliste

### 1. Umgebungsvariablen
- [ ] Alle Secrets sind in Vercel gespeichert
- [ ] Keine Hardcoded Credentials
- [ ] Produktions-Keys sind separat von Development

### 2. API-Sicherheit
- [ ] Rate Limiting aktiviert
- [ ] CORS korrekt konfiguriert
- [ ] Authentication implementiert

### 3. Firebase-Sicherheit
- [ ] Firestore Rules sind restriktiv
- [ ] Service Account hat minimale Berechtigungen
- [ ] IP-Whitelist konfiguriert (wenn möglich)

## Monitoring & Wartung

### 1. Monitoring Setup
```bash
# Vercel Analytics aktivieren
vercel analytics enable

# Error Tracking einrichten
vercel integrations add sentry
```

### 2. Regelmäßige Wartung
- Wöchentliche Überprüfung der Logs
- Monatliches Backup der Firestore-Daten
- Vierteljährliche Überprüfung der Dependencies

### 3. Alerts einrichten
- Error Rate Threshold
- Performance Degradation
- Usage Limits

## Rollback-Strategie

### 1. Deployment Rollback
```bash
# Zur vorherigen Version zurückkehren
vercel rollback

# Spezifische Deployment-ID
vercel rollback <deployment-id>
```

### 2. Daten-Rollback
- Firestore Point-in-Time Recovery
- Backup Restoration Prozess
- Data Migration Rollback

## Support & Dokumentation

### Wichtige Links
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com)
- [Next.js Dokumentation](https://nextjs.org/docs)

### Support-Kontakte
- Vercel Support: support@vercel.com
- Firebase Support: firebase-support@google.com
- Internal Support: devops@yourcompany.com 