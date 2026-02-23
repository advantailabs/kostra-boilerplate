'use client';

import Editor from '@/components/molecules/editor/Editor';
import { BlogFormFields } from '@/components/molecules/form/BlogFormFields';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBlogForm } from '@/hooks/useBlogForm';
import { useCategories } from '@/hooks/useCategories';
import { CreateBlogInput, UpdateBlogInput } from '@/schemas/blog.schema';
import { BlogResponseType } from '@/types/blog.type';

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
        <DialogContent
          className="fixed inset-0 z-[1000] flex h-screen w-screen max-h-none max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-0 border-border bg-background p-0 shadow-2xl sm:max-w-none"

        >
          <div className="flex h-full flex-col overflow-hidden">
            {/* Header */}
            <DialogHeader className="relative border-b border-border p-4 max-sm:p-3">
              <DialogTitle className="max-sm:pr-12">
                {mode === 'create' ? 'Create Blog' : 'Edit Blog'}
              </DialogTitle>
              <DialogDescription className="-mt-1 max-sm:pr-12">
                {mode === 'create'
                  ? 'Create a new blog post with content, images, and metadata.'
                  : 'Update your blog post with new content and settings.'}
              </DialogDescription>
            </DialogHeader>

            {/* Main Content */}
            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex min-h-0 flex-1 overflow-hidden">
                {/* Left Side - Form Fields */}
                <div className="flex w-full max-w-[450px] flex-shrink-0 flex-col gap-4 overflow-y-auto border-r border-border p-4 md:w-[450px]">
                  <BlogFormFields
                    control={form.control}
                    errors={form.formState.errors}
                    categoryOptions={categoryOptions}
                    blog={blog}
                  />
                </div>

                {/* Right Side - Editor */}
                <div
                  className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-0"
                  onClick={e => e.stopPropagation()}
                >
                  <div
                    className="flex min-h-0 w-full min-w-0 flex-1 flex-col"
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
              <DialogFooter className="flex justify-end gap-2 border-t border-border bg-background-light px-6 py-4">
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
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
