'use client';

import { RiCheckLine, RiCloseLine, RiFileLine, RiSaveLine, RiUploadLine } from '@remixicon/react';
import React, { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/atom/Button';
import { Modal } from '@/components/molecules/common/Modal';
import { useUploadFiles } from '@/hooks/useFiles';
import { uploadFileViaPresignedUrl } from '@/services/external/aws/presigned-upload';
import { formatFileSize } from '@/services/internal/files/file-upload/file-utils';
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

      // Important: reset the file input value so selecting the same file again triggers onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        uploadPurpose: 'UserDocument' as const,
      }));

      // Save all files to database using React Query
      await uploadFilesMutation.mutateAsync({
        files: filesData,
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

      // Mark ready files as error with generic message
      setUploadingFiles(prev =>
        prev.map(f =>
          f.status === 'ready'
            ? { ...f, status: 'error' as const, error: 'Failed to save to database' }
            : f
        )
      );

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
        description="Upload files to your account"
        maxWidth="max-w-2xl"
        contentClassName="max-h-[90vh] overflow-y-auto"
        footer={actionFooter}
      >
        <div className="space-y-6">
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
