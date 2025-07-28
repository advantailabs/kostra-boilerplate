'use client';

import { RiAddLine, RiFileLine, RiFilterLine } from '@remixicon/react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/atom/Button';
import { FileFilterModal } from '@/components/molecules/files/FileFilterModal';
import { FileGrid } from '@/components/organisms/modules/files/FileGrid';
import { FileUploader } from '@/components/organisms/modules/files/FileUploader';
import { FileFilters, filesApi } from '@/services/api/files';
import { useAuth } from '@clerk/nextjs';

export default function FilesPage() {
  const { userId } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FileFilters>({});
  const [showUploader, setShowUploader] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const loadFiles = useCallback(
    async (pageNum = 1, append = false) => {
      if (!userId) return;

      try {
        setLoading(true);
        const response = await filesApi.getFiles(pageNum, 20, filters);

        if (append) {
          setFiles(prev => [...prev, ...response.files]);
        } else {
          setFiles(response.files);
        }

        setTotal(response.total);
        setHasMore(pageNum < response.totalPages);
        setPage(pageNum);
      } catch (error) {
        console.error('Error loading files:', error);
      } finally {
        setLoading(false);
      }
    },
    [userId, filters]
  );

  useEffect(() => {
    loadFiles(1, false);
  }, [loadFiles]);

  const handleFiltersChange = useCallback((newFilters: FileFilters) => {
    setFilters(newFilters);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadFiles(page + 1, true);
    }
  }, [hasMore, loading, page, loadFiles]);

  const handleFileUploaded = useCallback(() => {
    setShowUploader(false);
    loadFiles(1, false);
  }, [loadFiles]);

  const handleFileDeleted = useCallback(() => {
    loadFiles(1, false);
  }, [loadFiles]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
  };

  // Check if any filters are active
  const hasActiveFilters =
    Object.keys(filters).length > 0 &&
    Object.values(filters).some(value => value !== undefined && value !== '');

  if (loading && files.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="mt-2 text-sm text-gray-500">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Files</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage and organize your uploaded files
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFilterModal(true)}
            variant="secondary"
            className={`flex items-center gap-2 ${hasActiveFilters ? 'ring-2 ring-indigo-500' : ''}`}
          >
            <RiFilterLine className="h-4 w-4" />
            Filter
            {hasActiveFilters && <span className="ml-1 flex h-2 w-2 rounded-full bg-indigo-500" />}
          </Button>
          <Button onClick={() => setShowUploader(true)} className="flex items-center gap-2">
            <RiAddLine className="h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Files Content */}
      <div className="h-full">
        {files.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <RiFileLine className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No files</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by uploading your first file.
              </p>
              <div className="mt-6">
                <Button onClick={() => setShowUploader(true)}>Upload Files</Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {total} file{total !== 1 ? 's' : ''} •{' '}
                {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))} total
              </p>
            </div>
            <FileGrid
              files={files}
              onFileDeleted={handleFileDeleted}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              loading={loading}
            />
          </>
        )}
      </div>

      {/* File Uploader Modal */}
      {showUploader && (
        <FileUploader
          isOpen={showUploader}
          onClose={() => setShowUploader(false)}
          onUploaded={handleFileUploaded}
        />
      )}

      {/* File Filter Modal */}
      <FileFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
}
