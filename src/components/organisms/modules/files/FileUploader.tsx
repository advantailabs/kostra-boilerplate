'use client';

import { RiCheckLine, RiCloseLine, RiFileLine, RiSaveLine, RiUploadLine } from '@remixicon/react';
import React, { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Modal } from '@/components/molecules/common/Modal';
import { useUploadFiles } from '@/hooks/useFiles';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { formatFileSize } from '@/lib/file-utils';
import { uploadFileViaPresignedUrl } from '@/lib/presigned-upload';
import { useAuthStore } from '@/store/auth';

interface FileUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
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

export function FileUploader({ isOpen, onClose, onUploaded }: FileUploaderProps) {
  const { user } = useAuthStore();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<number[]>([]);
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
  const { data: knowledgeBasesData, isLoading: loadingKnowledgeBases } = useKnowledgeBases();
  const uploadFilesMutation = useUploadFiles();

  const knowledgeBases = knowledgeBasesData?.knowledgeBases || [];

  const toggleKnowledgeBase = (knowledgeBaseId: number) => {
    const isAdding = !selectedKnowledgeBases.includes(knowledgeBaseId);

    if (isAdding) {
      // Check if there are any image files in the upload queue
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
        const imageFileNames = imageFiles.map(f => f.file.name).join(', ');
        setWarning({
          show: true,
          title: 'Image Files Not Supported',
          message: `Image files (${imageFileNames}) cannot be uploaded to knowledge bases. Please remove these files first.`,
          type: 'warning',
        });
        return;
      }
    }

    setSelectedKnowledgeBases(prev =>
      prev.includes(knowledgeBaseId)
        ? prev.filter(id => id !== knowledgeBaseId)
        : [...prev, knowledgeBaseId]
    );
  };

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      // Check for image files if knowledge bases are selected
      if (selectedKnowledgeBases.length > 0) {
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
            message: `Image files (${imageFileNames}) cannot be uploaded to knowledge bases. Please deselect knowledge bases or choose different files.`,
            type: 'warning',
          });
          return;
        }
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
          const { key } = await uploadFileViaPresignedUrl({
            file: uploadingFile.file,
            uploadPurpose: 'UserDocument',
            objectName: 'user',
            objectId: user?.id?.toString() || 'new',
            onProgress: progress =>
              setUploadingFiles(prev =>
                prev.map(f => (f.id === uploadingFile.id ? { ...f, progress } : f))
              ),
          });

          // Mark file as ready for database save
          setUploadingFiles(prev =>
            prev.map(f =>
              f.id === uploadingFile.id
                ? { ...f, status: 'ready' as const, progress: 100, s3Key: key }
                : f
            )
          );
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
    [user?.id, selectedKnowledgeBases.length]
  );

  const handleClose = useCallback(() => {
    setUploadingFiles([]);
    setSelectedKnowledgeBases([]);
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
        uploadPurpose: 'UserDocument' as const,
      }));

      // Save all files to database with knowledge base associations using React Query
      await uploadFilesMutation.mutateAsync({
        files: filesData,
        knowledgeBaseIds: selectedKnowledgeBases.length > 0 ? selectedKnowledgeBases : undefined,
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

  const readyFiles = uploadingFiles.filter(f => f.status === 'ready');
  const canSave =
    (readyFiles.length > 0 && !uploadFilesMutation.isPending) || uploadFilesMutation.isPending;

  // Custom footer with cancel and save buttons
  const actionFooter = (
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
              <RiSaveLine className="h-4 w-4" />
              <span>
                Save {uploadFilesMutation.isPending ? filesBeingSaved : readyFiles.length} File
                {(uploadFilesMutation.isPending ? filesBeingSaved : readyFiles.length) !== 1
                  ? 's'
                  : ''}
              </span>
            </>
          )}
        </Button>
      )}
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Upload Files"
        description="Upload files to your knowledge bases"
        maxWidth="max-w-2xl"
        contentClassName="max-h-[90vh] overflow-y-auto"
        footer={actionFooter}
      >
        <div className="space-y-6">
          {/* Knowledge Base Selection */}
          <div>
            {(() => {
              if (loadingKnowledgeBases) {
                return (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                    <span>Loading knowledge bases...</span>
                  </div>
                );
              }

              if (knowledgeBases.length > 0) {
                return (
                  <div
                    id="knowledge-bases"
                    className="grid grid-cols-2 gap-3"
                    aria-label="Knowledge base selection"
                  >
                    {knowledgeBases.map(kb => (
                      <div
                        key={kb.id}
                        className={`relative cursor-pointer rounded-lg border p-3 transition-colors ${
                          selectedKnowledgeBases.includes(kb.id)
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                        }`}
                        onClick={() => toggleKnowledgeBase(kb.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleKnowledgeBase(kb.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              {kb.title}
                            </p>
                            {kb.description && (
                              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                                {kb.description}
                              </p>
                            )}
                          </div>
                          {selectedKnowledgeBases.includes(kb.id) && (
                            <div className="ml-2 flex-shrink-0">
                              <RiCheckLine className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No knowledge bases available. Create one first to organize your files.
                </p>
              );
            })()}
          </div>

          {/* Drop Zone */}
          <div
            ref={dropZoneRef}
            className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors dark:border-gray-600"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <RiUploadLine className="mx-auto h-16 w-16 text-gray-400" />
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
                {selectedKnowledgeBases.length > 0 && (
                  <span className="mt-1 block text-orange-600 dark:text-orange-400">
                    Note: Image files cannot be uploaded to knowledge bases
                  </span>
                )}
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

              {/* Warning for image files in knowledge bases */}
              {selectedKnowledgeBases.length > 0 &&
                (() => {
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
                              <p className="mt-1">
                                Please remove these files or deselect knowledge bases to proceed.
                              </p>
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
                  <RiFileLine className="h-5 w-5 flex-shrink-0 text-gray-400" />
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
                        <RiCheckLine className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {uploadingFile.status === 'success' && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                        <RiCheckLine className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {uploadingFile.status === 'error' && (
                      <div className="h-5 w-5 rounded-full bg-red-500" />
                    )}
                    <button
                      onClick={() =>
                        setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id))
                      }
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <RiCloseLine className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Warning Modal - Replace with our new Modal component */}
      {warning.show && (
        <Modal
          isOpen={warning.show}
          onClose={() => setWarning({ show: false, title: '', message: '', type: 'warning' })}
          title={warning.title}
          primaryActionText="OK"
          onPrimaryAction={() =>
            setWarning({ show: false, title: '', message: '', type: 'warning' })
          }
          maxWidth="max-w-md"
        >
          <div
            className={`-mt-2 mb-2 text-sm font-medium ${warning.type === 'error' ? 'text-red-600' : 'text-orange-600'}`}
          >
            {warning.type === 'error' ? 'Error:' : 'Warning:'}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{warning.message}</p>
        </Modal>
      )}
    </>
  );
}
