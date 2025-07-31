import { Button } from '@/components/atom/Button';
import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
import { DeleteDialog } from '@/components/molecules/common/DeleteDialog';
import { Modal } from '@/components/molecules/common/Modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useKnowledgeBases, useRemoveFileFromKnowledgeBase } from '@/hooks/useKnowledgeBases';
import { formatFileSize, getFileIcon } from '@/lib/file-utils';
import { S3_PUBLIC_BASE_URL } from '@/lib/s3';
import { Persona } from '@prisma/client';
import { RiAddLine, RiCloseLine, RiDeleteBinLine, RiImageAddLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { KnowledgeBaseFileUploader } from '../../modules/knowledge-bases/KnowledgeBaseFileUploader';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: any) => void;
  persona?: Persona | null;
  mode: 'create' | 'edit';
}

export function PersonaModal({ isOpen, onClose, onSubmit, persona, mode }: PersonaModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
    logo: '',
    knowledgeBaseId: '',
  });
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [deleteFileDialog, setDeleteFileDialog] = useState<{
    isOpen: boolean;
    fileId: number | null;
    fileName: string;
  }>({ isOpen: false, fileId: null, fileName: '' });
  const [fileUploaderOpen, setFileUploaderOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: knowledgeBasesData } = useKnowledgeBases();
  const removeFileMutation = useRemoveFileFromKnowledgeBase();

  const {
    uploadFile,
    isUploading,
    error: uploadError,
    clearError,
  } = useFileUpload({
    uploadPurpose: 'PersonaLogo',
    objectName: 'persona',
    objectId: persona?.id || 'new',
    onSuccess: url => {
      setFormData(prev => ({ ...prev, logo: url }));
    },
  });

  // Get selected knowledge base with files
  const selectedKnowledgeBase = knowledgeBasesData?.knowledgeBases?.find(
    kb => kb.id === parseInt(formData.knowledgeBaseId)
  );

  useEffect(() => {
    if (mode === 'edit' && persona) {
      setFormData({
        name: persona.name,
        description: persona.description || '',
        instructions: persona.instructions,
        logo: persona.logo || '',
        knowledgeBaseId: persona.knowledgeBaseId?.toString() || '',
      });
      // Set logo preview with full S3 URL if logo exists
      setLogoPreview(persona.logo ? `${S3_PUBLIC_BASE_URL}/${persona.logo}` : null);
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        instructions: '',
        logo: '',
        knowledgeBaseId: '',
      });
      setLogoPreview(null);
    }
    clearError();
  }, [persona, mode, isOpen, clearError]);

  const handleLogoClick = () => {
    clearError();
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      setLogoPreview(URL.createObjectURL(file));
    }

    // Reset file input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({ ...prev, logo: '' }));
    setLogoPreview(null);
    clearError();
  };

  const handleDeleteFile = (fileId: number, fileName: string) => {
    setDeleteFileDialog({
      isOpen: true,
      fileId,
      fileName,
    });
  };

  const confirmDeleteFile = async () => {
    if (!deleteFileDialog.fileId || !formData.knowledgeBaseId) return;

    try {
      await removeFileMutation.mutateAsync({
        knowledgeBaseId: parseInt(formData.knowledgeBaseId),
        fileId: deleteFileDialog.fileId,
      });

      // Manually invalidate queries to refresh the file list
      const knowledgeBaseId = parseInt(formData.knowledgeBaseId);
      queryClient.invalidateQueries({ queryKey: ['knowledge-base', knowledgeBaseId] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });

      setDeleteFileDialog({ isOpen: false, fileId: null, fileName: '' });
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleAddFiles = () => {
    if (formData.knowledgeBaseId) {
      setFileUploaderOpen(true);
    }
  };

  const handleFileUploaderClose = () => {
    setFileUploaderOpen(false);
  };

  const handleFilesUploaded = () => {
    // Invalidate and refetch knowledge base data to update the file list
    if (formData.knowledgeBaseId) {
      const knowledgeBaseId = parseInt(formData.knowledgeBaseId);
      queryClient.invalidateQueries({ queryKey: ['knowledge-base', knowledgeBaseId] });
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] });
    }
    setFileUploaderOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        knowledgeBaseId: formData.knowledgeBaseId ? parseInt(formData.knowledgeBaseId) : null,
      });
      onClose();
    } catch (error) {
      console.error(`Failed to ${mode} persona:`, error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Persona' : 'Create New Persona';
  const description = isEdit
    ? 'Update the AI assistant persona with new instructions and behavior.'
    : 'Create a new AI assistant persona with custom instructions and behavior.';
  const submitText = isEdit ? 'Update Persona' : 'Create Persona';

  // Custom footer for our modal
  const customFooter = (
    <div className="flex flex-shrink-0 flex-col-reverse items-center justify-end gap-3 p-4 sm:flex-row">
      <Button
        type="button"
        variant="secondary"
        onClick={onClose}
        className="w-full sm:w-auto"
        disabled={loading}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="w-full sm:w-auto"
        onClick={handleSubmit}
        disabled={loading || isUploading || !formData.name || !formData.instructions}
        isLoading={loading}
      >
        {submitText}
      </Button>
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        description={description}
        maxWidth="max-w-full"
        contentClassName="h-screen max-h-screen w-screen rounded-none overflow-hidden"
        removePadding={true}
        footer={customFooter}
      >
        <div className="grid h-full grid-cols-[25%_35%_40%]">
          {/* Column 1: Logo, Title, Description, Knowledge Base */}
          <div className="overflow-y-auto border-r border-gray-200 dark:border-gray-800">
            <div className="space-y-4 p-4">
              {/* Logo Section */}
              <div>
                <Label htmlFor="logo" className="mb-2 block text-sm font-medium">
                  Logo
                </Label>
                <div className="relative">
                  <button
                    type="button"
                    className={`hover:border-primary relative flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                      isUploading ? 'opacity-50' : ''
                    } ${uploadError ? 'border-red-300' : 'border-gray-300'}`}
                    onClick={handleLogoClick}
                    disabled={isUploading}
                    aria-label="Upload logo"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                      disabled={isUploading}
                      id="logo"
                    />
                    {logoPreview ? (
                      <div className="relative h-full w-full rounded-lg">
                        <Image
                          src={logoPreview}
                          alt="Logo preview"
                          fill
                          className="rounded-lg object-cover"
                          sizes="80px"
                        />
                        {/* Remove Logo Button positioned on the logo */}
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleRemoveLogo();
                          }}
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                          aria-label="Remove logo"
                        >
                          <RiCloseLine className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <RiImageAddLine className="h-5 w-5" />
                        <span className="mt-1 text-xs">Upload</span>
                      </div>
                    )}
                  </button>
                </div>

                {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
                {isUploading && <p className="mt-2 text-xs text-gray-500">Uploading...</p>}
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="mb-2 text-sm font-medium">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter persona name"
                  className="mt-2"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="mb-2 text-sm font-medium">
                  Description
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the persona"
                  className="mt-2"
                />
              </div>

              {/* Knowledge Base Selection */}
              <div>
                <Label htmlFor="knowledgeBase" className="mb-2 text-sm font-medium">
                  Knowledge Base
                </Label>
                <Select
                  value={formData.knowledgeBaseId || 'none'}
                  onValueChange={value =>
                    setFormData({ ...formData, knowledgeBaseId: value === 'none' ? '' : value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a knowledge base (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No knowledge base</SelectItem>
                    {knowledgeBasesData?.knowledgeBases?.map(kb => (
                      <SelectItem key={kb.id} value={kb.id.toString()}>
                        {kb.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Column 2: Instructions */}
          <div className="overflow-y-auto border-r border-gray-200 dark:border-gray-800">
            <div className="h-full p-4">
              <Label htmlFor="instructions" className="mb-2 text-sm font-medium">
                Instructions *
              </Label>
              <textarea
                id="instructions"
                value={formData.instructions}
                onChange={e => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Detailed instructions for the AI assistant"
                required
                className="mt-2 h-[calc(100vh-250px)] w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
              />
            </div>
          </div>

          {/* Column 3: Files */}
          <div className="overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <Label className="mb-2 text-sm font-medium">Knowledge Base Files</Label>
                {formData.knowledgeBaseId && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-5 w-5 p-0"
                    onClick={handleAddFiles}
                    aria-label="Add Files"
                  >
                    <RiAddLine className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {!formData.knowledgeBaseId ? (
                <div className="mt-2 py-8 text-center text-sm text-gray-500">
                  Select a knowledge base to view files
                </div>
              ) : !selectedKnowledgeBase?.fileKnowledgeBases?.length ? (
                <div className="mt-2 py-8 text-center text-sm text-gray-500">
                  No files in this knowledge base
                </div>
              ) : (
                <div className="mt-1 grid max-h-[calc(100vh-250px)] grid-cols-2 gap-1 overflow-y-auto">
                  {selectedKnowledgeBase.fileKnowledgeBases.map(({ file }) => {
                    const FileIcon = getFileIcon(file.mimeType);
                    return (
                      <div
                        key={file.id}
                        className="group flex items-center justify-between rounded border border-gray-200 p-1.5 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      >
                        <div className="flex min-w-0 flex-1 items-center space-x-1.5">
                          <FileIcon className="h-2.5 w-2.5 flex-shrink-0 text-gray-400" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-medium text-gray-900 dark:text-gray-100">
                              {file.originalName}
                            </p>
                            <div className="flex items-center space-x-1 text-[8px] text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>
                                {file.originalName.split('.').pop()?.toUpperCase() || 'FILE'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id, file.originalName)}
                          className="ml-1 flex-shrink-0 text-red-500 opacity-0 transition-all hover:text-red-700 group-hover:opacity-100"
                          aria-label="Delete file"
                        >
                          <RiDeleteBinLine className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete File Confirmation Dialog */}
      <DeleteDialog
        isOpen={deleteFileDialog.isOpen}
        onClose={() => setDeleteFileDialog({ isOpen: false, fileId: null, fileName: '' })}
        onConfirm={confirmDeleteFile}
        title="Delete File"
        description={`Are you sure you want to remove "${deleteFileDialog.fileName}" from this knowledge base? The file itself will not be deleted.`}
        confirmText="Remove File"
        cancelText="Cancel"
        isLoading={removeFileMutation.isPending}
        itemName={deleteFileDialog.fileName}
      />

      {/* File Uploader Dialog */}
      {fileUploaderOpen && formData.knowledgeBaseId && (
        <KnowledgeBaseFileUploader
          isOpen={fileUploaderOpen}
          onClose={handleFileUploaderClose}
          onUploaded={handleFilesUploaded}
          knowledgeBaseId={parseInt(formData.knowledgeBaseId)}
        />
      )}
    </>
  );
}
