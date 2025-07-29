import { processContentWithCitations } from '@/lib/utils';
import { CitationFile } from '@/types/chat';
import { Avatar } from './Avatar';
import { CitationList } from './CitationList';
import MarkdownRenderer from './SyntaxHighlighter';

interface StreamingMessageProps {
  message: string;
  personaLogo?: string | null;
  personaName?: string | null;
  citations?: CitationFile[];
}

export function StreamingMessage({
  message,
  personaLogo,
  personaName = 'AI',
  citations = [],
}: StreamingMessageProps) {
  // Convert CitationFile to StoredCitation format for processing
  const storedCitations = citations.map(citation => ({
    openaiFileId: citation.openaiFileId,
    fileId: citation.fileId,
    originalName: citation.originalName,
    filename: citation.filename,
    mimeType: citation.mimeType,
    size: citation.size,
    citationText: citation.citationText,
    startIndex: citation.startIndex,
    endIndex: citation.endIndex,
  }));

  // Process content to remove citation text for display
  const displayContent = processContentWithCitations(message, storedCitations, false);

  return (
    <div className="flex justify-start gap-3">
      <Avatar
        src={personaLogo || undefined}
        alt={`${personaName} avatar`}
        fallback={personaName || 'AI'}
        size="sm"
      />
      <div className="flex flex-col">
        <div className="max-w-[80%] rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-gray-800 dark:text-gray-100">
          <div className="text-gray-900 dark:text-gray-100">
            <MarkdownRenderer content={message} />
            <span className="animate-pulse">|</span>
          </div>
        </div>
        {/* Show citations if available outside the bubble */}
        {citations && citations.length > 0 && <CitationList citations={citations} />}
      </div>
    </div>
  );
}
