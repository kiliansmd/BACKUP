'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/png': ['.png']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full max-w-2xl p-8 rounded-lg border-2 border-dashed
        transition-all duration-200 cursor-pointer
        ${
          isDragActive
            ? 'border-blue bg-blue-50'
            : 'border-gray-200 hover:border-gray-200 bg-white'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-4 rounded-full bg-gray-50">
          <Upload className="w-8 h-8 text-gray-950" />
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-950">
            Drop your CV here, or <span className="text-blue">browse</span>
          </p>
          <p className="mt-2 text-sm text-gray-950">
            Supports PDF, DOC, and DOCX files
          </p>
        </div>
      </div>
    </div>
  );
}; 