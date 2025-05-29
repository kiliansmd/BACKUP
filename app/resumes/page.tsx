'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';

const ResumesPageSkeleton = () => (
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

const ResumeList = dynamic(() => import('@/components/ResumeList').then(mod => ({ default: mod.ResumeList })), {
  loading: () => <ResumesPageSkeleton />,
  ssr: false
});

export default function ResumesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Uploaded Resumes
              </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
              <ResumeList />
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 