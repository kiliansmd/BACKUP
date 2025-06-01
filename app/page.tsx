'use client';

import { ResumeSearchWrapper } from '@/components/ResumeSearchWrapper';
import { ResumeListWrapper } from '@/components/ResumeListWrapper';
import { FileText, Search, Filter, Shield, ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ResumesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-auto flex items-center justify-center p-2">
                  <Image 
                    src="/logo-white.png" 
                    alt="Company Logo" 
                    width={214} 
                    height={32} 
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-700 px-3 py-1.5 rounded-lg text-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>DSGVO-konform</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Hero Section - Bereinigt */}
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200">
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Kandidaten-Portfolio
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Durchsuchen Sie anonymisierte Kandidatenprofile mit vollständiger DSGVO-Compliance. 
                Alle Profile wurden automatisch pseudonymisiert.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">DSGVO-konform</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Vollständig anonymisiert und rechtssicher</p>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Pseudonymisiert</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Automatische PII-Entfernung bei Upload</p>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Search className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Intelligente Suche</h3>
                  </div>
                  <p className="text-gray-600 text-sm">KI-gestützte Kandidatenanalyse</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center mt-8">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-lg font-semibold"
                >
                  Neuen CV hochladen
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">Erweiterte Suche & Filter</h2>
                  <p className="text-gray-600">Finden Sie den perfekten Kandidaten mit präzisen Filteroptionen</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl border border-gray-200">
                  <Filter className="h-5 w-5" />
                  <span className="font-medium">Smart Filter</span>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <ResumeSearchWrapper />
            </div>
          </div>

          {/* Candidates List */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Kandidaten Portfolio</h2>
                    <p className="text-gray-600">Alle Profile pseudonymisiert un// 1. NEUE HAUPTSEITE: app/page.tsx (Ersetzt beide alten Versionen)
'use client';

import { useState, Suspense } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ResumeListWrapper } from '@/components/ResumeListWrapper';
import { ResumeSearchWrapper } from '@/components/ResumeSearchWrapper';
import { Upload, Users, Search, FileText, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'upload' | 'candidates'>('candidates');
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleUploadSuccess = (data: any) => {
    setUploadedCount(prev => prev + 1);
    setTimeout(() => {
      setActiveTab('candidates');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Navigation Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo-white.png" 
                alt="Company Logo" 
                width={214} 
                height={32} 
                className="object-contain"
              />
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-700 px-3 py-1.5 rounded-lg text-sm">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>DSGVO-konform</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Compact Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              KI-gestützte Bewerberverwaltung
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Erstellen Sie Bewerbermappen oder durchsuchen Sie bestehende Profile
            </p>

            {/* Simple Tab Navigation */}
            <div className="flex items-center justify-center">
              <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      activeTab === 'upload'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    Bewerbermappe erstellen
                  </button>
                  <button
                    onClick={() => setActiveTab('candidates')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      activeTab === 'candidates'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    Profile einsehen
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'upload' ? (
              /* Upload Section */
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Neue Bewerbermappe erstellen
                      </h2>
                      <p className="text-gray-600">CV hochladen und automatisch analysieren lassen</p>
                    </div>
                  </div>
                  
                  {uploadedCount > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        <span>{uploadedCount} CV(s) erfolgreich verarbeitet</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <FileUpload onUploadSuccess={handleUploadSuccess} />
                </div>
              </div>
            ) : (
              /* Candidates Section */
              <div className="space-y-6">
                {/* Search Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                        <Search className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          Profile durchsuchen
                        </h2>
                        <p className="text-gray-600">Finden Sie passende Kandidaten</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <Suspense fallback={
                      <div className="animate-pulse bg-gray-100 h-16 rounded-lg"></div>
                    }>
                      <ResumeSearchWrapper />
                    </Suspense>
                  </div>
                </div>

                {/* Candidates List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            Kandidaten-Profile
                          </h2>
                          <p className="text-gray-600">Anonymisierte Bewerberdaten</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        <span>DSGVO-konform</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <Suspense fallback={
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse bg-gray-100 h-24 rounded-lg"></div>
                        ))}
                      </div>
                    }>
                      <ResumeListWrapper />
                    </Suspense>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="mt-16 bg-white text-gray-600 border-t border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo-white.png" 
                alt="Company Logo" 
                width={214} 
                height={32} 
                className="object-contain"
              />
            </div>
            <div className="text-sm">
              KI-gestützte Bewerberverwaltung mit DSGVO-Compliance
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}