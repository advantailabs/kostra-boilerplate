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
import { CreateBlogInput, UpdateBlogInput } from '@/schemas/blog.schema';
import { BlogResponseType } from '@/types/blog.type';
import { RiCloseLine } from '@remixicon/react';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (_data: CreateBlogInput | UpdateBlogInput) => void;
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
        <DialogContent className="custom-modal-class max-w-screen z-[1000] flex h-screen max-h-screen w-screen flex-col border-border bg-background  p-0 shadow-2xl">
          <div className="flex h-full flex-col">
            {/* Header */}
            <DialogHeader className="relative border-b border-border p-4 max-sm:p-3 bg-white dark:bg-background-light">
              <DialogTitle className="text-lg font-medium text-text max-sm:pr-12">
                {mode === 'create' ? 'Create Blog' : 'Edit Blog'}
              </DialogTitle>
              <DialogDescription className="-mt-1 text-xs text-text-muted max-sm:pr-12">
                {mode === 'create'
                  ? 'Create a new blog post with content, images, and metadata.'
                  : 'Update your blog post with new content and settings.'}
              </DialogDescription>
              <DialogClose className="focus:ring-primary/20 absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-muted hover:bg-background-light hover:text-text focus:outline-hidden focus:ring-2">
                <RiCloseLine className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </DialogHeader>

            {/* Main Content */}
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <div className="flex min-h-0 flex-1">
                {/* Left Side - Form Fields */}
                <div className="flex w-full max-w-[450px] flex-shrink-0 flex-col gap-4 border-r border-border p-4 [-ms-overflow-style:none] [scrollbar-width:none] md:w-[450px]">
                  <BlogFormFields
                    control={form.control}
                    errors={form.formState.errors}
                    categoryOptions={categoryOptions}
                    blog={blog}
                  />
                </div>

                {/* Right Side - Editor */}
                <div
                  className="flex h-[740px] 2xl:h-[88vh] min-w-0 flex-1 p-0"
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
                    <span className="absolute right-1/2 top-1/2 text-sm text-danger">
                      {form.formState.errors.content.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 border-t border-border bg-background-light px-6 py-4">
                <Button type="button" variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  isLoading={isLoading}
                  loadingText="Saving..."
                >
                  {mode === 'create' ? 'Create Blog' : 'Update Blog'}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
