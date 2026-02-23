'use client';

import { File as FileIcon, Filter, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { FileFilterModal } from '@/components/molecules/files/FileFilterModal';
import { FileGrid } from '@/components/organisms/modules/files/FileGrid';
import { FileUploader } from '@/components/organisms/modules/files/FileUploader';
import { Button } from '@/components/ui/button';
import { File } from '@/lib/prisma/generated/browser';
import { FileFilters, filesApi } from '@/services/api/files';
import { formatFileSize } from '@/services/internal/files/file-upload/file-utils';
import { useAuthStore } from '@/store/auth';

export default function FilesPage() {
  const { user } = useAuthStore();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FileFilters>({});
  const [showUploader, setShowUploader] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const loadFiles = useCallback(
    async (pageNum = 1, append = false) => {
      if (!user) return;

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
    [user, filters]
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

  return (
    <div className="min-h-screen">
      <PageHeaderWithAction
        title="Files"
        description="Manage and organize your uploaded files"
        onFilter={() => setShowFilterModal(true)}
        hasActiveFilters={hasActiveFilters}
        onAdd={() => setShowUploader(true)}
        addButtonText="Upload Files"
      />

      {/* Files Content */}
      <div className="p-4 max-sm:p-3">
        {loading && files.length === 0 ? (
          <LoadingScreen
            message="Loading files..."
            className="h-[calc(100%-4rem)] flex items-center justify-center bg-transparent"
          />
        ) : (
          <>
            {/* Mobile actions */}
            <div className="hidden max-sm:mb-3">{/* max-sm:block */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowFilterModal(true)}
                  variant="secondary"
                  className={`w-auto justify-center px-3 py-2 ${hasActiveFilters ? 'ring-2 ring-primary' : ''
                    }`}
                >
                  <Filter className="mr-1 h-4 w-4" />
                  Filter
                </Button>
                <Button
                  onClick={() => setShowUploader(true)}
                  className="w-auto justify-center px-3 py-2"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </div>
            {files.length === 0 && Object.values(filters).length === 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border shadow-xs max-sm:h-auto max-sm:min-h-[200px] max-sm:px-4 max-sm:py-8">
                <div className="text-center">
                  <FileIcon className="mx-auto h-12 w-12 text-text-muted" />
                  <h3 className="mt-2 text-sm font-medium text-text">No files</h3>
                  <p className="mt-1 text-sm text-text-muted">
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
            ) : files.length === 0 && Object.values(filters).length > 0 ? (
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border shadow-xs max-sm:h-auto max-sm:min-h-[200px] max-sm:px-4 max-sm:py-8">
                <div className="text-center">
                  <FileIcon className="mx-auto h-12 w-12 text-text-muted" />
                  <h3 className="mt-2 text-sm font-medium text-text">No Files Found</h3>
                  <p className="mt-1 text-sm text-text-muted">
                    No files were found that matched your filters
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 max-sm:mb-3">
                  <p className="text-sm text-text-muted">
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
