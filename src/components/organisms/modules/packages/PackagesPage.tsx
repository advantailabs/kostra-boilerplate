'use client';

import { useCallback, useState } from 'react';
import { DeletePackageDialog } from './DeletePackageDialog';
import { PackageModal } from './PackageModal';
import { PackagesTable } from './PackagesTable';

interface Package {
  id: number;
  title: string;
  description: string;
  isFeatured: boolean;
  price: number | string; // Can be number from API or Decimal string from DB
  currencySymbol: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

interface PackagesPageProps {
  className?: string;
}

export function PackagesPage({ className }: PackagesPageProps) {
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // State to control the visibility of the delete package dialog
  const [isDeletePackageDialogOpen, setIsDeletePackageDialogOpen] = useState(false);
  // State to store the ID of the package being deleted
  const [deletingPackageId, setDeletingPackageId] = useState<number | null>(null);
  // State to store the title of the package being deleted
  const [deletingPackageTitle, setDeletingPackageTitle] = useState<string>('');

  // State to track current page for delete context
  const [currentPage, setCurrentPage] = useState(1);

  const handleEditPackage = useCallback((pkg: Package) => {
    setEditingPackage(pkg);
    setModalMode('edit');
    setIsPackageModalOpen(true);
  }, []);

  const handleAddPackage = useCallback(() => {
    setEditingPackage(null);
    setModalMode('create');
    setIsPackageModalOpen(true);
  }, []);

  const handlePackageModalClose = useCallback(() => {
    setIsPackageModalOpen(false);
    setTimeout(() => {
      setEditingPackage(null);
    }, 300);
  }, []);

  const handlePackageSuccess = useCallback(() => {
    handlePackageModalClose();
  }, [handlePackageModalClose]);

  /**
   * Handles deleting a package
   * @param packageId The ID of the package to delete
   * @param packageTitle The title of the package to delete
   */
  const handleDeletePackage = useCallback((packageId: number, packageTitle: string) => {
    setDeletingPackageId(packageId);
    setDeletingPackageTitle(packageTitle);
    setIsDeletePackageDialogOpen(true);
  }, []);

  /**
   * Handles closing the delete package dialog
   */
  const handleDeletePackageDialogClose = useCallback(() => {
    setIsDeletePackageDialogOpen(false);
    setTimeout(() => {
      setDeletingPackageId(null);
      setDeletingPackageTitle('');
    }, 300);
  }, []);

  /**
   * Callback when a package is successfully deleted
   */
  const handleDeletePackageSuccess = useCallback(() => {
    // Refetch packages data
    // Note: This would need to be implemented in the hook
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className={className}>
      <PackageModal
        isOpen={isPackageModalOpen}
        onClose={handlePackageModalClose}
        onSubmit={handlePackageSuccess}
        package={editingPackage}
        key={editingPackage ? editingPackage.id : ''} // when key changes, component is destroyed and remounted, negating need for useEffect to set editing or create form data
        mode={modalMode}
        currentPage={currentPage}
      />

      <DeletePackageDialog
        isOpen={isDeletePackageDialogOpen}
        onClose={handleDeletePackageDialogClose}
        packageId={deletingPackageId}
        packageTitle={deletingPackageTitle}
        onSuccess={handleDeletePackageSuccess}
        currentPage={currentPage}
      />

      <PackagesTable
        onEdit={handleEditPackage}
        onDelete={handleDeletePackage}
        onAdd={handleAddPackage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
