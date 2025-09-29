import { zodResolver } from '@hookform/resolvers/zod';
// React import not needed as we use hooks directly; remove empty import
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';

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
import { createUserSchema } from '@/validations/admin';

export type ModalAddUserProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormData = {
  email: string;
  password: string;
  role: string; // keep as string for empty default, validated by schema
};

export function ModalAddUser({ isOpen, onClose }: ModalAddUserProps) {
  const { createUser, isCreating } = useAdminUsers();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createUserSchema) as any,
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      role: '',
    },
  });

  const emailVal = watch('email');
  const passwordVal = watch('password');
  const roleVal = watch('role');
  const isAllFieldsPresent = Boolean(emailVal && passwordVal && roleVal);

  const onSubmit: SubmitHandler<FormData> = async data => {
    try {
      await createUser({
        email: data.email,
        password: data.password,
        role: data.role as UserRole,
      });
      reset();
      onClose();
    } catch {
      // Error toast is handled inside the hook; prevent unhandled rejection
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New User"
      maxWidth="max-w-md"
      primaryActionText="Add User"
      secondaryActionText="Cancel"
      onPrimaryAction={handleSubmit(onSubmit)}
      isPrimaryActionDisabled={!isAllFieldsPresent}
      isPrimaryActionLoading={isCreating}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="font-medium">
            Email Address
          </Label>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className="mt-2"
                  required
                />
                {errors.email && (
                  <span className="mt-1 text-sm text-red-500">{errors.email.message}</span>
                )}
              </>
            )}
          />
        </div>

        <div>
          <Label htmlFor="password" className="font-medium">
            Password
          </Label>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a strong password"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className="mt-2"
                  required
                />
                {errors.password && (
                  <span className="mt-1 text-sm text-red-500">{errors.password.message}</span>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters with uppercase, lowercase, number, and
                  special character.
                </p>
              </>
            )}
          />
        </div>

        <div>
          <Label htmlFor="role" className="font-medium">
            Role
          </Label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <>
                <Select value={field.value ?? ''} onValueChange={field.onChange}>
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
                {errors.role && (
                  <span className="mt-1 text-sm text-red-500">{errors.role.message}</span>
                )}
              </>
            )}
          />
        </div>
      </form>
    </Modal>
  );
}
