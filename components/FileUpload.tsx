import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess?: (data: any) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const simulateProgress = () => {
    return setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 500);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Upload failed: ${response.status}`);
      }

      if (result.success && result.data) {
        setSuccessMessage(`"${result.data.name || result.data.fileName}" wurde erfolgreich hochgeladen!`);
        setUploadedFiles(prev => [...prev, result.data]);
        onUploadSuccess?.(result.data);
        
        // Auto redirect after 2 seconds
        setTimeout(() => {
          router.push(`/candidate/${result.data.id}`);
        }, 2000);
      } else {
        throw new Error('Upload fehlgeschlagen');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setErrorMessage(error instanceof Error ? error.message : 'Upload fehlgeschlagen');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Datei hier ablegen...'
            : 'Datei hierher ziehen oder klicken zum Auswählen'}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          disabled={isUploading}
        >
          Datei auswählen
        </Button>
      </div>

      {isUploading && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
        </div>
      )}

      {errorMessage && (
        <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="mt-4 text-sm text-green-600">{successMessage}</p>
      )}
    </div>
  );
};