import { useFileDownload } from '@/hooks/useFiles';
import { CitationFile } from '@/types/chat';
import { RiDownloadLine, RiFileTextLine } from '@remixicon/react';
import { Button } from './Button';

interface CitationListProps {
  citations: CitationFile[];
  className?: string;
}

export function CitationList({ citations, className }: CitationListProps) {
  const downloadFile = useFileDownload();

  if (!citations || citations.length === 0) {
    return null;
  }

  const handleDownload = (fileId: number, filename: string) => {
    downloadFile.mutate(fileId, {
      onSuccess: _data => {
        console.log(`Downloading ${filename}...`);
      },
      onError: error => {
        console.error('Failed to download file:', error);
      },
    });
  };

  return (
    <div className={`mt-3 space-y-2 ${className}`}>
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
        Cited Files ({citations.length})
      </div>
      <div className="space-y-1">
        {citations.map((citation, index) => (
          <div
            key={`${citation.openaiFileId}-${index}`}
            className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 dark:bg-gray-800"
          >
            <div className="flex items-center space-x-2">
              <RiFileTextLine className="h-4 w-4 text-gray-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {citation.originalName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {citation.mimeType} • {(citation.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleDownload(citation.fileId, citation.originalName)}
              disabled={downloadFile.isPending}
              className="flex-shrink-0 p-2"
              title="Download file"
            >
              <RiDownloadLine className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
