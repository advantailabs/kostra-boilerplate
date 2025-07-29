import { useFileDownload } from '@/hooks/useFiles';
import { CitationFile } from '@/types/chat';
import { RiFileTextLine } from '@remixicon/react';

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
    <div className={`mt-2 flex items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Sources:</span>
      <div className="flex flex-wrap gap-1">
        {citations.map((citation, index) => (
          <button
            key={`${citation.openaiFileId}-${index}`}
            onClick={() => handleDownload(citation.fileId, citation.originalName)}
            disabled={downloadFile.isPending}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            title={`Download ${citation.originalName}`}
          >
            <RiFileTextLine className="h-3 w-3" />
            <span>{citation.originalName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
