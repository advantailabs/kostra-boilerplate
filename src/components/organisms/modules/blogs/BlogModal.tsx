'use client';

import { Button } from '@/components/atom/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/common/Dialog';
import Editor from '@/components/molecules/editor/Editor';
import { BlogFormFields } from '@/components/molecules/form/BlogFormFields';
import { useBlogForm } from '@/hooks/useBlogForm';
import { useCategories } from '@/hooks/useCategories';
import { BlogResponseType } from '@/types/blog.type';
import { RiCloseLine } from '@remixicon/react';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  blog?: BlogResponseType | null;
  mode: 'create' | 'edit';
  isCreating?: boolean;
  isUpdating?: boolean;
}

export function BlogModal({
  isOpen,
  onClose,
  onSubmit,
  blog,
  mode,
  isCreating = false,
  isUpdating = false,
}: BlogModalProps) {
  const { categories } = useCategories();
  const { form, handleSubmit, resetForm } = useBlogForm({
    blog,
    mode,
    isOpen,
    onSubmit,
  });

  const categoryOptions =
    categories?.map((category: { id: number; name: string }) => ({
      value: category.id.toString(),
      label: category.name,
    })) || [];

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isLoading = mode === 'create' ? isCreating : isUpdating;

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={newOpen => {
          if (!newOpen) {
            handleClose();
          }
        }}
      >
        <DialogContent className="custom-modal-class max-w-screen z-[1000] flex h-screen max-h-screen w-screen flex-col border-gray-200 bg-white p-0 shadow-2xl dark:border-gray-800 dark:bg-[#0a0b14]">
          <div className="flex h-full flex-col">
            {/* Header */}
            <DialogHeader className="relative border-b border-gray-200 p-4 max-sm:p-3 dark:border-gray-700">
              <DialogTitle className="text-lg font-medium text-gray-900 max-sm:pr-12 dark:text-gray-100">
                {mode === 'create' ? 'Create Blog' : 'Edit Blog'}
              </DialogTitle>
              <DialogDescription className="-mt-1 text-xs text-gray-500 max-sm:pr-12 dark:text-gray-400">
                {mode === 'create'
                  ? 'Create a new blog post with content, images, and metadata.'
                  : 'Update your blog post with new content and settings.'}
              </DialogDescription>
              <DialogClose className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300 dark:focus:ring-gray-700">
                <RiCloseLine className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>

            {/* Main Content */}
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <div className="flex min-h-0 flex-1">
                {/* Left Side - Form Fields */}
                <div className="flex w-full max-w-[450px] flex-shrink-0 flex-col gap-4 border-r border-gray-200 p-4 [-ms-overflow-style:none] [scrollbar-width:none] md:w-[450px] dark:border-gray-800">
                  <BlogFormFields
                    control={form.control}
                    errors={form.formState.errors}
                    categoryOptions={categoryOptions}
                    blog={blog}
                    onImageFileChange={file => form.setValue('imageFile', file)}
                  />
                </div>

                {/* Right Side - Editor */}
                <div
                  className="flex h-[740px] min-w-0 flex-1 p-0"
                  onClick={e => e.stopPropagation()}
                >
                  <div
                    className="flex min-h-0 w-full flex-1 flex-col"
                    onClick={e => e.stopPropagation()}
                  >
                    <Editor
                      initialContent={String(form.watch('content') || '')}
                      onContentChange={value => form.setValue('content', value)}
                    />
                  </div>
                  {form.formState.errors.content && (
                    <span className="absolute right-1/2 top-1/2 text-sm text-red-500">
                      {form.formState.errors.content.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-800 dark:bg-gray-900">
                <Button type="button" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {mode === 'create'
                    ? isLoading
                      ? 'Creating...'
                      : 'Create Blog'
                    : isLoading
                      ? 'Updating...'
                      : 'Update Blog'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
