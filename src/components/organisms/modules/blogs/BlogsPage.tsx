'use client';

import { DataTable } from '@/components/organisms/shared/data-table/DataTable';
import { useBlogs } from '@/hooks/useBlogs';
import { useCategories } from '@/hooks/useCategories';
import { useCallback, useState } from 'react';
import { BlogModal } from './BlogModal';
import { DeleteBlogDialog } from './DeleteBlogDialog';
import { FilterBar } from './FilterBar';
import { createColumns } from './TableColumns';

interface BlogsPageProps {
  className?: string;
}

export function BlogsPage({ className }: BlogsPageProps) {
  // State to store filter values for the API
  const [apiFilters, setApiFilters] = useState<{
    title?: string;
    published?: boolean;
    categoryId?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // State to control the visibility of the blog modal
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // State to store the ID of the blog being edited
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);

  // State to track the current modal mode (add or edit)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // State to control the visibility of the delete blog dialog
  const [isDeleteBlogDialogOpen, setIsDeleteBlogDialogOpen] = useState(false);
  // State to store the ID of the blog being deleted
  const [deletingBlogId, setDeletingBlogId] = useState<number | null>(null);
  // State to store the title of the blog being deleted
  const [deletingBlogTitle, setDeletingBlogTitle] = useState<string>('');

  // Fetch blogs with current filters
  const { blogs, refetchBlogs, createBlog, updateBlog } = useBlogs(apiFilters);

  // Fetch filter data once when component mounts
  const { categories } = useCategories();

  /**
   * Handles editing a blog
   * @param blogId The ID of the blog to edit
   */
  const handleEditBlog = useCallback((blogId: number) => {
    setEditingBlogId(blogId);
    setModalMode('edit');
    setIsBlogModalOpen(true);
  }, []);

  /**
   * Shows the add blog modal
   */
  const handleAddBlog = useCallback(() => {
    setEditingBlogId(null);
    setModalMode('create');
    setIsBlogModalOpen(true);
  }, []);

  /**
   * Handles closing the blog modal
   */
  const handleBlogModalClose = useCallback(() => {
    setIsBlogModalOpen(false);
    setTimeout(() => {
      setEditingBlogId(null);
    }, 300);
  }, []);

  /**
   * Callback when a blog is successfully created or updated
   */
  const handleBlogSuccess = useCallback(
    (data: any) => {
      if (modalMode === 'create') {
        createBlog(data);
      } else if (modalMode === 'edit' && editingBlogId) {
        updateBlog({ id: editingBlogId, data });
      }
      refetchBlogs();
      handleBlogModalClose();
    },
    [modalMode, editingBlogId, createBlog, updateBlog, refetchBlogs, handleBlogModalClose]
  );

  /**
   * Handles deleting a blog
   * @param blogId The ID of the blog to delete
   * @param blogTitle The title of the blog to delete
   */
  const handleDeleteBlog = useCallback((blogId: number, blogTitle: string) => {
    setDeletingBlogId(blogId);
    setDeletingBlogTitle(blogTitle);
    setIsDeleteBlogDialogOpen(true);
  }, []);

  /**
   * Handles closing the delete blog dialog
   */
  const handleDeleteBlogDialogClose = useCallback(() => {
    setIsDeleteBlogDialogOpen(false);
    setTimeout(() => {
      setDeletingBlogId(null);
      setDeletingBlogTitle('');
    }, 300);
  }, []);

  /**
   * Callback when a blog is successfully deleted
   */
  const handleDeleteBlogSuccess = useCallback(() => {
    refetchBlogs();
  }, [refetchBlogs]);

  /**
   * Handles direct filter changes (like from the FilterBar)
   */
  const handleDirectFilterChange = useCallback((column: string, value: any) => {
    setApiFilters(prev => {
      // If value is empty or undefined, remove the filter
      if (value === '' || value === undefined || value === null) {
        const newFilters: any = { ...prev };
        delete newFilters[column];
        return newFilters;
      }

      return {
        ...prev,
        [column]: value,
      };
    });
  }, []);

  const columns = createColumns(
    handleEditBlog,
    handleDeleteBlog, // onDelete
    true, // canUpdate
    true // canDelete
  );

  // Find the blog being edited
  const editingBlog = editingBlogId ? blogs?.find(blog => blog.id === editingBlogId) : null;

  return (
    <div
      className={`min-h-screen bg-white p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950 ${className || ''}`}
    >
      <div className="bg-white dark:bg-gray-950">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">Blogs</h1>
        <div className="mt-3 sm:mt-4 lg:mt-6">
          <BlogModal
            isOpen={isBlogModalOpen}
            onClose={handleBlogModalClose}
            onSubmit={handleBlogSuccess}
            blog={editingBlog}
            mode={modalMode}
          />

          <DeleteBlogDialog
            isOpen={isDeleteBlogDialogOpen}
            onClose={handleDeleteBlogDialogClose}
            blogId={deletingBlogId}
            blogTitle={deletingBlogTitle}
            onSuccess={handleDeleteBlogSuccess}
          />

          <FilterBar
            onAdd={handleAddBlog}
            onView={() => {
              // TODO: Implement view functionality
              console.log('View button clicked');
            }}
            onFilterChange={handleDirectFilterChange}
            searchValue={apiFilters.title || ''}
            sortBy={apiFilters.sortBy || 'createdAt'}
            sortOrder={apiFilters.sortOrder || 'desc'}
          />

          <DataTable columns={columns} data={blogs || []} showFilterbar={false} />
        </div>
      </div>
    </div>
  );
}
