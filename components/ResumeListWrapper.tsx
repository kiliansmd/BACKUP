'use client';

import { useState } from 'react';
import { ResumeList } from './ResumeList';

interface Filters {
  seniority?: string;
  location?: string;
  skills?: string;
}

export function ResumeListWrapper() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({});

  // Diese Komponente kann erweitert werden um globale Filter/Search-State zu verwalten
  // Momentan leitet sie nur an ResumeList weiter

  return (
    <ResumeList 
      searchQuery={searchQuery}
      filters={filters}
    />
  );
}