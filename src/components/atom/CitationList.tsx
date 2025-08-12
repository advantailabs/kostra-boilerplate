import { useFileDownload } from '@/hooks/useFiles';
import { PublicCitationFile } from '@/types/chat';
import { RiAttachment2, RiFileTextLine } from '@remixicon/react';

interface CitationListProps {
  citations: PublicCitationFile[];
  className?: string;
  hideLabel?: boolean;
  label?: string;
  variant?: 'sources' | 'attachments';
}

export function CitationList({
  citations,
  className,
  hideLabel = false,
  label,
  variant = 'sources',
}: CitationListProps) {
  const downloadFile = useFileDownload();

  if (!citations || citations.length === 0) {
    return null;
  }

  // Deduplicate by fileId while preserving first occurrence order
  const uniqueCitations: PublicCitationFile[] = Array.from(
    new Map<number, PublicCitationFile>(
      citations.map(citation => [citation.fileId, citation])
    ).values()
  );

  const handleDownload = (fileId: number, filename: string) => {
    if (fileId <= 0) return; // Optimistic attachments are not yet downloadable
    downloadFile.mutate(fileId, {
      onSuccess: _data => {
        console.log(`Downloading ${filename}...`);
      },
      onError: error => {
        console.error('Failed to download file:', error);
      },
    });
  };

  const isAttachments = variant === 'attachments';
  const chipBase = isAttachments
    ? 'bg-indigo-500/40 text-indigo-100 hover:bg-indigo-500/60'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600';

  const Icon = isAttachments ? RiAttachment2 : RiFileTextLine;
  const resolvedLabel = label ?? (isAttachments ? 'Attachments:' : 'Sources:');

  return (
    <div className={`mt-2 flex items-center gap-2 ${className}`}>
      {!hideLabel && (
        <span className="text-[8px] font-medium text-gray-500 dark:text-gray-400">
          {resolvedLabel}
        </span>
      )}
      <div className="flex flex-wrap gap-1">
        {uniqueCitations.map(citation => {
          const isDownloadable = citation.fileId > 0;
          const title = isAttachments
            ? isDownloadable
              ? `Download ${citation.originalName}`
              : `Uploading ${citation.originalName}...`
            : citation.originalName;
          return (
            <button
              key={citation.fileId}
              onClick={() => handleDownload(citation.fileId, citation.originalName)}
              disabled={downloadFile.isPending || !isDownloadable}
              className={`inline-flex items-center gap-0.5 rounded-full px-1 py-0 text-[8px] font-medium transition-colors ${chipBase} ${
                !isDownloadable ? 'cursor-not-allowed opacity-70' : ''
              }`}
              title={title}
            >
              <Icon className="h-2 w-2" />
              <span>{citation.originalName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
