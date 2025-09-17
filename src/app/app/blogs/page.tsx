'use client';

import { BlogsPage } from '@/components/organisms/modules/blogs/BlogsPage';
import { useRouteProtection } from '@/hooks/useRouteProtection';

export default function Blogs() {
  // Protect this admin-only page
  useRouteProtection();
  
  return <BlogsPage />;
}
