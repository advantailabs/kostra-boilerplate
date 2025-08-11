'use client';

import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { PageHeader } from '@/components/molecules/common/PageHeader';
import { FileCard } from '@/components/molecules/files/FileCard';
import { KnowledgeBaseFileUploader } from '@/components/organisms/modules/knowledge-bases/KnowledgeBaseFileUploader';
import { useFileDownload } from '@/hooks/useFiles';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBases';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface KnowledgeBaseDetailPageProps {
  params: { id: string };
}

export default function KnowledgeBaseDetailPage({ params }: KnowledgeBaseDetailPageProps) {
  const knowledgeBaseId = parseInt(params.id, 10);
  const { data: knowledgeBaseData, isLoading, refetch } = useKnowledgeBase(knowledgeBaseId);
  const downloadFileMutation = useFileDownload();
  const [showFileUploader, setShowFileUploader] = useState(false);

  if (isLoading) {
    return <LoadingScreen message="Loading knowledge base..." />;
  }

  if (!knowledgeBaseData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500">Knowledge base not found</p>
          <Link href="/app/knowledge-bases" className="mt-2 text-indigo-600 hover:text-indigo-500">
            Back to Knowledge Bases
          </Link>
        </div>
      </div>
    );
  }

  const knowledgeBase = knowledgeBaseData;
  const files = knowledgeBase.fileKnowledgeBases || [];

  const handleFileUploaded = () => {
    refetch();
  };

  const handleFileRemoveFromKnowledgeBase = async () => {
    // The removal is handled in the FileCard component
  };

  const handleFileDeleteCompletely = async () => {
    // The deletion is handled in the FileDetailsModal component
    // Manually refetch knowledge base data since we removed knowledge base invalidation from useFiles
    refetch();
  };

  const handleFileDownload = (fileId: number) => {
    downloadFileMutation.mutate(fileId);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gray-200 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
        <PageHeader title="Knowledge Base Files" description={knowledgeBase.title} />
        <div className="hidden px-4 pb-3 sm:block sm:py-3">
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <Link
              href="/app/knowledge-bases"
              className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:w-auto dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <Button
              onClick={() => setShowFileUploader(true)}
              className="flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add Files
            </Button>
          </div>
        </div>
      </div>

      {/* Files Content */}
      <div className="h-full p-4">
        {/* Mobile actions placed just below the header border */}
        <div className="mb-4 flex items-center gap-3 sm:hidden">
          <Link
            href="/app/knowledge-bases"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Button
            onClick={() => setShowFileUploader(true)}
            className="inline-flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Files
          </Button>
        </div>
        {files.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No files</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by uploading your first file to this knowledge base.
              </p>
              <div className="mt-6">
                <Button onClick={() => setShowFileUploader(true)}>Add Files</Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {files.length} file{files.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {files.map((fileKb: any) => (
                <FileCard
                  key={fileKb.file.id}
                  file={fileKb.file}
                  onDelete={() => handleFileRemoveFromKnowledgeBase()}
                  onDownload={() => handleFileDownload(fileKb.file.id)}
                  showKnowledgeBaseOptions
                  onRemoveFromKnowledgeBase={() => handleFileRemoveFromKnowledgeBase()}
                  onDeleteFile={() => handleFileDeleteCompletely()}
                  isDownloading={
                    downloadFileMutation.isPending &&
                    downloadFileMutation.variables === fileKb.file.id
                  }
                  knowledgeBaseInfo={{
                    id: knowledgeBase.id,
                    title: knowledgeBase.title,
                    description: knowledgeBase.description,
                    personas: knowledgeBase.personas || [],
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {showFileUploader && (
        <KnowledgeBaseFileUploader
          isOpen={showFileUploader}
          onClose={() => setShowFileUploader(false)}
          onUploaded={handleFileUploaded}
          knowledgeBaseId={knowledgeBaseId}
        />
      )}
    </div>
  );
}
