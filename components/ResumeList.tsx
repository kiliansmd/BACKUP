// components/ResumeList.tsx - Optimierte Version mit Pagination
'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileText, Calendar, MapPin, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { appConfig } from '@/config/app.config';

interface Resume {
  id: string;
  name?: string;
  title?: string;
  fileName: string;
  uploadedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  contact?: {
    location_city?: string;
    location_country?: string;
  };
  derived?: {
    years_of_experience?: number;
  };
  skills?: string[];
  senioritaet?: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const ResumeList = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams(searchParams);
      const response = await fetch(`/api/get-resumes?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch resumes');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setResumes(result.data.resumes || []);
        setPagination(result.data.pagination || null);
      } else {
        setResumes(result || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleResumeClick = (id: string) => {
    router.push(`/candidate/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/resumes?${params.toString()}`);
  };

  const formatDate = (uploadedAt: { _seconds: number }) => {
    return new Date(uploadedAt._seconds * 1000).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeniorityColor = (seniority?: string) => {
    switch (seniority?.toLowerCase()) {
      case 'senior':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'mid':
      case 'mid-level':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'junior':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && resumes.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div>
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-lg font-semibold mb-2">Fehler beim Laden der Kandidaten</p>
        <p className="text-sm mb-4">{error}</p>
        <Button onClick={fetchResumes} variant="outline">
          Erneut versuchen
        </Button>
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <div className="text-center text-gray-500 min-h-[400px] flex flex-col items-center justify-center">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-lg font-semibold mb-2">Keine Kandidaten gefunden</p>
        <p className="text-sm mb-4">
          {searchParams.toString() 
            ? 'Versuchen Sie es mit anderen Filterkriterien.'
            : 'Laden Sie den ersten Lebenslauf hoch, um zu beginnen.'}
        </p>
        {searchParams.toString() && (
          <Button 
            onClick={() => router.push('/resumes')} 
            variant="outline"
          >
            Filter zurücksetzen
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            onClick={() => handleResumeClick(resume.id)}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {resume.name || resume.fileName}
                    </h3>
                    {resume.senioritaet && (
                      <Badge className={getSeniorityColor(resume.senioritaet)}>
                        {resume.senioritaet}
                      </Badge>
                    )}
                  </div>
                  
                  {resume.title && (
                    <p className="text-gray-700 font-medium mb-2">{resume.title}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(resume.uploadedAt)}</span>
                    </div>
                    
                    {(resume.contact?.location_city || resume.contact?.location_country) && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {[resume.contact.location_city, resume.contact.location_country]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {resume.derived?.years_of_experience !== undefined && (
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{resume.derived.years_of_experience} Jahre Erfahrung</span>
                      </div>
                    )}
                  </div>
                  
                  {resume.skills && resume.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {resume.skills.slice(0, 5).map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="outline"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {resume.skills.length > 5 && (
                        <Badge 
                          variant="outline"
                          className="text-xs bg-gray-50"
                        >
                          +{resume.skills.length - 5} weitere
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Ansehen →
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Zeige {((pagination.page - 1) * pagination.limit) + 1} bis{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} von{' '}
            {pagination.total} Kandidaten
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Zurück
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Weiter
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};