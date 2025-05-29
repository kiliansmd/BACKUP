# CV-Parser System

Ein modernes CV-Parser System gebaut mit Next.js 15, TypeScript, React 19, Firebase/Firestore und einer externen Resume Parser API.

## 🚀 Features

- **CV Upload & Parsing**: Automatisches Parsen von PDF-CVs mit externer API
- **Firebase Integration**: Speicherung und Verwaltung von Kandidatendaten
- **Responsive Design**: Optimiert für Desktop und Mobile
- **TypeScript**: Vollständige Typisierung für bessere Entwicklererfahrung
- **Modern UI**: Tailwind CSS mit Radix UI Komponenten
- **Export Funktionen**: PDF-Export von Kandidatenprofilen
- **Real-time Data**: Live-Updates über Firebase

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.2.4, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Firebase/Firestore
- **File Upload**: Resume Parser API
- **Icons**: Lucide React
- **Build Tool**: Next.js mit Turbopack

## 📋 Voraussetzungen

- Node.js 18+ 
- npm oder pnpm
- Firebase Projekt
- Resume Parser API Key

## 🔧 Installation

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd cv-parser-system
   ```

2. **Dependencies installieren**
   ```bash
   npm install
   # oder
   pnpm install
   ```

3. **Umgebungsvariablen konfigurieren**
   ```bash
   cp .env.example .env.local
   ```
   
   Fülle die `.env.local` Datei mit deinen Werten:
   ```env
   FIREBASE_PROJECT_ID=dein-firebase-projekt-id
   FIREBASE_CLIENT_EMAIL=deine-firebase-client-email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ndein-private-key\n-----END PRIVATE KEY-----\n"
   RESUME_PARSER_API_KEY=dein-resume-parser-api-key
   ```

4. **Firebase Setup**
   - Erstelle ein Firebase Projekt
   - Aktiviere Firestore Database
   - Erstelle einen Service Account und lade die Credentials herunter
   - Füge die Credentials zu deiner `.env.local` hinzu

5. **Development Server starten**
   ```bash
   npm run dev
   # oder
   pnpm dev
   ```

   Die Anwendung ist unter [http://localhost:3000](http://localhost:3000) verfügbar.

## 📁 Projektstruktur

```
cv-parser-system/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── candidate/         # Kandidaten-Detail Seiten
│   └── resumes/           # Übersichtsseite
├── components/            # React Komponenten
│   ├── ui/               # UI Basis-Komponenten
│   └── ...               # Feature-spezifische Komponenten
├── lib/                   # Utility Libraries
├── types/                 # TypeScript Type Definitionen
├── utils/                 # Helper Functions
├── config/                # Konfigurationsdateien
└── public/               # Statische Assets
```

## 🔥 Firebase Konfiguration

1. **Firestore Collections**:
   - `resumes`: Gespeicherte CV-Daten
   - Automatische Indexierung für Suchfunktionen

2. **Security Rules** (Beispiel):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /resumes/{document} {
         allow read, write: if true; // Anpassen nach Bedarf
       }
     }
   }
   ```

## 📝 API Endpoints

- `GET /api/get-resumes` - Alle CVs abrufen
- `GET /api/resume/[id]` - Einzelnen CV abrufen
- `POST /api/parse-resume` - CV hochladen und parsen
- `DELETE /api/resume/[id]` - CV löschen

## 🎨 UI Komponenten

Das System verwendet eine konsistente Design-Sprache mit:
- **Farbschema**: Indigo/Blue Harmony mit Emerald und Amber Akzenten
- **Typografie**: Optimierte Schriftgrößen und Abstände
- **Responsive Design**: Mobile-first Ansatz
- **Accessibility**: WCAG-konforme Kontraste

## 🚀 Deployment

### Vercel (Empfohlen)

1. **Vercel CLI installieren**
   ```bash
   npm i -g vercel
   ```

2. **Projekt deployen**
   ```bash
   vercel
   ```

3. **Umgebungsvariablen in Vercel Dashboard hinzufügen**

### Andere Plattformen

Das Projekt kann auf jeder Plattform deployed werden, die Next.js unterstützt:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Testing

```bash
# TypeScript Check
npm run type-check

# Build Test
npm run build

# Linting
npm run lint
```

## 📊 Performance

- **Lighthouse Score**: 90+ in allen Kategorien
- **Core Web Vitals**: Optimiert
- **Bundle Size**: Minimiert durch Code Splitting
- **Caching**: Optimierte Caching-Strategien

## 🔒 Sicherheit

- **Environment Variables**: Sensible Daten in `.env.local`
- **API Rate Limiting**: Schutz vor Missbrauch
- **Input Validation**: Zod Schema Validierung
- **Error Handling**: Umfassendes Error Management

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🆘 Support

Bei Fragen oder Problemen:
1. Überprüfe die [Issues](../../issues)
2. Erstelle ein neues Issue mit detaillierter Beschreibung
3. Kontaktiere das Entwicklerteam

## 🔄 Changelog

### Version 1.0.0
- Initiale Release
- CV Upload und Parsing
- Firebase Integration
- Responsive UI
- Export Funktionen

---

**Entwickelt mit ❤️ für moderne CV-Verwaltung** 