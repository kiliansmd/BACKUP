# 🚀 CV-Parser System - Deployment Guide

## 📋 Überblick

Dieses Next.js 15 CV-Parser System ist optimiert für **Vercel Deployment** mit folgenden Features:
- **Firebase/Firestore** für Datenspeicherung
- **Vercel KV** für Redis-Caching
- **Puppeteer** für PDF-Generation
- **Resume Parser API** für CV-Parsing
- **Unified Color Palette** basierend auf Design-Vorgaben

---

## 🔧 Required Environment Variables für Vercel

### **1. Firebase Configuration (Critical)**
```bash
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com  
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----"
```

### **2. External API Services (Critical)**
```bash
NEXT_PUBLIC_RESUME_PARSER_API=your-resumeparser-api-key
NEXT_PUBLIC_RESUME_PARSER_URL=https://resumeparser.app/resume/parse
```

### **3. Vercel KV Redis (Auto-configured)**
Diese werden automatisch von Vercel hinzugefügt, wenn Sie KV Storage aktivieren:
```bash
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

### **4. Company Branding (Optional)**
```bash
NEXT_PUBLIC_COMPANY_NAME=getexperts
NEXT_PUBLIC_CONTACT_EMAIL=kontakt@getexperts.io
NEXT_PUBLIC_CONTACT_PHONE=+49 2111 7607 313
NEXT_PUBLIC_CONTACT_ADDRESS=Rudolfplatz 3, 50674 Köln
```

---

## 🏗️ Vercel Deployment Steps

### **Step 1: Repository Import**
1. Gehen Sie zu [vercel.com](https://vercel.com)
2. Klicken Sie **"New Project"**
3. Wählen Sie GitHub Repository: **`kiliansmd/BACKUP`**
4. Klicken Sie **"Import"**

### **Step 2: Build Settings (Auto-detected)**
Vercel erkennt automatisch:
- **Framework**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### **Step 3: Environment Variables**
Unter **Settings → Environment Variables** eintragen:

#### **🔥 Firebase Setup** (Required)
```
FIREBASE_PROJECT_ID: your-firebase-project-id
FIREBASE_CLIENT_EMAIL: your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----"
```

#### **🔌 External APIs** (Required)
```
NEXT_PUBLIC_RESUME_PARSER_API: your-api-key-here
NEXT_PUBLIC_RESUME_PARSER_URL: https://resumeparser.app/resume/parse
```

### **Step 4: Add Vercel KV Storage**
1. Gehen Sie zu **Storage** Tab in Ihrem Vercel Projekt
2. Klicken Sie **"Create Database"**
3. Wählen Sie **"KV"** (Redis)
4. Die KV Environment Variables werden automatisch hinzugefügt

### **Step 5: Deploy**
Klicken Sie **"Deploy"** - Das System wird automatisch gebaut und deployed!

---

## 🔍 Verification & Testing

### **Development Mode Features**
Das System enthält **Mock Data** für Development:
- Läuft ohne Firebase/KV Credentials
- Zeigt 3 Test-Kandidaten
- Alle UI-Features funktionsfähig

### **Production Verification**
Nach dem Deployment prüfen:
1. **✅ Homepage** lädt korrekt
2. **✅ CV Upload** funktioniert
3. **✅ Kandidaten-Suche** zeigt Ergebnisse
4. **✅ PDF Export** generiert Downloads
5. **✅ Color Palette** entspricht Vorgaben

---

## 🛠️ Technische Details

### **Performance Optimierungen**
- **Rate Limiting**: 100 Requests/Minute
- **Caching**: Vercel KV für Resume-Daten
- **Image Optimization**: Next.js optimierte Bilder
- **Static Generation**: Wo möglich pre-rendered

### **Error Handling**
- **API Middleware**: Automatisches Error Handling
- **Fallback Systems**: Mock-Daten bei fehlenden Credentials
- **Graceful Degradation**: PDF Export mit Client-Fallback

### **Color System**
Vereinheitlichte Farbpalette implementiert:
- **White**: `#FFFFFF`
- **Gray 50/200/950**: Abgestufte Grautöne
- **Achieve KA**: `#6366F1` (Primary)
- **Achieve Mid**: `#4F46E5` (Secondary)
- **Blue**: `#3B82F6` (Accent)
- **Royal Blue**: `#1E40AF` (Dark Accent)
- **Yellow**: `#F59E0B` (Highlight)

---

## 🆘 Troubleshooting

### **Common Issues**

#### **"Firebase Error"**
- ✅ Überprüfen Sie `FIREBASE_PROJECT_ID`
- ✅ Validieren Sie `FIREBASE_PRIVATE_KEY` Format
- ✅ Service Account Berechtigung prüfen

#### **"Resume Parser Failed"**
- ✅ API Key in `NEXT_PUBLIC_RESUME_PARSER_API` gültig?
- ✅ Rate Limits der External API erreicht?

#### **"PDF Export nicht verfügbar"**
- ✅ Puppeteer läuft in Vercel Environment
- ✅ Client-Fallback zu html2pdf.js aktiv

### **Support Resources**
- **Logs**: Vercel Dashboard → Functions → View Logs
- **Environment**: Settings → Environment Variables
- **Build Logs**: Deployments → View Function Logs

---

## 📈 Post-Deployment

### **Monitoring**
- **Analytics**: Vercel Analytics automatisch aktiviert
- **Performance**: Core Web Vitals Tracking
- **Error Tracking**: Function Logs in Real-time

### **Scaling**
- **Auto-scaling**: Vercel skaliert automatisch
- **KV Storage**: Bis zu 30GB included
- **Bandwidth**: Generous limits für CV-Downloads

---

## ✅ Ready for Production!

Das System ist vollständig konfiguriert für:
- ✅ **Professional CV Management**
- ✅ **Scalable Architecture** 
- ✅ **Modern UI/UX**
- ✅ **Enterprise-ready Features**
- ✅ **Unified Design System** 