'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';
import { Upload, Zap, CheckCircle, Users, TrendingUp, Sparkles, ArrowRight, Brain, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  const [uploadedCount, setUploadedCount] = useState(0);
  const router = useRouter();

  const handleUploadSuccess = (data: any) => {
    setUploadedCount(prev => prev + 1);
    console.log('Upload successful:', data);
  };

  return (
    <>
      {/* 95% weißer Hintergrund für den gesamten Viewport */}
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
                        src="/logo-white.svg" 
                        alt="Acme Inc Logo" 
                        width={40} 
                        height={40} 
                        className="invert"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-white">Acme Inc.</span>
                      <span className="text-sm text-gray-300">Premium CV Parser</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => router.push('/resumes')}
                    className="hidden sm:flex bg-white/10 border border-white/20 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Kandidaten
                  </Button>
                  <Button 
                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white hover:bg-gray-100 text-gray-900 font-semibold shadow-lg"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            {/* Hero Section als große dunkle Kachel */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-16 shadow-2xl border border-gray-700/20">
              {/* Background Animation */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-gray-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-gray-300/20 to-transparent rounded-full blur-3xl animate-pulse delay-500" />
              </div>

              <div className="relative z-10 text-center space-y-8">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl p-3">
                    <Image 
                      src="/logo-white.svg" 
                      alt="Acme Inc Logo" 
                      width={60} 
                      height={60} 
                      className="invert"
                    />
                  </div>
                  <div className="w-5 h-5 bg-yellow-400 rounded-full animate-ping" />
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-ping delay-300" />
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping delay-700" />
                </div>

                <h1 className="text-6xl font-bold text-white leading-tight">
                  Exklusive
                  <span className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent block mt-2">
                    CV-Analyse
                  </span>
                </h1>
                
                <p className="text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                  Professionelle KI-gestützte Kandidatenanalyse für anspruchsvolle Unternehmen. 
                  Präzise, schnell und vollständig anonymisiert.
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
                        <Zap className="h-6 w-6 text-gray-900" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Blitzschnell</h3>
                    </div>
                    <p className="text-gray-300 text-sm">Sofortige Analyse in unter 30 Sekunden</p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-gray-900" />
                      </div>
                      <h3 className="text-lg font-bold text-white">KI-Powered</h3>
                    </div>
                    <p className="text-gray-300 text-sm">Modernste Algorithmen für präzise Extraktion</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-8">
                  <Button 
                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white hover:bg-gray-100 text-gray-900 px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-500 group"
                  >
                    <Upload className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                    Jetzt CV hochladen
                    <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Section als dunkle Kacheln */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700/20 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{uploadedCount.toLocaleString()}+</h3>
                <p className="text-lg text-gray-200 font-medium">Hochgeladene CVs</p>
                <p className="text-sm text-gray-400">In dieser Session</p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700/20 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">&lt; 30s</h3>
                <p className="text-lg text-gray-200 font-medium">Analyse-Zeit</p>
                <p className="text-sm text-gray-400">Durchschnittliche Verarbeitung</p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700/20 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">100%</h3>
                <p className="text-lg text-gray-200 font-medium">Anonymisiert</p>
                <p className="text-sm text-gray-400">DSGVO-konforme Analyse</p>
              </div>
            </div>

            {/* Upload Section als dunkle Kachel */}
            <div id="upload-section" className="scroll-mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700/20 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white">CV Upload & Analyse</h2>
                    <p className="text-gray-300">Hochladen, analysieren und automatisch pseudonymisieren</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl border border-white/20">
                    <Brain className="h-5 w-5" />
                    <span className="font-medium">KI-gestützt</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 bg-white rounded-t-3xl">
                <FileUpload onUploadSuccess={handleUploadSuccess} />
              </div>
            </div>

            {/* Features Section als dunkle Kachel */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl border border-gray-700/20 overflow-hidden">
              <div className="p-8 border-b border-white/10">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse" />
                    <h2 className="text-4xl font-bold text-white">Warum Acme Inc?</h2>
                    <Sparkles className="h-8 w-8 text-yellow-400 animate-pulse delay-500" />
                  </div>
                  <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                    Professionelle KI-Technologie für höchste Ansprüche an Qualität und Datenschutz
                  </p>
                </div>
              </div>
              
              <div className="p-12 bg-white rounded-t-3xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center space-y-4 group">
                    <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Brain className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">KI-Powered</h3>
                    <p className="text-gray-700">Modernste Algorithmen für präzise Datenextraktion aus jedem CV-Format</p>
                  </div>

                  <div className="text-center space-y-4 group">
                    <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Zap className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Blitzschnell</h3>
                    <p className="text-gray-700">Vollständige Analyse in unter 30 Sekunden - von Upload bis strukturiertes Profil</p>
                  </div>

                  <div className="text-center space-y-4 group">
                    <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">DSGVO-konform</h3>
                    <p className="text-gray-700">Automatische Pseudonymisierung aller personenbezogenen Daten</p>
                  </div>

                  <div className="text-center space-y-4 group">
                    <div className="w-20 h-20 bg-gray-900 rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Sparkles className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Premium Insights</h3>
                    <p className="text-gray-700">Intelligente Kategorisierung und professionelle Kandidatenprofile</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action als dunkle Kachel */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 text-center shadow-2xl border border-gray-700/20">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl p-2">
                    <Image 
                      src="/logo-white.svg" 
                      alt="Acme Inc Logo" 
                      width={48} 
                      height={48} 
                      className="invert"
                    />
                  </div>
                  <h3 className="text-3xl font-bold text-white">Bereit für Acme Inc Qualität?</h3>
                </div>
                <p className="text-xl text-gray-200">
                  Erleben Sie professionelle Kandidatenanalyse auf höchstem Niveau. 
                  Vollständig anonymisiert und DSGVO-konform.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                  <Button 
                    onClick={() => router.push('/resumes')}
                    variant="outline"
                    className="px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Alle Kandidaten ansehen
                  </Button>
                  <Button 
                    onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    CV hochladen
                  </Button>
                </div>
                
                {/* Status Indicators */}
                <div className="flex items-center justify-center gap-8 text-gray-200 mt-8">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <span className="font-medium">System Online</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300" />
                    <span className="font-medium">KI Active</span>
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