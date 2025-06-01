'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, MapPin, Star, User, Briefcase, Clock, Eye } from 'lucide-react';
import { generateAnonymousCandidateName } from '@/utils/anonymize-helpers';

interface Resume {
  id: string;
  name?: string;
  title?: string;
  fileName?: string;
  uploadedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  contact?: {
    location_city?: string;
    location_country?: string;
    email?: string;
  };
  derived?: {
    years_of_experience?: number;
  };
  skills?: string[];
  senioritaet?: string;
}

interface ResumeListProps {
  searchQuery?: string;
  filters?: {
    seniority?: string;
    location?: string;
    skills?: string;
  };
}

export function ResumeList({ searchQuery = '', filters = {} }: ResumeListProps) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // KRITISCHER FIX: Fehlender Data Fetching
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
        });

        if (searchQuery) params.append('search', searchQuery);
        if (filters.seniority) params.append('seniority', filters.seniority);
        if (filters.location) params.append('location', filters.location);
        if (filters.skills) params.append('skills', filters.skills);

        console.log('🔍 Fetching resumes with params:', params.toString());

        const response = await fetch(`/api/get-resumes?${params}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Resume data received:', data);

        if (data.success) {
          setResumes(data.data.resumes || []);
          setPagination(prev => ({
            ...prev,
            total: data.data.pagination?.total || 0,
            totalPages: data.data.pagination?.totalPages || 0
          }));
        } else {
          throw new Error(data.error || 'Failed to fetch resumes');
        }
      } catch (err) {
        console.error('❌ Error fetching resumes:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der CVs');
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [searchQuery, filters, pagination.page]);

  const formatDate = (uploadedAt?: { _seconds: number }) => {
    if (!uploadedAt) return 'Unbekannt';
    
    try {
      return new Date(uploadedAt._seconds * 1000).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unbekannt';
    }
  };

  const getSeniorityColor = (seniority?: string) => {
    switch (seniority?.toLowerCase()) {
      case 'senior': return 'bg-blue-100 text-blue-800';
      case 'mid': case 'mid-level': return 'bg-green-100 text-green-800';
      case 'junior': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Check for "NEW" badge (localStorage based)
  const isNewResume = (resumeId: string) => {
    if (typeof window === 'undefined') return false;
    const viewedResumes = JSON.parse(localStorage.getItem('viewedResumes') || '[]');
    return !viewedResumes.includes(resumeId);
  };

  const markAsViewed = (resumeId: string) => {
    if (typeof window === 'undefined') return;
    const viewedResumes = JSON.parse(localStorage.getItem('viewedResumes') || '[]');
    if (!viewedResumes.includes(resumeId)) {
      localStorage.setItem('viewedResumes', JSON.stringify([...viewedResumes, resumeId]));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-red-500 mb-2">❌ Fehler beim Laden</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Erneut versuchen
          </Button>
        </div>
      </Card>
    );
  }

  if (resumes.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Keine Kandidaten gefunden
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || Object.values(filters).some(v => v) 
              ? 'Versuchen Sie andere Suchkriterien.'
              : 'Laden Sie den ersten CV hoch, um zu beginnen.'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {pagination.total} Kandidat{pagination.total !== 1 ? 'en' : ''} gefunden
        </p>
      </div>

      {resumes.map((resume) => (
        <Card key={resume.id} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-lg">
                    {generateAnonymousCandidateName(resume.name)}
                  </CardTitle>
                  {isNewResume(resume.id) && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      NEU
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">
                  {resume.title || 'Position nicht angegeben'}
                </CardDescription>
              </div>
              
              {resume.senioritaet && (
                <Badge className={getSeniorityColor(resume.senioritaet)}>
                  {resume.senioritaet}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {resume.contact?.location_city && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{resume.contact.location_city}</span>
                </div>
              )}
              
              {resume.derived?.years_of_experience && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="h-4 w-4" />
                  <span>{resume.derived.years_of_experience}+ Jahre Erfahrung</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays className="h-4 w-4" />
                <span>Hochgeladen: {formatDate(resume.uploadedAt)}</span>
              </div>
            </div>

            {resume.skills && resume.skills.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {resume.skills.slice(0, 5).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {resume.skills.length > 5 && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      +{resume.skills.length - 5} weitere
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Datei: {resume.fileName || 'Unbekannt'}</span>
              </div>
              
              <Button 
                asChild
                variant="default"
                size="sm"
                onClick={() => markAsViewed(resume.id)}
              >
                <a href={`/candidate/${resume.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Profil ansehen
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={pagination.page <= 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Vorherige
          </Button>
          
          <span className="px-4 py-2 text-sm">
            Seite {pagination.page} von {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Nächste
          </Button>
        </div>
      )}
    </div>
  );
}