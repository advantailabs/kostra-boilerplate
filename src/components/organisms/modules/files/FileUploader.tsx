'use client';

import { RiCheckLine, RiCloseLine, RiFileLine, RiSaveLine, RiUploadLine } from '@remixicon/react';
import React, { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/atom/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/common/Dialog';
import { useUploadFiles } from '@/hooks/useFiles';
import { useKnowledgeBases } from '@/hooks/useKnowledgeBases';
import { fileUploadApi } from '@/services/api/file-upload';
import { useAuthStore } from '@/store/auth';

interface FileUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Use React Query hooks
  const { data: knowledgeBasesData, isLoading: loadingKnowledgeBases } = useKnowledgeBases();
  const uploadFilesMutation = useUploadFiles();

  const knowledgeBases = knowledgeBasesData?.knowledgeBases || [];

  const toggleKnowledgeBase = (knowledgeBaseId: number) => {
    setSelectedKnowledgeBases(prev =>
      prev.includes(knowledgeBaseId)
        ? prev.filter(id => id !== knowledgeBaseId)
        : [...prev, knowledgeBaseId]
    );
  };

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;

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

  const handleSaveToDatabase = async () => {
    const readyFiles = uploadingFiles.filter(f => f.status === 'ready');

    if (readyFiles.length === 0) {
      return;
    }

    try {
      // Prepare files data for database save
      const filesData = readyFiles.map(file => ({
        filename: file.s3Key!,
        originalName: file.file.name,
        mimeType: file.file.type,
        size: file.file.size,
        s3Key: file.s3Key!,
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

      // Call the onUploaded callback
      onUploaded();
    } catch (error) {
      console.error('Failed to save files to database:', error);
      // Mark ready files as error
      setUploadingFiles(prev =>
        prev.map(f =>
          f.status === 'ready'
            ? { ...f, status: 'error' as const, error: 'Failed to save to database' }
            : f
        )
      );
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

  const handleClose = useCallback(() => {
    setUploadingFiles([]);
    setSelectedKnowledgeBases([]);
    onClose();
  }, [onClose]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  const readyFiles = uploadingFiles.filter(f => f.status === 'ready');
  const allUploadsComplete =
    uploadingFiles.length > 0 && uploadingFiles.every(f => f.status !== 'uploading');
  const hasErrors = uploadingFiles.some(f => f.status === 'error');
  const canSave = readyFiles.length > 0 && !uploadFilesMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Upload Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Knowledge Base Selection */}
          <div>
            <label
              htmlFor="knowledge-bases"
              className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Add to Knowledge Bases (Optional)
            </label>
            {loadingKnowledgeBases ? (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
                <span>Loading knowledge bases...</span>
              </div>
            ) : knowledgeBases.length > 0 ? (
              <div id="knowledge-bases" className="grid grid-cols-2 gap-3">
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
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No knowledge bases available. Create one first to organize your files.
              </p>
            )}
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
                Maximum file size: 100MB • Supported formats: PDF, Text, JSON, Markdown, Images, and
                more
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

          {/* Separator */}
          <div className="-mx-6 mt-6 border-t border-gray-200 dark:border-gray-700"></div>

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
                    <RiSaveLine className="h-4 w-4" />
                    <span>
                      Save {readyFiles.length} File{readyFiles.length !== 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </Button>
            )}
            {allUploadsComplete && !hasErrors && !canSave && (
              <Button
                onClick={() => {
                  onUploaded();
                  handleClose();
                }}
                className="px-4"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
