import { useState } from 'react';

import { Input } from '@/components/atom/Input';
import { Label } from '@/components/atom/Label';
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

export type ModalAddUserProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ModalAddUser({ isOpen, onClose }: ModalAddUserProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [errors, setErrors] = useState<string[]>([]);
  const { createUser, isCreating } = useAdminUsers();

  const handleSubmit = async () => {
    setErrors([]);

    if (!email.trim() || !password.trim() || !role) {
      setErrors(['All fields are required']);
      return;
    }

    try {
      await createUser({
        email: email.trim(),
        password: password.trim(),
        role: role as UserRole,
      });
      setEmail('');
      setPassword('');
      setRole('');
      onClose();
    } catch (error: any) {
      if (error.message && error.message.includes('Invalid password')) {
        setErrors(error.details || ['Invalid password']);
      } else {
        setErrors([error.message || 'Failed to create user']);
      }
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setRole('');
    setErrors([]);
    onClose();
  };

  const handleRoleChange = (value: string) => {
    setRole(value as UserRole);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New User"
      maxWidth="max-w-md"
      primaryActionText="Add User"
      secondaryActionText="Cancel"
      onPrimaryAction={handleSubmit}
      isPrimaryActionDisabled={!email.trim() || !password.trim() || !role}
      isPrimaryActionLoading={isCreating}
    >
      <div className="space-y-4">
        {errors.length > 0 && (
          <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
            <div className="text-sm text-red-800 dark:text-red-200">
              <ul className="list-inside list-disc space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="email" className="font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter a strong password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-2"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters with uppercase, lowercase, number, and special
            character.
          </p>
        </div>

        <div>
          <Label htmlFor="role" className="font-medium">
            Role
          </Label>
          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger id="role" className="mt-2">
              <SelectValue placeholder="Select a role..." />
            </SelectTrigger>
            <SelectContent>
              {ADMIN_ROLES.map(roleOption => (
                <SelectItem key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
