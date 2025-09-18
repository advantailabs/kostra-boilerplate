/**
 * Edit User Modal for Admin Users Page
 * Allows admins to edit user details with a clean form layout
 */

import { Input } from '@/components/atom/Input';
import { Modal } from '@/components/molecules/common/Modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/molecules/common/Select';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { ADMIN_ROLES, UserRole } from '@/lib/constants/admin';
import { ModalEditUserProps } from '@/types/user';
import { useEffect, useState } from 'react';

export function ModalEditUser({ isOpen, onClose, user }: ModalEditUserProps) {
  const { updateUser, isUpdating } = useAdminUsers();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER' as UserRole,
    isOnboarded: false,
    credits: 0,
    stripeCustomerId: '',
    plan: 'FREE' as 'FREE' | 'PRO',
    isOverDue: false,
    planExpiringAt: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'USER',
        isOnboarded: user.isOnboarded ?? false,
        credits: user.credits || 0,
        stripeCustomerId: user.stripeCustomerId || '',
        plan: user.plan || 'FREE',
        isOverDue: user.isOverDue ?? false,
        planExpiringAt: user.planExpiringAt || '',
        password: '',
      });
      setErrors({});
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.credits < 0) {
      newErrors.credits = 'Credits cannot be negative';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!user || !validateForm()) return;

    try {
      await updateUser({
        userId: user.id,
        userData: {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          isOnboarded: formData.isOnboarded,
          credits: formData.credits,
          stripeCustomerId: formData.stripeCustomerId || undefined,
          plan: formData.plan,
          isOverDue: formData.isOverDue,
          planExpiringAt: formData.planExpiringAt || undefined,
          password: formData.password || undefined,
        },
      });
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      maxWidth="max-w-2xl"
      primaryActionText="Save changes"
      secondaryActionText="Close"
      onPrimaryAction={handleSubmit}
      isPrimaryActionLoading={isUpdating}
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        {/* New Password and Role */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              New Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => handleInputChange('password', e.target.value)}
              placeholder="Leave empty to keep current password"
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Role
            </label>
            <Select value={formData.role} onValueChange={value => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ADMIN_ROLES.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Plan and Plan Expiring Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="plan"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Plan
            </label>
            <Select value={formData.plan} onValueChange={value => handleInputChange('plan', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">FREE</SelectItem>
                <SelectItem value="PRO">PRO</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="planExpiringAt"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Plan Expiring Date
            </label>
            <Input
              id="planExpiringAt"
              type="datetime-local"
              value={
                formData.planExpiringAt
                  ? new Date(formData.planExpiringAt).toISOString().slice(0, 16)
                  : ''
              }
              onChange={e =>
                handleInputChange(
                  'planExpiringAt',
                  e.target.value ? new Date(e.target.value).toISOString() : ''
                )
              }
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Is Onboarded and Is Payment Due */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="isOnboarded"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Is Onboarded?
            </label>
            <Select
              value={formData.isOnboarded ? 'yes' : 'no'}
              onValueChange={value => handleInputChange('isOnboarded', value === 'yes')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="isOverDue"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Is Payment Due?
            </label>
            <Select
              value={formData.isOverDue ? 'yes' : 'no'}
              onValueChange={value => handleInputChange('isOverDue', value === 'yes')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Credits and Stripe Customer ID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="credits"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Credits
            </label>
            <Input
              id="credits"
              type="number"
              min="0"
              value={formData.credits}
              onChange={e => handleInputChange('credits', parseInt(e.target.value, 10) || 0)}
              className={errors.credits ? 'border-red-500' : ''}
            />
            {errors.credits && <p className="mt-1 text-sm text-red-600">{errors.credits}</p>}
          </div>

          <div>
            <label
              htmlFor="stripeCustomerId"
              className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Stripe Customer ID
            </label>
            <Input
              id="stripeCustomerId"
              type="text"
              value={formData.stripeCustomerId}
              onChange={e => handleInputChange('stripeCustomerId', e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Information Footer */}
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Created:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Current Role:</span>
              <span
                className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  user.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
