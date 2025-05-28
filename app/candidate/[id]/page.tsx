'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { KandidatenProfile } from '@/components/kandidaten-profile';
import { useParams } from 'next/navigation';
import type { Kandidat, AccountManager, NavigationItem } from '@/types/kandidat';

interface ParsedResume {
  name?: string;
  title?: string;
  brief?: string;
  contact?: {
    location_city?: string;
    location_country?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string | null;
    twitter?: string | null;
    website?: string | null;
  };
  employment_history?: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    graduationDate?: string;
    url?: string | null;
    area?: string;
    studyType?: string;
    note?: string;
  }>;
  skills?: string[]; // Könnte ein Array von Strings sein
  languages?: Array<{
    language?: string;
    fluency?: string;
  }> | string[]; // Kann ein Array von Objekten oder Strings sein
  derived?: {
    years_of_experience?: number;
    approximate_age?: number;
  };
  fileName?: string;
  uploadedAt?: {
    _seconds?: number;
    _nanoseconds?: number;
  };
  // Annahme weiterer möglicher Felder basierend auf der vorherigen Code-Analyse und den Mapping-Versuchen
  highlights?: any[];
  certificates?: Array<{
    name?: string;
    description?: string;
    date?: string;
    issuer?: string;
  }>; // Spezifischerer Typ angenommen basierend auf der Nutzung
  publications?: any[];
  interests?: any[];
  references?: any[];
  gehalt?: string; // Annahme, dass Gehalt vom Parser kommt
  verfuegbarkeit?: string; // Annahme, dass Verfügbarkeit vom Parser kommt
  lebenslauf?: string; // Annahme, dass lebenslauf vom Parser kommt (z.B. als reiner Text)
  einschaetzung?: string; // Annahme, dass Einschätzung vom Parser kommt
  jobrollen?: string[]; // Annahme, dass jobrollen vom Parser kommen könnten
  persoenlicheDaten?: {
    geburtsdatum?: string;
    geburtsort?: string;
    wohnort?: string;
    familienstand?: string;
  };
  location?: {
    address?: string;
    postalCode?: string;
    city?: string;
    countryCode?: string;
    region?: string;
  };
}

