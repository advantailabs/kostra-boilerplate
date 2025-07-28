'use client';

import { useCallback, useEffect, useRef } from 'react';

import { FileCard } from '@/components/molecules/files/FileCard';
import { useFileDownload } from '@/hooks/useFiles';

interface FileGridProps {
  files: any[];
  onFileDeleted: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
}

export function FileGrid({ files, onFileDeleted, onLoadMore, hasMore, loading }: FileGridProps) {
  const observerRef = useRef<HTMLDivElement>(null);
  const downloadFileMutation = useFileDownload();

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  const handleDelete = useCallback(
    (file: any) => {
      // The delete functionality is now handled directly in the FileCard component
      // This callback is called after successful deletion to refresh the list
      onFileDeleted();
    },
    [onFileDeleted]
  );

  const handleView = useCallback((_file: any) => {
    // View functionality is now handled in the FileDetailsModal
    console.log('View file:', _file);
  }, []);

  const handleDownload = useCallback(
    (file: any) => {
      // Handle download at the grid level
      downloadFileMutation.mutate(file.id);
    },
    [downloadFileMutation]
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {files.map(file => (
          <FileCard
            key={file.id}
            file={file}
            onDelete={() => handleDelete(file)}
            onView={() => handleView(file)}
            onDownload={() => handleDownload(file)}
            isDownloading={
              downloadFileMutation.isPending && downloadFileMutation.variables === file.id
            }
          />
        ))}
      </div>

      {/* Intersection Observer target for infinite scrolling */}
      {hasMore && <div ref={observerRef} className="h-4 w-full" />}

      {loading && hasMore && (
        <div className="p-4 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading more files...</p>
        </div>
      )}
    </>
  );
}
