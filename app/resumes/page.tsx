'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { ResumeSearch } from '@/components/ResumeSearch';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Sparkles, Users, TrendingUp, Clock, Search, Filter } from 'lucide-react';

const ResumesPageSkeleton = () => (
  <div className="space-y-8">
    {/* Header Skeleton */}
    <div className="bg-gradient-to-r from-achieve-ka/5 to-blue/5 rounded-3xl p-8 border border-achieve-ka/10 animate-pulse">
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

const ResumeList = dynamic(() => import('@/components/ResumeList').then(mod => ({ default: mod.ResumeList })), {
  loading: () => <ResumesPageSkeleton />,
  ssr: false
});

export default function ResumesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-achieve-ka/10 via-blue/10 to-purple/10 rounded-3xl p-12 border border-achieve-ka/20 shadow-xl">
              {/* Background Elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-achieve-ka/30 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-br from-blue/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
              </div>

              <div className="relative z-10 text-center space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-achieve-ka to-blue rounded-2xl flex items-center justify-center shadow-lg">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="w-4 h-4 bg-yellow rounded-full animate-ping" />
                  <div className="w-3 h-3 bg-green rounded-full animate-ping delay-300" />
                  <div className="w-2 h-2 bg-blue rounded-full animate-ping delay-700" />
                </div>

                <h1 className="text-5xl font-bold text-gray-950 mb-4">
                  Kandidaten
                  <span className="bg-gradient-to-r from-achieve-ka to-blue bg-clip-text text-transparent ml-3">
                    Übersicht
                  </span>
                </h1>
                
                <p className="text-xl text-gray-950 max-w-3xl mx-auto leading-relaxed">
                  Entdecken Sie hochqualifizierte Kandidaten mit KI-gestützter Analyse. 
                  Sortiert nach Aktualität mit intelligenter Kennzeichnung neuer Profile.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-gray-950">
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/50">
                    <Clock className="h-5 w-5 text-achieve-ka" />
                    <span className="font-medium">Automatisch sortiert</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/50">
                    <Sparkles className="h-5 w-5 text-yellow" />
                    <span className="font-medium">NEU-Tags für ungesehene</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/50">
                    <TrendingUp className="h-5 w-5 text-green" />
                    <span className="font-medium">KI-Powered Insights</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Search Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue/5 p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue/10 rounded-2xl flex items-center justify-center">
                    <Search className="h-5 w-5 text-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-950">Erweiterte Suche & Filter</h2>
                    <p className="text-gray-950">Finden Sie den perfekten Kandidaten mit präzisen Filteroptionen</p>
                  </div>
                  <div className="ml-auto">
                    <div className="flex items-center gap-2 bg-achieve-ka/10 text-achieve-ka px-3 py-1 rounded-xl border border-achieve-ka/20">
                      <Filter className="h-4 w-4" />
                      <span className="font-medium text-sm">Smart Filter</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <ResumeSearch />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-achieve-ka/5 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-achieve-ka/10 rounded-2xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-achieve-ka" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-950">Kandidaten Portfolio</h2>
                      <p className="text-gray-950">Alle Profile im Überblick - sortiert nach Erstellungsdatum</p>
                    </div>
                  </div>
                  
                  {/* Stats Preview */}
                  <div className="hidden md:flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-achieve-ka">●</div>
                      <div className="text-xs text-gray-950">Live Updates</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue">⚡</div>
                      <div className="text-xs text-gray-950">KI-Analyse</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow">✨</div>
                      <div className="text-xs text-gray-950">Premium Design</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <ResumeList />
              </div>
            </div>

            {/* Footer Info */}
            <div className="bg-gradient-to-r from-achieve-ka/5 to-blue/5 rounded-3xl p-8 border border-achieve-ka/10 text-center">
              <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-6 w-6 text-achieve-ka animate-pulse" />
                  <h3 className="text-lg font-bold text-gray-950">Intelligente Kandidatenverwaltung</h3>
                  <Sparkles className="h-6 w-6 text-blue animate-pulse delay-500" />
                </div>
                <p className="text-gray-950">
                  Nutzen Sie unsere KI-gestützte Plattform für eine effiziente und moderne Kandidatenverwaltung. 
                  Neue Profile werden automatisch markiert und alle Daten strukturiert dargestellt.
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-950 mt-6">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green rounded-full animate-pulse" />
                    System Online
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue rounded-full animate-pulse delay-300" />
                    KI-Engine Active
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-yellow rounded-full animate-pulse delay-700" />
                    Real-time Updates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 