'use client';

import { BlogGrid } from '@/components/molecules/blogs/BlogGrid';
import { PageHeaderWithAction } from '@/components/molecules/common/PageHeaderWithAction';
import { Pagination } from '@/components/molecules/common/Pagination';
import { UnifiedSearchBar } from '@/components/molecules/common/UnifiedSearchBar';
import { useBlogs } from '@/hooks/useBlogs';
import { CreateBlogInput, UpdateBlogInput } from '@/schemas/blog.schema';
import { useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { BlogModal } from './BlogModal';
import { DeleteBlogDialog } from './DeleteBlogDialog';

interface BlogsPageProps {
  className?: string;
}

export function BlogsPage({ className }: BlogsPageProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // State for search input (immediate UI updates)
  const [searchInput, setSearchInput] = useState('');

  // Debounced search value (used for API calls)
  const [debouncedSearch] = useDebounce(searchInput, 400);

  // State to store filter values for the API (currently only used for non-search filters)
  const [apiFilters] = useState<{
    title?: string;
    published?: boolean;
    categoryId?: number;
  }>({});

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

  // Fetch blogs with current filters and pagination
  const {
    blogs,
    pagination,
    isBlogsLoading,
    createBlog,
    updateBlog,
    deleteBlog,
    isDeleting,
    isCreating,
    isUpdating,
  } = useBlogs({
    ...apiFilters,
    title: debouncedSearch || undefined,
    page: currentPage,
    limit: pageSize,
  });

  /**
   * Handles editing a blog
   * @param blog The blog object to edit
   */
  const handleEditBlog = useCallback((blog: { id: number; title: string; slug: string }) => {
    setEditingBlogId(blog.id);
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
      setModalMode('create'); // Reset to create mode when modal is closed
    }, 300);
  }, []);

  /**
   * Callback when a blog is successfully created or updated
   */
  const handleBlogSuccess = useCallback(
    async (data: CreateBlogInput | UpdateBlogInput) => {
      try {
        if (modalMode === 'create') {
          await createBlog(data);
        } else if (modalMode === 'edit' && editingBlogId) {
          await updateBlog({ id: editingBlogId, data });
        }
        handleBlogModalClose();
      } catch (error) {
        console.error('Error in blog operation:', error);
        // Don't close modal on error, let user retry
      }
    },
    [modalMode, editingBlogId, createBlog, updateBlog, handleBlogModalClose]
  );

  /**
   * Handles deleting a blog
   * @param blog The blog object to delete
   */
  const handleDeleteBlog = useCallback((blog: { id: number; title: string }) => {
    setDeletingBlogId(blog.id);
    setDeletingBlogTitle(blog.title);
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
    // No need to refetch here - useApiMutation already handles invalidation
  }, []);

  /**
   * Handles page changes for pagination
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /**
   * Handles search input changes
   */
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    // Reset to first page when search changes
    setCurrentPage(1);
  }, []);

  // Handle blog click for editing
  const handleBlogClick = useCallback(
    (blog: { id: number; title: string; slug: string }) => {
      handleEditBlog(blog);
    },
    [handleEditBlog]
  );

  // Find the blog being edited
  const editingBlog = editingBlogId ? blogs?.find(blog => blog.id === editingBlogId) : null;

  const loadingMessage = debouncedSearch ? 'Searching...' : 'Loading blogs...';

  return (
    <div className={`min-h-screen ${className || ''}`}>
      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={handleBlogModalClose}
        onSubmit={handleBlogSuccess}
        blog={editingBlog}
        mode={modalMode}
        isCreating={isCreating}
        isUpdating={isUpdating}
      />

      <DeleteBlogDialog
        isOpen={isDeleteBlogDialogOpen}
        onClose={handleDeleteBlogDialogClose}
        blogId={deletingBlogId}
        blogTitle={deletingBlogTitle}
        onSuccess={handleDeleteBlogSuccess}
        deleteBlog={deleteBlog}
        isDeleting={isDeleting}
      />

      <PageHeaderWithAction
        title="Blogs"
        description="Create or Edit Blogs"
        onAdd={handleAddBlog}
        addButtonText="New"
      />

      <div className="h-[calc(100%-4rem)] p-4 space-y-4 max-sm:p-3 overflow-y-auto">
        <UnifiedSearchBar
          placeholder="Search by title..."
          value={searchInput}
          onChange={handleSearchChange}
        />

        {isBlogsLoading ? (
          <div className="flex h-[calc(100%-4rem)] flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-text-muted">{loadingMessage}</p>
          </div>
        ) : (
          <>
            <BlogGrid
              searchInput={debouncedSearch || ''}
              blogs={blogs || []}
              onEdit={handleEditBlog}
              onDelete={handleDeleteBlog}
              onBlogClick={handleBlogClick}
              className=""
            />

            {pagination && (
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
