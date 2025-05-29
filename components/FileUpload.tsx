'use client';

import { useCallback, useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles, Cloud, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface UploadResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    fileName: string;
  };
  error?: string;
}

interface FileUploadProps {
  onUploadSuccess?: (data: any) => void;
}

export const FileUpload = ({ onUploadSuccess }: FileUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return 'Nur PDF- und Word-Dokumente sind erlaubt.';
    }

    if (file.size > maxSize) {
      return 'Die Datei ist zu groß. Maximum: 10MB.';
    }

    return null;
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result: UploadResponse = await response.json();

      if (result.success && result.data) {
        setSuccessMessage(`"${result.data.name || result.data.fileName}" wurde erfolgreich hochgeladen!`);
        setUploadedFiles(prev => [...prev, result.data]);
        onUploadSuccess?.(result.data);
        
        // Auto redirect after 2 seconds
        setTimeout(() => {
          router.push(`/candidate/${result.data!.id}`);
        }, 2000);
      } else {
        throw new Error(result.error || 'Upload fehlgeschlagen');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setErrorMessage(error instanceof Error ? error.message : 'Upload fehlgeschlagen');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    const validationError = validateFile(file);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    await uploadFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const clearMessage = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  return (
    <div className="space-y-8">
      {/* Upload Area */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          accept=".pdf,.doc,.docx"
          className="hidden"
          aria-label="CV-Datei hochladen"
          title="Wählen Sie eine CV-Datei zum Hochladen"
        />
        
        <div
          className={`
            relative w-full max-w-3xl mx-auto p-12 rounded-3xl border-2 border-dashed
            transition-all duration-500 cursor-pointer group overflow-hidden
            ${
              isDragActive
                ? 'border-blue bg-gradient-to-br from-blue/10 to-achieve-ka/10 scale-[1.02] shadow-2xl'
                : isUploading
                ? 'border-yellow bg-gradient-to-br from-yellow/10 to-orange/10'
                : 'border-gray-200 hover:border-blue/50 bg-gradient-to-br from-white to-blue/5 hover:shadow-xl'
            }
          `}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue/20 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-achieve-ka/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
            {/* Icon */}
            <div className="relative">
              <div className={`
                w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500
                ${
                  isDragActive
                    ? 'bg-gradient-to-br from-blue to-achieve-ka scale-110 shadow-2xl'
                    : isUploading
                    ? 'bg-gradient-to-br from-yellow to-orange animate-pulse'
                    : 'bg-gradient-to-br from-blue/10 to-achieve-ka/10 group-hover:scale-110 group-hover:shadow-xl'
                }
              `}>
                {isUploading ? (
                  <Cloud className="w-12 h-12 text-white animate-bounce" />
                ) : isDragActive ? (
                  <Zap className="w-12 h-12 text-white" />
                ) : (
                  <Upload className="w-12 h-12 text-blue group-hover:text-achieve-ka transition-colors duration-500" />
                )}
              </div>
              
              {isDragActive && (
                <div className="absolute -inset-4 border-2 border-blue rounded-full animate-ping" />
              )}
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <h3 className={`
                text-3xl font-bold transition-all duration-500
                ${
                  isDragActive
                    ? 'text-blue scale-105'
                    : isUploading
                    ? 'text-yellow'
                    : 'text-gray-950 group-hover:text-blue'
                }
              `}>
                {isUploading
                  ? 'Wird hochgeladen...'
                  : isDragActive
                  ? 'Datei hier ablegen!'
                  : 'CV hochladen'
                }
              </h3>
              
              <p className={`
                text-lg transition-all duration-500
                ${
                  isDragActive
                    ? 'text-blue/80'
                    : isUploading
                    ? 'text-yellow/80'
                    : 'text-gray-950'
                }
              `}>
                {isUploading
                  ? 'Ihre Datei wird verarbeitet...'
                  : isDragActive
                  ? 'Lassen Sie die Datei los, um sie hochzuladen'
                  : 'Ziehen Sie eine Datei hierher oder klicken Sie zum Auswählen'
                }
              </p>

              {!isUploading && !isDragActive && (
                <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-950">
                  <span className="flex items-center gap-1 bg-white/80 px-3 py-2 rounded-xl border border-gray-200">
                    <FileText className="h-4 w-4" />
                    PDF
                  </span>
                  <span className="flex items-center gap-1 bg-white/80 px-3 py-2 rounded-xl border border-gray-200">
                    <FileText className="h-4 w-4" />
                    DOC
                  </span>
                  <span className="flex items-center gap-1 bg-white/80 px-3 py-2 rounded-xl border border-gray-200">
                    <FileText className="h-4 w-4" />
                    DOCX
                  </span>
                  <span className="bg-blue/10 text-blue px-3 py-2 rounded-xl border border-blue/20 font-medium">
                    Max. 10 MB
                  </span>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="w-full max-w-md space-y-3">
                <Progress 
                  value={uploadProgress} 
                  className="h-3 bg-gray-200"
                />
                <p className="text-sm text-gray-950 flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  {Math.round(uploadProgress)}% abgeschlossen
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {(errorMessage || successMessage) && (
        <div className={`
          max-w-2xl mx-auto p-6 rounded-2xl border-2 shadow-lg transition-all duration-500
          ${
            errorMessage
              ? 'bg-gradient-to-r from-red/5 to-orange/5 border-red/20'
              : 'bg-gradient-to-r from-green/5 to-mint-100 border-green/20'
          }
        `}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`
                w-12 h-12 rounded-2xl flex items-center justify-center
                ${errorMessage ? 'bg-red/10' : 'bg-green/10'}
              `}>
                {errorMessage ? (
                  <AlertCircle className="h-6 w-6 text-red" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green" />
                )}
              </div>
              <div className="space-y-2">
                <h4 className={`text-lg font-bold ${errorMessage ? 'text-red' : 'text-green'}`}>
                  {errorMessage ? 'Fehler beim Upload' : 'Upload erfolgreich!'}
                </h4>
                <p className={`${errorMessage ? 'text-red/80' : 'text-green/80'}`}>
                  {errorMessage || successMessage}
                </p>
                {successMessage && (
                  <p className="text-sm text-gray-950 flex items-center gap-2 mt-3">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Sie werden automatisch zum Kandidatenprofil weitergeleitet...
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessage}
              className="text-gray-500 hover:text-gray-950"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Recently Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-gray-950 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green" />
            Erfolgreich hochgeladen
          </h3>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/candidate/${file.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green/10 rounded-xl flex items-center justify-center">
                    <FileText className="h-6 w-6 text-green" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-950">{file.name || file.fileName}</h4>
                    <p className="text-sm text-gray-950">Klicken Sie hier, um das Profil anzuzeigen</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    Ansehen →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-achieve-ka/5 to-blue/5 rounded-3xl p-8 border border-achieve-ka/10">
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-gray-950">Wie funktioniert's?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-blue/10 rounded-2xl flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-blue" />
              </div>
              <h4 className="font-semibold text-gray-950">1. Hochladen</h4>
              <p className="text-sm text-gray-950">Laden Sie den Lebenslauf als PDF oder Word-Dokument hoch</p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 bg-yellow/10 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-yellow" />
              </div>
              <h4 className="font-semibold text-gray-950">2. KI-Analyse</h4>
              <p className="text-sm text-gray-950">Unsere KI extrahiert automatisch alle relevanten Informationen</p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 bg-green/10 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green" />
              </div>
              <h4 className="font-semibold text-gray-950">3. Profil ansehen</h4>
              <p className="text-sm text-gray-950">Betrachten Sie das strukturierte Kandidatenprofil</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 