export default function CandidateDetailsPage() {
  const { id } = useParams();
  const [resumeData, setResumeData] = useState<ParsedResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const response = await fetch(`/api/resume/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }
        const data = await response.json();
        setResumeData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch resume data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResumeData();
    }
  }, [id]);

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    if (dateStr === 'Present') return 'Heute';
    try {
      // Try parsing different date formats
      let date;
      if (dateStr.includes('-')) {
        // Handle YYYY-MM-DD format
        date = new Date(dateStr);
      } else if (dateStr.match(/^\d{4}$/)) {
        // Handle year only format
        date = new Date(parseInt(dateStr), 0, 1);
      } else {
        // Try parsing as is
        date = new Date(dateStr);
      }
      
      if (isNaN(date.getTime())) return dateStr;
      return new Intl.DateTimeFormat('de-DE', { 
        year: 'numeric', 
        month: 'long'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const mapResumeToKandidat = (resume: ParsedResume): Kandidat => {
    // Stellen Sie sicher, dass resume vorhanden ist
    if (!resume) {
      // Rückgabe eines leeren Kandidat-Objekts mit Default-Werten
      return {
        name: '',
        position: '',
        gehalt: 'Auf Anfrage',
        standort: '',
        verfuegbarkeit: 'Sofort',
        erfahrung: '0 Jahre',
        location: { address: '', postalCode: '', city: '', countryCode: '', region: '' },
        kurzprofil: '',
        lebenslauf: '',
        einschaetzung: '',
        senioritaet: 'Mid-Level',
        jobrollen: [],
        kernthemen: [],
        persoenlicheDaten: { geburtsdatum: '', geburtsort: '', wohnort: '', familienstand: '' },
        softwareKenntnisse: [],
        sprachkenntnisse: [],
        highlights: [],
        topSkills: [],
        work: [],
        education: [],
        certificates: [],
        languages: [],
        publications: [],
        interests: [],
        references: [],
      } as Kandidat; 
    }

    // Sicherer Zugriff auf verschachtelte Objekte und Arrays mit Fallbacks
    const contact = resume.contact || {};
    const derived = resume.derived || {};
    const personalData = resume.persoenlicheDaten || {};
    const skills = Array.isArray(resume.skills) ? resume.skills : [];
    const languages = Array.isArray(resume.languages) ? resume.languages : [];
    const employmentHistory = Array.isArray(resume.employment_history) ? resume.employment_history : [];
    const education = Array.isArray(resume.education) ? resume.education : [];
    const certificates = Array.isArray(resume.certificates) ? resume.certificates : [];
    const highlights = Array.isArray(resume.highlights) ? resume.highlights : [];
    const publications = Array.isArray(resume.publications) ? resume.publications : [];
    const interests = Array.isArray(resume.interests) ? resume.interests : [];
    const references = Array.isArray(resume.references) ? resume.references : [];
    const jobrollen = Array.isArray(resume.jobrollen) ? resume.jobrollen : (resume.title ? [resume.title] : []); // jobrollen könnte Array sein oder aus title abgeleitet


    return {
      name: resume.name || '',
      position: resume.title || '',
      gehalt: resume.gehalt || 'Auf Anfrage', // Gehalt aus Daten lesen oder Default
      standort: `${contact.location_city || ''}, ${contact.location_country || ''}`,
      verfuegbarkeit: resume.verfuegbarkeit || 'Sofort', // Verfügbarkeit aus Daten lesen oder Default
      erfahrung: `${derived.years_of_experience ?? 0} Jahre`,
      location: {
        address: resume.location?.address || 'wewewewewe', // Behält den aktuellen Defaultwert
        postalCode: resume.location?.postalCode || '',
        city: contact.location_city || '',
        countryCode: contact.location_country || '',
        region: resume.location?.region || '',
      },
      kurzprofil: resume.brief || '',
      lebenslauf: resume.lebenslauf || '', // Annahme: lebenslauf könnte im ParsedResume sein
      einschaetzung: resume.einschaetzung || resume.brief || '', // Annahme: einschätzung könnte existieren
      senioritaet: (derived.years_of_experience ?? 0) > 5 ? 'Senior' : 'Mid-Level',
      jobrollen: jobrollen.filter(Boolean),
      kernthemen: skills,
      persoenlicheDaten: {
        geburtsdatum: personalData.geburtsdatum || '',
        geburtsort: personalData.geburtsort || '',
        wohnort: personalData.wohnort || contact.location_city || '', // Wohnort aus personalData oder contact
        familienstand: personalData.familienstand || '',
      },
      softwareKenntnisse: skills.map((skill: any) => ({
        name: (typeof skill === 'string' ? skill : skill?.name) || '',
        level: (typeof skill === 'object' ? skill?.level : undefined) ?? 80 // Level aus Daten lesen oder Default 80
      })),
      sprachkenntnisse: languages.map((lang: any) => ({
        // Annahme: language kann String oder Objekt {language, fluency, level} sein
        sprache: (typeof lang === 'string' ? lang : lang?.language) || '',
        niveau: (typeof lang === 'object' ? lang?.fluency : 'Fließend') || 'Fließend', // Default value
        level: (typeof lang === 'object' ? lang?.level : undefined) ?? 80 // Level aus Daten lesen oder Default 80
      })),
      highlights: highlights.map((highlight: any) => ({ // Mapping annehmen, falls highlights Objekte sind
         icon: highlight?.icon || '',
         title: highlight?.title || '',
         description: highlight?.description || '',
         metric: highlight?.metric || '',
         label: highlight?.label || '',
      })),
      topSkills: skills.slice(0, 3).map((skill: any) => ({
        title: (typeof skill === 'string' ? skill : skill?.title) || (typeof skill === 'object' ? skill?.name : '') || '', // title oder name verwenden
        description: (typeof skill === 'object' ? skill?.description : '') || '',
        keywords: (typeof skill === 'object' && Array.isArray(skill?.keywords)) ? skill.keywords : [],
      })),
      work: employmentHistory.map((job: any) => ({
        name: job?.company || '',
        position: job?.position || '',
        startDate: formatDate(job?.startDate) || '',
        endDate: job?.endDate === 'Present' ? 'Heute' : formatDate(job?.endDate) || '',
        summary: (Array.isArray(job?.description) ? job.description.join('\n') : job?.description) || '',
        achievements: (Array.isArray(job?.achievements) ? job.achievements : (Array.isArray(job?.description) ? job.description : [])) || [], // achievements oder description verwenden, sicherstellen, dass es ein Array ist
      })).filter(job => job.name || job.position || job.summary || (job.achievements && job.achievements.length > 0)), // Leere Einträge filtern
      education: education.map((edu: any) => ({
        institution: edu?.institution || '',
        url: edu?.url || '',
        area: edu?.area || edu?.degree || '', // area oder degree verwenden, falls vorhanden
        studyType: edu?.studyType || edu?.degree || '', // studyType oder degree verwenden
        startDate: formatDate(edu?.startDate) || formatDate(edu?.graduationDate) || '', // startDate oder graduationDate verwenden
        endDate: formatDate(edu?.endDate) || formatDate(edu?.graduationDate) || '', // endDate oder graduationDate verwenden
        note: edu?.note || ''
      })).filter(edu => edu.institution || edu.area || edu.studyType), // Leere Einträge filtern
      certificates: certificates.map((cert: any) => ({ // Mapping annehmen
         name: cert?.name || '',
         description: cert?.description || '', // Annahme: description Feld existiert
         date: cert?.date || '',
         issuer: cert?.issuer || '',
      })).filter(cert => cert.name), // Leere Einträge filtern
      languages: languages.map((lang: any) => ({
         language: (typeof lang === 'string' ? lang : lang?.language) || '',
         fluency: (typeof lang === 'object' ? lang?.fluency : 'Fließend') || 'Fließend'
      })).filter(lang => lang.language), // Leere Einträge filtern
      publications: publications.map((pub: any) => ({ // Mapping annehmen
        title: pub?.title || '',
        publisher: pub?.publisher || '',
        releaseDate: pub?.releaseDate || '',
        url: pub?.url || '',
      })).filter(pub => pub.title), // Leere Einträge filtern
       interests: interests.map((interest: any) => ({ name: interest?.name || ''})).filter(interest => interest.name), // Mapping annehmen
       references: references.map((reference: any) => ({ name: reference?.name || '', reference: reference?.reference || ''})).filter(ref => ref.name || ref.reference), // Mapping annehmen
    };
  };

  const mockAccountManager: AccountManager = {
    name: 'John Doe',
    position: 'Account Manager',
    email: 'john.doe@example.com',
    phone: '+49 123 456789'
  };

  const generateNavSections = (resume: ParsedResume): NavigationItem[] => {
    const sections: NavigationItem[] = [
      { id: 'profile', label: 'Profil' }
    ];

    // Überprüfen, ob employment_history ein nicht-leeres Array ist
    if (Array.isArray(resume.employment_history) && resume.employment_history.length > 0) {
      sections.push({ id: 'experience', label: 'Berufserfahrung' }); // Label angepasst basierend auf der Sektion
    }
    // Überprüfen, ob education ein nicht-leeres Array ist
    if (Array.isArray(resume.education) && resume.education.length > 0) {
      sections.push({ id: 'education', label: 'Ausbildung' });
    }
    // Überprüfen, ob skills ein nicht-leeres Array von Strings ist
    if (Array.isArray(resume.skills) && resume.skills.length > 0) {
      sections.push({ id: 'skills', label: 'Fähigkeiten' });
    }
    // Überprüfen, ob languages ein nicht-leeres Array ist (kann Strings oder Objekte enthalten)
    if (Array.isArray(resume.languages) && resume.languages.length > 0) {
      sections.push({ id: 'languages', label: 'Sprachen' });
    }
     if (Array.isArray(resume.highlights) && resume.highlights.length > 0) {
       sections.push({ id: 'highlights', label: 'Highlights' }); // Annahme: Highlights Sektion existiert
     }
      if (Array.isArray(resume.certificates) && resume.certificates.length > 0) {
       sections.push({ id: 'certificates', label: 'Zertifizierungen' }); // Annahme: Zertifizierungen Sektion existiert
     }
       if (Array.isArray(resume.publications) && resume.publications.length > 0) {
       sections.push({ id: 'publications', label: 'Publikationen' }); // Annahme: Publikationen Sektion existiert
     }
       if (Array.isArray(resume.interests) && resume.interests.length > 0) {
       sections.push({ id: 'interests', label: 'Interessen' }); // Annahme: Interessen Sektion existiert
     }
        if (Array.isArray(resume.references) && resume.references.length > 0) {
       sections.push({ id: 'references', label: 'Referenzen' }); // Annahme: Referenzen Sektion existiert
     }

    return sections.filter(section => document.getElementById(section.id)); // Filtern, falls Sektionen-IDs nicht im HTML existieren
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 min-h-[400px] flex items-center justify-center">
          {error}
        </div>
      ) : resumeData ? (
        <div className="bg-white">
          <KandidatenProfile
            kandidat={mapResumeToKandidat(resumeData)}
            accountManager={mockAccountManager}
            navSections={generateNavSections(resumeData)}
          />
        </div>
      ) : null}
    </main>
  );
} 