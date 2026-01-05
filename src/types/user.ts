/**
 * User-related types and interfaces
 * Centralized location for all user-related type definitions
 */

import { UserRole } from '@/lib/constants/admin';

// ============================================================================
// Base User Types
// ============================================================================

/**
 * Extended user interface for admin operations
 * Matches the structure used in useAdminUsers hook
 */
export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  role: UserRole;
  isOnboarded: boolean;
  credits: number;
  plan: 'FREE' | 'PRO';
  stripeCustomerId?: string;
  isOverDue?: boolean;
  planExpiringAt?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * User interface for profile picture component
 * Minimal interface for displaying user profile information
 */
export interface UserProfile {
  name: string;
  profilePicture?: string | null;
}

/**
 * User interface for authentication store
 * Matches the structure used in the auth store
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  profilePicture: string | null;
  role: string;
  isOnboarded: boolean;
  credits?: number;
  plan?: string;
  isOverdue?: boolean;
  planExpiringAt?: string | null;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for UserProfilePicture component
 */
export interface UserProfilePictureProps {
  user: UserProfile;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Props for UserDetailsList component
 */
export interface UserDetailsListProps {
  user: User;
  className?: string;
}

/**
 * Props for ModalUserDetails component
 */
export interface ModalUserDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

/**
 * Props for ModalDeleteUser component
 */
export interface ModalDeleteUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
}

/**
 * Props for ModalAddUser component
 */
export interface ModalAddUserProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Props for ModalEditUser component
 */
export interface ModalEditUserProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request data for creating a new user
 */
export interface CreateUserRequest {
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Request data for updating a user
 */
export interface UpdateUserRequest {
  userId: number;
  userData: {
    role?: UserRole;
    name?: string;
    email?: string;
    profilePicture?: string;
    isOnboarded?: boolean;
    credits?: number;
    plan?: 'FREE' | 'PRO';
  };
}

/**
 * Response data for user operations
 */
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  profilePicture?: string | null;
  role: UserRole;
  isOnboarded: boolean;
  credits: number;
  plan: 'FREE' | 'PRO';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

/**
 * Return type for useAdminUsers hook
 */
export interface UseAdminUsersReturn {
  users: User[];
  isLoading: boolean;
  createUser: (data: CreateUserRequest) => Promise<void>;
  updateUser: (data: UpdateUserRequest) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  restoreUser: (userId: number) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isRestoring: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Size options for user profile pictures
 */
export type ProfilePictureSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * User plan types
 */
export type UserPlan = 'FREE' | 'PRO';

/**
 * User onboarding status
 */
export type OnboardingStatus = 'pending' | 'completed';

// ============================================================================
// Form Types
// ============================================================================

/**
 * User form data for editing
 */
export interface UserFormData {
  name: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  credits: number;
  isOnboarded: boolean;
}

/**
 * User form validation errors
 */
export interface UserFormErrors {
  name?: string;
  email?: string;
  role?: string;
  plan?: string;
  credits?: string;
  isOnboarded?: string;
}

// ============================================================================
// Route Protection Types
// ============================================================================

/**
 * Route access validation result
 */
export interface RouteAccessResult {
  canAccess: boolean;
  redirectTo?: string;
}

/**
 * Route protection hook return type
 */
export interface UseRouteProtectionReturn {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  canAccessCurrentRoute: boolean;
}

export interface UserSelection {
  id: number;
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
  deletedAt?: string | null;
}

export interface UserSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_users: UserSelection[]) => void;
  allUsers: UserSelection[];
  selectedUsers: UserSelection[];
  isLoading: boolean;
}
