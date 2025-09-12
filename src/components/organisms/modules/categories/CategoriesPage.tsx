'use client';

import { DataTable } from '@/components/organisms/shared/data-table/DataTable';
import { useCategories } from '@/hooks/useCategories';
import { useCallback, useState } from 'react';
import { CategoryModal } from './CategoryModal';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { FilterBar } from './FilterBar';
import { createColumns } from './TableColumns';

interface CategoriesPageProps {
  className?: string;
}

export function CategoriesPage({ className }: CategoriesPageProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // State to control the visibility of the delete category dialog
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  // State to store the ID of the category being deleted
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  // State to store the name of the category being deleted
  const [deletingCategoryName, setDeletingCategoryName] = useState<string>('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { categories, pagination } = useCategories({
    page: currentPage,
    limit: pageSize,
  });

  const handleEditCategory = useCallback((categoryId: number) => {
    setEditingCategoryId(categoryId);
    setModalMode('edit');
    setIsCategoryModalOpen(true);
  }, []);

  const handleAddCategory = useCallback(() => {
    setEditingCategoryId(null);
    setModalMode('create');
    setIsCategoryModalOpen(true);
  }, []);

  const handleCategoryModalClose = useCallback(() => {
    setIsCategoryModalOpen(false);
    setTimeout(() => {
      setEditingCategoryId(null);
    }, 300);
  }, []);

  const handleCategorySuccess = useCallback(() => {
    handleCategoryModalClose();
  }, [handleCategoryModalClose]);

  /**
   * Handles deleting a category
   * @param categoryId The ID of the category to delete
   * @param categoryName The name of the category to delete
   */
  const handleDeleteCategory = useCallback((categoryId: number, categoryName: string) => {
    setDeletingCategoryId(categoryId);
    setDeletingCategoryName(categoryName);
    setIsDeleteCategoryDialogOpen(true);
  }, []);

  /**
   * Handles closing the delete category dialog
   */
  const handleDeleteCategoryDialogClose = useCallback(() => {
    setIsDeleteCategoryDialogOpen(false);
    setTimeout(() => {
      setDeletingCategoryId(null);
      setDeletingCategoryName('');
    }, 300);
  }, []);

  /**
   * Callback when a category is successfully deleted
   */
  const handleDeleteCategorySuccess = useCallback(() => {
    // Refetch categories data
    // Note: This would need to be implemented in the hook
  }, []);

  /**
   * Handles direct filter changes (like from the FilterBar)
   */
  const handleDirectFilterChange = useCallback((column: string, value: any) => {
    // Reset to first page when filters change
    setCurrentPage(1);
  }, []);

  /**
   * Handles page changes
   */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const columns = createColumns(
    handleEditCategory,
    handleDeleteCategory,
    true, // canUpdate
    true // canDelete
  );

  // Find the category being edited
  const editingCategory = editingCategoryId
    ? categories?.find(cat => cat.id === editingCategoryId)
    : null;

  return (
    <div
      className={`min-h-screen bg-white p-4 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pt-7 dark:bg-gray-950 ${className || ''}`}
    >
      <div className="bg-white dark:bg-gray-950">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Categories</h1>
        <div className="mt-3 sm:mt-4 lg:mt-6">
          <CategoryModal
            isOpen={isCategoryModalOpen}
            onClose={handleCategoryModalClose}
            onSubmit={handleCategorySuccess}
            category={editingCategory}
            mode={modalMode}
          />

          <DeleteCategoryDialog
            isOpen={isDeleteCategoryDialogOpen}
            onClose={handleDeleteCategoryDialogClose}
            categoryId={deletingCategoryId}
            categoryName={deletingCategoryName}
            onSuccess={handleDeleteCategorySuccess}
          />

          <FilterBar
            onAdd={handleAddCategory}
            onView={() => {
              // TODO: Implement view functionality
            }}
            onFilterChange={handleDirectFilterChange}
            searchValue=""
          />

          <DataTable
            columns={columns}
            data={categories || []}
            showFilterbar={false}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
