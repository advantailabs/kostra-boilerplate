'use client';

import { Check, File, Save, Upload, X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

import { Modal } from '@/components/molecules/common/Modal';
import { Button } from '@/components/ui/button';
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
          console.error(error)
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
    [user]
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
    } catch (error: unknown) {
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
              <Save className="h-4 w-4" />
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
        maxWidth="max-w-2xl!"
        contentClassName="max-h-[90vh] overflow-y-auto"
        footer={actionFooter}
      >
        <div className="space-y-6">
          {/* Drop Zone */}
          <div
            ref={dropZoneRef}
            className="hover:border-primary/50 rounded-lg border-2 border-dashed border-border p-8 text-center shadow-xs transition-all duration-200 hover:shadow-md"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-16 w-16 text-text-muted" />
            <div className="mt-4">
              <p className="text-lg font-medium text-text">Drop files here or browse</p>
              <p className="mt-2 text-sm text-text-muted">
                Drag and drop files here, or{' '}
                <button
                  type="button"
                  className="font-medium text-primary hover:text-primary-hover"
                  onClick={() => fileInputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="mt-2 text-xs text-text-muted">
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
                <h4 className="text-sm font-medium text-text">
                  Files ({uploadingFiles.filter(f => f.status === 'success').length}/
                  {uploadingFiles.length})
                </h4>
                {readyFiles.length > 0 && (
                  <div className="text-sm text-text-muted">{readyFiles.length} ready to save</div>
                )}
              </div>

              {uploadingFiles.map(uploadingFile => (
                <div
                  key={uploadingFile.id}
                  className="flex items-center space-x-4 rounded-lg bg-background p-3"
                >
                  <File className="h-5 w-5 flex-shrink-0 text-text-muted" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">
                      {uploadingFile.file.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {formatFileSize(uploadingFile.file.size)}
                    </p>
                    {uploadingFile.status === 'uploading' && (
                      <div className="mt-2 h-2 w-full rounded-full bg-background-light">
                        <div
                          className="h-2 rounded-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadingFile.progress}%` }}
                        />
                      </div>
                    )}
                    {uploadingFile.error && (
                      <p className="mt-1 text-xs text-danger">{uploadingFile.error}</p>
                    )}
                    {uploadingFile.status === 'ready' && (
                      <p className="mt-1 text-xs text-success">Ready to save</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {uploadingFile.status === 'uploading' && (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    )}
                    {uploadingFile.status === 'ready' && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {uploadingFile.status === 'success' && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-success">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {uploadingFile.status === 'error' && (
                      <div className="h-5 w-5 rounded-full bg-danger" />
                    )}
                    <button
                      onClick={() =>
                        setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id))
                      }
                      className="text-text-muted hover:text-text"
                    >
                      <X className="h-4 w-4" />
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
            className={`-mt-2 mb-2 text-sm font-medium ${warning.type === 'error' ? 'text-danger' : 'text-warning'}`}
          >
            {warning.type === 'error' ? 'Error:' : 'Warning:'}
          </div>
          <p className="text-sm text-text">{warning.message}</p>
        </Modal>
      )}
    </>
  );
}
