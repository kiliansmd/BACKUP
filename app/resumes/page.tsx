'use client';

import { ResumeSearchWrapper } from '@/components/ResumeSearchWrapper';
import { ResumeListWrapper } from '@/components/ResumeListWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Sparkles, Users, TrendingUp, Clock, Search, Filter, Brain, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ResumesPageSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="bg-gradient-to-r from-gray-900/5 to-gray-800/5 rounded-3xl p-8 border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-12 w-32 rounded-2xl" />
          <Skeleton className="h-12 w-24 rounded-2xl" />
        </div>
      </div>
    </div>

    {/* Search Skeleton */}
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 animate-pulse">
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>

    {/* Cards Skeleton */}
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 animate-pulse">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6 flex-1">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-6 w-48" />
                <div className="flex gap-4">
                  <Skeleton className="h-8 w-32 rounded-xl" />
                  <Skeleton className="h-8 w-28 rounded-xl" />
                  <Skeleton className="h-8 w-36 rounded-xl" />
                </div>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} className="h-7 w-20 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
            <Skeleton className="h-12 w-28 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function ResumesPage() {
  const router = useRouter();

  return (
    <>
      {/* Minimaler weißer Hintergrund für den gesamten Viewport */}
      <div className="min-h-screen" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
        
        {/* Container für den Inhalt mit padding */}
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header als dunkle Kachel */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-700/20">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
                      <Image 
                        src="/logo-white.png" 
                        alt="Company Logo" 
                        width={40} 
                        height={40} 
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white">Acme Inc.</span>
                      <span className="text-sm text-gray-300">Premium DSGVO-konforme Übersicht</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => router.push('/')}
                    className="hidden sm:flex bg-white/10 border border-white/20 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Neuer Upload
                  </Button>
                  <Button 
                    onClick={() => router.push('/')}
                    className="bg-white hover:bg-gray-100 text-gray-900 font-semibold shadow-lg"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            {/* Hero Header als große dunkle Kachel */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 shadow-2xl border border-gray-700/20">
              <div className="text-center space-y-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl p-3">
                    <Image 
                      src="/logo-white.png" 
                      alt="Company Logo" 
                      width={48} 
                      height={48} 
                    />
                  </div>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping delay-300" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping delay-700" />
                </div>

                <h1 className="text-6xl font-bold text-white mb-6">
                  Exklusive
                  <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent block mt-2">
                    Kandidaten
                  </span>
                </h1>
                
                <p className="text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                  Premium Kandidatenportal mit vollständiger DSGVO-Anonymisierung. 
                  Professionelle Profile für höchste Ansprüche von Acme Inc.
                </p>

                {/* Feature-Kacheln als Teil der Hero-Sektion */}
                <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center">
                        <Shield className="h-6 w-6 text-gray-900" />
                      </div>
                      <h3 className="text-lg font-bold text-white">DSGVO-konform</h3>
                    </div>
                    <p className="text-gray-300 text-sm">Vollständig anonymisiert und rechtssicher</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-gray-900" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Pseudonymisiert</h3>
                    </div>
                    <p className="text-gray-300 text-sm">Automatische PII-Entfernung bei Upload</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-gray-900" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Premium Insights</h3>
                    </div>
                    <p className="text-gray-300 text-sm">KI-gestützte Kandidatenanalyse</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Search Section als dunkle Kachel */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700/20 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                    <Search className="h-6 w-6 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">Erweiterte Suche & Filter</h2>
                    <p className="text-gray-300">Finden Sie den perfekten Kandidaten mit präzisen Filteroptionen</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl border border-white/20">
                    <Filter className="h-5 w-5" />
                    <span className="font-medium">Smart Filter</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-white rounded-t-3xl">
                <ResumeSearchWrapper />
              </div>
            </div>

            {/* Main Content Area als dunkle Kachel */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700/20 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Kandidaten Portfolio</h2>
                      <p className="text-gray-300">Alle Profile pseudonymisiert und DSGVO-konform</p>
                    </div>
                  </div>
                  
                  {/* Stats Preview */}
                  <div className="hidden md:flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">●</div>
                      <div className="text-xs text-gray-300">Live Updates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400">⚡</div>
                      <div className="text-xs text-gray-300">KI-Analyse</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400">✨</div>
                      <div className="text-xs text-gray-300">Premium Design</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-white rounded-t-3xl">
                <ResumeListWrapper />
              </div>
            </div>

            {/* Footer Info als dunkle Kachel */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 text-center shadow-2xl border border-gray-700/20">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
                  <h3 className="text-2xl font-bold text-white">Exklusive Kandidatenverwaltung</h3>
                  <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse delay-500" />
                </div>
                <p className="text-xl text-gray-200 leading-relaxed">
                  Professionelle KI-gestützte Plattform mit vollständiger DSGVO-Anonymisierung. 
                  Alle Profile werden automatisch pseudonymisiert und strukturiert dargestellt.
                </p>
                <div className="flex items-center justify-center gap-8 text-gray-200 mt-8">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-medium">System Online</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300" />
                    <span className="font-medium">Pseudonymisierung Active</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-700" />
                    <span className="font-medium">DSGVO-konform</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 