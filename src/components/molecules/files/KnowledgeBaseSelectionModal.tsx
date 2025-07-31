import { Avatar } from '@/components/atom/Avatar';
import { Button } from '@/components/atom/Button';
import { Modal } from '@/components/molecules/common/Modal';
import { KnowledgeBaseWithFiles } from '@/types/chat';
import { RiBookLine } from '@remixicon/react';
import { useState } from 'react';

interface KnowledgeBaseSelectionModalProps {
  isOpen: boolean;
  knowledgeBases: KnowledgeBaseWithFiles[];
  onClose: () => void;
  onSelectKnowledgeBase: (_knowledgeBaseId: number) => void;
  isLoading?: boolean;
  processingKnowledgeBaseId?: number | null;
  selectedFile?: any;
}

export function KnowledgeBaseSelectionModal({
  isOpen,
  knowledgeBases,
  onClose,
  onSelectKnowledgeBase,
  isLoading = false,
  processingKnowledgeBaseId = null,
  selectedFile,
}: KnowledgeBaseSelectionModalProps) {
  const [selectedKnowledgeBaseId, setSelectedKnowledgeBaseId] = useState<number | undefined>();

  // Check if file already exists in a knowledge base
  const isFileInKnowledgeBase = (knowledgeBase: KnowledgeBaseWithFiles) => {
    if (!selectedFile) return false;
    return (
      knowledgeBase.fileKnowledgeBases?.some(fileKb => fileKb.file.id === selectedFile.id) || false
    );
  };

  // Check if the currently selected knowledge base already has the file
  const isSelectedKnowledgeBaseDisabled = () => {
    if (!selectedKnowledgeBaseId || !selectedFile) return false;
    const kb = knowledgeBases.find(kb => kb.id === selectedKnowledgeBaseId);
    return kb ? isFileInKnowledgeBase(kb) : false;
  };

  const handleSelect = () => {
    if (selectedKnowledgeBaseId) {
      onSelectKnowledgeBase(selectedKnowledgeBaseId);
      // Don't close the modal immediately - let the parent component handle closing
      // after the operation completes
    }
  };

  // Custom footer with action buttons
  const actionFooter =
    knowledgeBases.length > 0 ? (
      <div className="flex items-center justify-end">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSelect}
            disabled={!selectedKnowledgeBaseId || isLoading || isSelectedKnowledgeBaseDisabled()}
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Adding...
              </>
            ) : (
              'Add to Knowledge Base'
            )}
          </Button>
        </div>
      </div>
    ) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Knowledge Base"
      description="Choose a knowledge base to add this file to"
      maxWidth="max-w-md"
      footer={actionFooter}
    >
      {knowledgeBases.length === 0 ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <RiBookLine className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-gray-100">
            No Knowledge Bases Available
          </h3>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            You need to create a knowledge base first before adding files.
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="max-h-80 overflow-y-auto">
              {knowledgeBases.map((knowledgeBase, index) => {
                const fileExists = isFileInKnowledgeBase(knowledgeBase);
                return (
                  <div key={knowledgeBase.id}>
                    <button
                      onClick={() => setSelectedKnowledgeBaseId(knowledgeBase.id)}
                      disabled={isLoading || fileExists}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700 ${
                        selectedKnowledgeBaseId === knowledgeBase.id && !fileExists
                          ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-100'
                          : fileExists
                            ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                            : ''
                      } ${index === 0 ? 'rounded-t-lg' : ''} ${
                        index === knowledgeBases.length - 1 ? 'rounded-b-lg' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={null}
                          alt={`${knowledgeBase.title} avatar`}
                          fallback={knowledgeBase.title.charAt(0).toUpperCase()}
                          size="sm"
                          className={`${
                            fileExists
                              ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                              : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400'
                          }`}
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <div className="text-left">
                            <span className="font-medium">{knowledgeBase.title}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {knowledgeBase.fileKnowledgeBases?.length || 0} files
                              {processingKnowledgeBaseId === knowledgeBase.id && (
                                <span className="ml-2 text-indigo-600 dark:text-indigo-400">
                                  • Adding...
                                </span>
                              )}
                              {fileExists && (
                                <span className="ml-2 text-red-600 dark:text-red-400">
                                  • File already exists
                                </span>
                              )}
                            </p>
                          </div>
                          {selectedKnowledgeBaseId === knowledgeBase.id && !fileExists && (
                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                          )}
                          {processingKnowledgeBaseId === knowledgeBase.id && (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                          )}
                          {fileExists && (
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                              ✓
                            </div>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Separator between list items */}
                    {index < knowledgeBases.length - 1 && (
                      <div className="border-t border-gray-200 dark:border-gray-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
