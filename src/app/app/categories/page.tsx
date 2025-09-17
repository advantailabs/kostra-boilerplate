'use client';

import { CategoriesPage } from '@/components/organisms/modules/categories/CategoriesPage';
import { useRouteProtection } from '@/hooks/useRouteProtection';

export default function Categories() {
  // Protect this admin-only page
  useRouteProtection();
  
  return <CategoriesPage />;
}
