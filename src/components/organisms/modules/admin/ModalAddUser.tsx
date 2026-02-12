import { zodResolver } from '@hookform/resolvers/zod';
// React import not needed as we use hooks directly; remove empty import
import { Controller, useForm, useWatch, type SubmitHandler } from 'react-hook-form';

import { Modal } from '@/components/molecules/common/Modal';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  role: UserRole | undefined; // keep as string for empty default, validated by schema
};

export function ModalAddUser({ isOpen, onClose }: ModalAddUserProps) {
  const { createUser, isCreating } = useAdminUsers();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<typeof createUserSchema._type>({
    resolver: zodResolver(createUserSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      role: undefined,
    },
  });

  const emailVal = useWatch({ control, name: 'email' });
  const passwordVal = useWatch({ control, name: 'password' });
  const roleVal = useWatch({ control, name: 'role' });
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
      maxWidth="max-w-md!"
      primaryActionText="Add User"
      secondaryActionText="Cancel"
      onPrimaryAction={handleSubmit(onSubmit)}
      isPrimaryActionDisabled={!isAllFieldsPresent}
      isPrimaryActionLoading={isCreating}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </FieldLabel>
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
                  className=""
                  required
                />
                <FieldError errors={errors.email ? [{ message: errors.email.message }] : undefined} />
              </>
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">
            Password <span className="text-destructive">*</span>
          </FieldLabel>
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
                  className=""
                  required
                />
                <FieldError errors={errors.password ? [{ message: errors.password.message }] : undefined} />
                <FieldDescription>
                  Password must be at least 8 characters with uppercase, lowercase, number, and
                  special character.
                </FieldDescription>
              </>
            )}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="role">
            Role <span className="text-destructive">*</span>
          </FieldLabel>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <>
                <Select
                  value={field.value ?? ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="role" className="w-full">
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
                <FieldError errors={errors.role ? [{ message: errors.role.message }] : undefined} />
              </>
            )}
          />
        </Field>
      </form>
    </Modal>
  );
}
