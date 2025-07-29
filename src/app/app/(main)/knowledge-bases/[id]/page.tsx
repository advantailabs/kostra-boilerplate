'use client';

import { Button } from '@/components/atom/Button';
import { LoadingScreen } from '@/components/atom/LoadingScreen';
import { FileCard } from '@/components/molecules/files/FileCard';
import { KnowledgeBaseFileUploader } from '@/components/organisms/modules/knowledge-bases/KnowledgeBaseFileUploader';
import { useKnowledgeBase, useKnowledgeBaseMutations } from '@/hooks/useKnowledgeBases';
import { filesApi } from '@/services/api/files';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface KnowledgeBaseDetailPageProps {
  params: { id: string };
}

export default function KnowledgeBaseDetailPage({ params }: KnowledgeBaseDetailPageProps) {
  const knowledgeBaseId = parseInt(params.id, 10);
  const { data: knowledgeBaseData, isLoading, refetch } = useKnowledgeBase(knowledgeBaseId);
  const { removeFileFromKnowledgeBase } = useKnowledgeBaseMutations();
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [removingFileId, setRemovingFileId] = useState<number | null>(null);

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

  const handleFileDelete = async (fileId: number) => {
    try {
      await removeFileFromKnowledgeBase.mutateAsync({ knowledgeBaseId, fileId });
    } catch (error) {
      console.error('Failed to remove file from knowledge base:', error);
    }
  };

  const handleFileRemoveFromKnowledgeBase = async (fileId: number) => {
    try {
      setRemovingFileId(fileId);
      await removeFileFromKnowledgeBase.mutateAsync({ knowledgeBaseId, fileId });
      await refetch();
    } catch (error) {
      console.error('Failed to remove file from knowledge base:', error);
    } finally {
      setRemovingFileId(null);
    }
  };

  const handleFileDeleteCompletely = async (fileId: number) => {
    try {
      setRemovingFileId(fileId);
      // Delete the file from knowledge base and storage
      await filesApi.deleteFileFromKnowledgeBase(fileId, knowledgeBaseId);
      await refetch();
    } catch (error) {
      console.error('Failed to delete file completely:', error);
    } finally {
      setRemovingFileId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Files</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{knowledgeBase.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/app/knowledge-bases"
            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Button onClick={() => setShowFileUploader(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Files
          </Button>
        </div>
      </div>

      {/* Files Content */}
      <div className="h-full">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {files.map((fileKb: any) => (
                <FileCard
                  key={fileKb.file.id}
                  file={fileKb.file}
                  onDelete={() => handleFileDelete(fileKb.file.id)}
                  showKnowledgeBaseOptions={true}
                  onRemoveFromKnowledgeBase={() =>
                    handleFileRemoveFromKnowledgeBase(fileKb.file.id)
                  }
                  onDeleteFile={() => handleFileDeleteCompletely(fileKb.file.id)}
                  knowledgeBaseId={knowledgeBaseId}
                  isRemoving={removingFileId === fileKb.file.id}
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
