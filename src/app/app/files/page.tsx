'use client';

import { RiAddLine, RiFileLine, RiFilterLine } from '@remixicon/react';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { PageHeader } from '@/components/molecules/common/PageHeader';
import { FileFilterModal } from '@/components/molecules/files/FileFilterModal';
import { FileGrid } from '@/components/organisms/modules/files/FileGrid';
import { FileUploader } from '@/components/organisms/modules/files/FileUploader';
import { formatFileSize } from '@/lib/file-utils';
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

  // Check if any filters are active
  const hasActiveFilters =
    Object.keys(filters).length > 0 &&
    Object.values(filters).some(value => value !== undefined && value !== '');

  if (loading && files.length === 0) {
    return <LoadingScreen message="Loading files..." />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 max-sm:flex-col max-sm:items-start max-sm:gap-3 dark:border-gray-700">
        <PageHeader title="Files" description="Manage and organize your uploaded files" />
        {/* Desktop actions */}
        <div className="px-4 py-3 max-sm:hidden">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowFilterModal(true)}
              variant="secondary"
              className={`flex items-center gap-2 ${hasActiveFilters ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <RiFilterLine className="h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <span className="ml-1 flex h-2 w-2 rounded-full bg-indigo-500" />
              )}
            </Button>
            <Button onClick={() => setShowUploader(true)} className="flex items-center gap-2">
              <RiAddLine className="h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>
      </div>

      {/* Files Content */}
      <div className="h-full p-4 max-sm:p-3">
        {/* Mobile actions */}
        <div className="hidden max-sm:mb-3 max-sm:block">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowFilterModal(true)}
              variant="secondary"
              className={`w-auto justify-center px-3 py-2 ${
                hasActiveFilters ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <RiFilterLine className="mr-1 h-4 w-4" />
              Filter
            </Button>
            <Button
              onClick={() => setShowUploader(true)}
              className="w-auto justify-center px-3 py-2"
            >
              <RiAddLine className="mr-1 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>
        {files.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 max-sm:h-auto max-sm:min-h-[200px] max-sm:px-4 max-sm:py-8 dark:border-gray-600">
            <div className="text-center">
              <RiFileLine className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No files</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by uploading your first file.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => setShowUploader(true)}
                  className="max-sm:w-full max-sm:justify-center"
                >
                  Upload Files
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 max-sm:mb-3">
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
      {showFilterModal && (
        <FileFilterModal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}
    </div>
  );
}
