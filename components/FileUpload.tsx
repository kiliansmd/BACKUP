const uploadFile = async (file: File) => {
  setIsUploading(true);
  setErrorMessage(null);
  setSuccessMessage(null);
  
  const progressInterval = simulateProgress();

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/parse-resume', {  // Corrected URL
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
