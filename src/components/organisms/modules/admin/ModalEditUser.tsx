/**
 * Edit User Modal for Admin Users Page
 * Allows admins to edit user details with a clean form layout
 */

import { Modal } from '@/components/molecules/common/Modal';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { ADMIN_ROLES, UserRole } from '@/lib/constants/admin';
import { ModalEditUserProps } from '@/types/user';
import { useState } from 'react';

type PlanOption = { value: 'FREE' | 'PRO'; label: string };
const PLAN_OPTIONS: PlanOption[] = [
  { value: 'FREE', label: 'FREE' },
  { value: 'PRO', label: 'PRO' },
];

const YES_NO_OPTIONS = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
];

export function ModalEditUser({ isOpen, onClose, user }: ModalEditUserProps) {
  const { updateUser, isUpdating } = useAdminUsers();

  const initializeFormData = () => {
    if (user) {
      return {
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
      }
    } return {
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
    }
  }

  const [formData, setFormData] = useState(initializeFormData);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: unknown) => {
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
      maxWidth="max-w-2xl!"
      primaryActionText="Save changes"
      secondaryActionText="Close"
      onPrimaryAction={handleSubmit}
      isPrimaryActionLoading={isUpdating}
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <FieldContent>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <FieldContent>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                aria-invalid={!!errors.email}
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </FieldContent>
          </Field>
        </div>

        {/* New Password and Role */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <FieldContent>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                placeholder="Leave empty to keep current password"
                aria-invalid={!!errors.password}
              />
              {errors.password && <FieldError>{errors.password}</FieldError>}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <Combobox
              id="role"
              items={ADMIN_ROLES}
              value={ADMIN_ROLES.find(o => o.value === formData.role)}
              onValueChange={item => handleInputChange('role', item?.value)}
              itemToStringValue={item => item.label}
            >
              <ComboboxInput placeholder="Select role" />
              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {item => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        </div>

        {/* Plan and Plan Expiring Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="plan">Plan</FieldLabel>
            <Combobox<PlanOption>
              id="plan"
              items={PLAN_OPTIONS}
              value={PLAN_OPTIONS.find(o => o.value === formData.plan) ?? undefined}
              onValueChange={item => handleInputChange('plan', item?.value)}
              itemToStringValue={item => item.label}
            >
              <ComboboxInput placeholder="Select plan" />
              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {item => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Field>
            <FieldLabel htmlFor="planExpiringAt">Plan Expiring Date</FieldLabel>
            <FieldContent>
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
            </FieldContent>
          </Field>
        </div>

        {/* Is Onboarded and Is Payment Due */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="isOnboarded">Is Onboarded?</FieldLabel>
            <Combobox
              id="isOnboarded"
              items={YES_NO_OPTIONS}
              value={YES_NO_OPTIONS.find(o => o.value === (formData.isOnboarded ? 'yes' : 'no'))}
              onValueChange={item => handleInputChange('isOnboarded', item?.value === 'yes')}
              itemToStringValue={item => item.label}
            >
              <ComboboxInput placeholder="Select status" />
              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {item => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>

          <Field>
            <FieldLabel htmlFor="isOverDue">Is Payment Due?</FieldLabel>
            <Combobox
              id="isOverDue"
              items={YES_NO_OPTIONS}
              value={YES_NO_OPTIONS.find(o => o.value === (formData.isOverDue ? 'yes' : 'no'))}
              onValueChange={item => handleInputChange('isOverDue', item?.value === 'yes')}
              itemToStringValue={item => item.label}
            >
              <ComboboxInput placeholder="Select payment status" />
              <ComboboxContent className="pointer-events-auto">
                <ComboboxEmpty>No items found.</ComboboxEmpty>
                <ComboboxList>
                  {item => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </Field>
        </div>

        {/* Credits and Stripe Customer ID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="credits">Credits</FieldLabel>
            <FieldContent>
              <Input
                id="credits"
                type="number"
                min={0}
                value={formData.credits}
                onChange={e => handleInputChange('credits', parseInt(e.target.value, 10) || 0)}
                aria-invalid={!!errors.credits}
              />
              {errors.credits && <FieldError>{errors.credits}</FieldError>}
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="stripeCustomerId">Stripe Customer ID</FieldLabel>
            <FieldContent>
              <Input
                id="stripeCustomerId"
                type="text"
                value={formData.stripeCustomerId}
                onChange={e => handleInputChange('stripeCustomerId', e.target.value)}
                placeholder="Optional"
              />
            </FieldContent>
          </Field>
        </div>

        {/* Information Footer */}
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <div>
              <span className="">Created:</span>
              <span className="ml-2 text-text-muted">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="">Last Updated:</span>
              <span className="ml-2 text-text-muted">
                {new Date(user.updatedAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="">Current Role:</span>
              <Badge
                variant={user.role === 'ADMIN' ? 'default' : 'info'}
                className="ml-2"
              >
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
