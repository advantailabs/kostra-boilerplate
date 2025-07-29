'use client';

import React, { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/atom/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/common/Dialog';
import { useUploadFiles } from '@/hooks/useFiles';
import { fileUploadApi } from '@/services/api/file-upload';
import { useAuthStore } from '@/store/auth';

interface KnowledgeBaseFileUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
  knowledgeBaseId: number;
}

interface WarningState {
  show: boolean;
  title: string;
  message: string;
  type: 'error' | 'warning';
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error' | 'ready';
  error?: string;
  s3Key?: string;
}

export function KnowledgeBaseFileUploader({
  isOpen,
  onClose,
  onUploaded,
  knowledgeBaseId,
}: KnowledgeBaseFileUploaderProps) {
  const { user } = useAuthStore();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [warning, setWarning] = useState<WarningState>({
    show: false,
    title: '',
    message: '',
    type: 'warning',
  });
  const [filesBeingSaved, setFilesBeingSaved] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Use React Query hooks
  const uploadFilesMutation = useUploadFiles();

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      // Check for image files
      const imageMimeTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/svg+xml',
        'image/webp',
        'image/gif',
        'image/bmp',
        'image/tiff',
      ];

      const imageFiles = Array.from(files).filter(file =>
        imageMimeTypes.includes(file.type.toLowerCase())
      );

      if (imageFiles.length > 0) {
        const imageFileNames = imageFiles.map(f => f.name).join(', ');
        setWarning({
          show: true,
          title: 'Image Files Not Supported',
          message: `Image files (${imageFileNames}) cannot be uploaded to knowledge bases. Please choose different files.`,
          type: 'warning',
        });
        return;
      }

      const newFiles: UploadingFile[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'uploading' as const,
      }));

      setUploadingFiles(prev => [...prev, ...newFiles]);

      // Upload each file to S3 only
      newFiles.forEach(async uploadingFile => {
        try {
          // Get presigned URL using the existing fileUploadApi
          const { presignedUrl, key } = await fileUploadApi.getPresignedUrl({
            uploadPurpose: 'UserDocument',
            fileType: uploadingFile.file.type,
            objectName: 'user',
            objectId: user?.id?.toString() || 'new',
          });

          // Upload to S3 with progress tracking
          const xhr = new XMLHttpRequest();

          xhr.upload.addEventListener('progress', e => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100;
              setUploadingFiles(prev =>
                prev.map(f => (f.id === uploadingFile.id ? { ...f, progress } : f))
              );
            }
          });

          xhr.addEventListener('load', async () => {
            if (xhr.status === 200) {
              // Mark file as ready for database save
              setUploadingFiles(prev =>
                prev.map(f =>
                  f.id === uploadingFile.id
                    ? { ...f, status: 'ready' as const, progress: 100, s3Key: key }
                    : f
                )
              );
            } else {
              setUploadingFiles(prev =>
                prev.map(f =>
                  f.id === uploadingFile.id
                    ? { ...f, status: 'error' as const, error: 'Upload failed' }
                    : f
                )
              );
            }
          });

          xhr.addEventListener('error', () => {
            setUploadingFiles(prev =>
              prev.map(f =>
                f.id === uploadingFile.id
                  ? { ...f, status: 'error' as const, error: 'Upload failed' }
                  : f
              )
            );
          });

          xhr.open('PUT', presignedUrl);
          xhr.setRequestHeader('Content-Type', uploadingFile.file.type);
          xhr.send(uploadingFile.file);
        } catch (error) {
          setUploadingFiles(prev =>
            prev.map(f =>
              f.id === uploadingFile.id
                ? { ...f, status: 'error' as const, error: 'Failed to get upload URL' }
                : f
            )
          );
        }
      });
    },
    [user?.id]
  );

  const handleClose = useCallback(() => {
    setUploadingFiles([]);
    setFilesBeingSaved(0);
    setWarning({ show: false, title: '', message: '', type: 'warning' });
    onClose();
  }, [onClose]);

  const handleSaveToDatabase = async () => {
    const readyFiles = uploadingFiles.filter(f => f.status === 'ready');

    if (readyFiles.length === 0) {
      return;
    }

    // Set the number of files being saved
    setFilesBeingSaved(readyFiles.length);

    try {
      // Prepare files data for database save
      const filesData = readyFiles.map(file => ({
        filename: file.s3Key!,
        originalName: file.file.name,
        mimeType: file.file.type,
        size: file.file.size,
        s3Key: file.s3Key!,
      }));

      // Save all files to database with knowledge base association
      await uploadFilesMutation.mutateAsync({
        files: filesData,
        knowledgeBaseIds: [knowledgeBaseId],
      });

      // Mark files as successfully saved
      setUploadingFiles(prev =>
        prev.map(f => (f.status === 'ready' ? { ...f, status: 'success' as const } : f))
      );

      // Call the onUploaded callback and close the modal
      onUploaded();
      setFilesBeingSaved(0);
      handleClose();
    } catch (error: any) {
      console.error('Failed to save files to database:', error);

      // Check if this is an image file validation error
      if (error?.response?.data?.code === 'IMAGE_FILES_NOT_SUPPORTED') {
        const errorMessage = error.response.data.message;
        setWarning({
          show: true,
          title: 'Image Files Not Supported',
          message: errorMessage,
          type: 'error',
        });

        // Mark ready files as error with specific message
        setUploadingFiles(prev =>
          prev.map(f =>
            f.status === 'ready'
              ? {
                  ...f,
                  status: 'error' as const,
                  error: 'Image files not supported for knowledge bases',
                }
              : f
          )
        );
      } else {
        // Mark ready files as error with generic message
        setUploadingFiles(prev =>
          prev.map(f =>
            f.status === 'ready'
              ? { ...f, status: 'error' as const, error: 'Failed to save to database' }
              : f
          )
        );
      }

      // Reset files being saved count on error
      setFilesBeingSaved(0);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add('border-indigo-500', 'bg-indigo-50');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove('border-indigo-500', 'bg-indigo-50');
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  const readyFiles = uploadingFiles.filter(f => f.status === 'ready');
  const canSave =
    (readyFiles.length > 0 && !uploadFilesMutation.isPending) || uploadFilesMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload Files to Knowledge Base</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Drop Zone */}
          <div
            ref={dropZoneRef}
            className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors dark:border-gray-600"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="mt-4">
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Drop files here or browse
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Drag and drop files here, or{' '}
                <button
                  type="button"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Maximum file size: 100MB • Supported formats: PDF, Text, JSON, Markdown, and more
                <span className="mt-1 block text-orange-600 dark:text-orange-400">
                  Note: Image files cannot be uploaded to knowledge bases
                </span>
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={e => handleFileSelect(e.target.files)}
            />
          </div>

          {/* Upload Progress */}
          {uploadingFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Files ({uploadingFiles.filter(f => f.status === 'success').length}/
                  {uploadingFiles.length})
                </h4>
                {readyFiles.length > 0 && (
                  <div className="text-sm text-gray-500">{readyFiles.length} ready to save</div>
                )}
              </div>

              {/* Warning for image files */}
              {(() => {
                const imageMimeTypes = [
                  'image/jpeg',
                  'image/jpg',
                  'image/png',
                  'image/svg+xml',
                  'image/webp',
                  'image/gif',
                  'image/bmp',
                  'image/tiff',
                ];
                const imageFiles = uploadingFiles.filter(file =>
                  imageMimeTypes.includes(file.file.type.toLowerCase())
                );

                if (imageFiles.length > 0) {
                  return (
                    <div className="rounded-lg bg-orange-50 p-3 dark:bg-orange-900/20">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-orange-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                            Image files detected
                          </h3>
                          <div className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                            <p>
                              The following image files cannot be uploaded to knowledge bases:{' '}
                              {imageFiles.map(f => f.file.name).join(', ')}
                            </p>
                            <p className="mt-1">Please remove these files to proceed.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {uploadingFiles.map(uploadingFile => (
                <div
                  key={uploadingFile.id}
                  className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                >
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {uploadingFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(uploadingFile.file.size)}
                    </p>
                    {uploadingFile.status === 'uploading' && (
                      <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                          style={{ width: `${uploadingFile.progress}%` }}
                        />
                      </div>
                    )}
                    {uploadingFile.error && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {uploadingFile.error}
                      </p>
                    )}
                    {uploadingFile.status === 'ready' && (
                      <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                        Ready to save
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {uploadingFile.status === 'uploading' && (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    )}
                    {uploadingFile.status === 'ready' && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {uploadingFile.status === 'success' && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                    {uploadingFile.status === 'error' && (
                      <div className="h-5 w-5 rounded-full bg-red-500" />
                    )}
                    <Button
                      onClick={() =>
                        setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id))
                      }
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Separator */}
          <div className="-mx-6 mt-6 border-t border-gray-200 dark:border-gray-700" />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={handleClose} className="px-4">
              Cancel
            </Button>
            {canSave && (
              <Button
                onClick={handleSaveToDatabase}
                disabled={uploadFilesMutation.isPending}
                className="flex items-center gap-2 px-4"
              >
                {uploadFilesMutation.isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <span>
                      Save {uploadFilesMutation.isPending ? filesBeingSaved : readyFiles.length}{' '}
                      File
                      {(uploadFilesMutation.isPending ? filesBeingSaved : readyFiles.length) !== 1
                        ? 's'
                        : ''}
                    </span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Warning Modal */}
      {warning.show && (
        <Dialog
          open={warning.show}
          onOpenChange={() => setWarning({ show: false, title: '', message: '', type: 'warning' })}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle
                className={`text-lg ${warning.type === 'error' ? 'text-red-600' : 'text-orange-600'}`}
              >
                {warning.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">{warning.message}</p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setWarning({ show: false, title: '', message: '', type: 'warning' })}
                className="px-4"
              >
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}
