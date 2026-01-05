'use client';

import { CategoryResponseType } from '@/types/blog.type';
import { useCallback, useState } from 'react';
import { CategoriesTable } from './CategoriesTable';
import { CategoryModal } from './CategoryModal';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';

interface CategoriesPageProps {
  className?: string;
}

export function CategoriesPage({ className }: CategoriesPageProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponseType | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // State to control the visibility of the delete category dialog
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false);
  // State to store the ID of the category being deleted
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  // State to store the name of the category being deleted
  const [deletingCategoryName, setDeletingCategoryName] = useState<string>('');

  // State to track current page for delete context
  const [currentPage, setCurrentPage] = useState(1);

  const handleEditCategory = useCallback((category: { id: number; name: string; slug: string }) => {
    setEditingCategory(category as CategoryResponseType);
    setModalMode('edit');
    setIsCategoryModalOpen(true);
  }, []);

  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setModalMode('create');
    setIsCategoryModalOpen(true);
  }, []);

  const handleCategoryModalClose = useCallback(() => {
    setIsCategoryModalOpen(false);
    setTimeout(() => {
      setEditingCategory(null);
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

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className={className}>
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={handleCategoryModalClose}
        onSubmit={handleCategorySuccess}
        category={editingCategory}
        key={editingCategory ? editingCategory.id : ''}
        mode={modalMode}
        currentPage={currentPage}
      />

      <DeleteCategoryDialog
        isOpen={isDeleteCategoryDialogOpen}
        onClose={handleDeleteCategoryDialogClose}
        categoryId={deletingCategoryId}
        categoryName={deletingCategoryName}
        onSuccess={handleDeleteCategorySuccess}
        currentPage={currentPage}
      />

      <CategoriesTable
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
        onAdd={handleAddCategory}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
