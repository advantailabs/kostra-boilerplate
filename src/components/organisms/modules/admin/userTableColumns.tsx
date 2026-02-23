'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ADMIN_ROLES, ROLES } from '@/lib/constants/admin';
import type { User } from '@/types/user';

export interface UserTableMeta {
    onViewDetails?: (user: User) => void;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
    onRestore?: (user: User) => void;
    onRoleChange?: (userId: number, newRole: string) => void;
    currentUserId?: string | number;
    restoreUser?: (userId: number) => Promise<void>;
    isRestoring?: boolean;
}

export function getUserRoleForDisplay(role: string): string {
    return role === ROLES.ADMIN ? ROLES.ADMIN : ROLES.USER;
}

export function getPlanBadgeVariant(plan: string): 'default' | 'outline' {
    return plan === 'PRO' ? 'default' : 'outline';
}

export function getOnboardingBadgeVariant(isOnboarded: boolean): 'success' | 'warning' {
    return isOnboarded ? 'success' : 'warning';
}

function isCurrentUser(user: User, currentUserId?: string | number): boolean {
    if (currentUserId == null) return false;
    return user.id.toString() === currentUserId.toString();
}

export const userTableColumns: ColumnDef<User>[] = [
    {
        id: 'user',
        header: 'User',
        accessorKey: 'name',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-x-3 truncate py-1">
                    {user.profilePicture ? (
                        <Image
                            src={user.profilePicture}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="size-8 shrink-0 rounded-full border border-border object-cover"
                        />
                    ) : (
                        <span
                            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs text-text"
                            aria-hidden="true"
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                    <div className="truncate">
                        <p className="truncate text-sm font-medium text-text">{user.name}</p>
                        <p className="truncate text-xs text-text-muted">{user.email}</p>
                    </div>
                </div>
            );
        },
    },
    {
        id: 'role',
        header: 'Role',
        accessorKey: 'role',
        cell: ({ row, table }) => {
            const user = row.original;
            const meta = table.options.meta as UserTableMeta | undefined;
            const disabled =
                isCurrentUser(user, meta?.currentUserId) || Boolean(user.deletedAt);
            return (
                <div className="py-1" onClick={e => e.stopPropagation()}>
                    <Select
                        value={getUserRoleForDisplay(user.role)}
                        onValueChange={value => meta?.onRoleChange?.(user.id, value)}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-8 w-24">
                            <SelectValue placeholder="Role" />
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
            );
        },
    },
    {
        id: 'plan',
        header: 'Plan',
        accessorKey: 'plan',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="py-1">
                    <Badge variant={getPlanBadgeVariant(user.plan)}>{user.plan}</Badge>
                </div>
            );
        },
    },
    {
        id: 'onboarding',
        header: 'Onboarding',
        accessorFn: row => row.isOnboarded,
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="py-1">
                    <Badge variant={getOnboardingBadgeVariant(user.isOnboarded)}>
                        {user.isOnboarded ? 'Onboarded' : 'Pending'}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: 'credits',
        header: 'Credits',
        accessorKey: 'credits',
        cell: ({ row }) => (
            <div className="py-1 text-sm font-medium text-text">
                {row.original.credits} Credits
            </div>
        ),
    },
    {
        id: 'joined',
        header: 'Joined',
        accessorKey: 'createdAt',
        cell: ({ row }) => {
            const createdAt = row.original.createdAt;
            const formatted =
                createdAt && !Number.isNaN(new Date(createdAt).getTime())
                    ? new Date(createdAt).toLocaleDateString()
                    : 'N/A';
            return (
                <div className="py-1">
                    {/* <div className="text-xs text-text-muted">Joined:</div> */}
                    <div className="text-sm text-text-muted">{formatted}</div>
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row, table }) => {
            const user = row.original;
            const meta = table.options.meta as UserTableMeta | undefined;
            const currentUser = isCurrentUser(user, meta?.currentUserId);

            return (
                <div
                    className="flex justify-end gap-2 py-1"
                    onClick={e => e.stopPropagation()}
                >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="group size-8 data-[state=open]:border-border data-[state=open]:bg-background hover:border hover:border-border hover:bg-background"
                            >
                                <MoreVertical
                                    className="size-4 shrink-0 text-text-muted group-hover:text-text"
                                    aria-hidden="true"
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                                onClick={e => {
                                    e.stopPropagation();
                                    meta?.onViewDetails?.(user);
                                }}
                            >
                                View details
                            </DropdownMenuItem>
                            {user.deletedAt ? (
                                <DropdownMenuItem
                                    onClick={async e => {
                                        e.stopPropagation();
                                        if (meta?.onRestore) {
                                            meta.onRestore(user);
                                        } else if (meta?.restoreUser) {
                                            await meta.restoreUser(user.id);
                                        }
                                    }}
                                >
                                    {meta?.isRestoring ? 'Restoring...' : 'Restore user'}
                                </DropdownMenuItem>
                            ) : (
                                <>
                                    <DropdownMenuItem
                                        onClick={e => {
                                            e.stopPropagation();
                                            meta?.onEdit?.(user);
                                        }}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 dark:text-red-400 focus:dark:text-red-400"
                                        disabled={currentUser}
                                        onClick={e => {
                                            e.stopPropagation();
                                            meta?.onDelete?.(user);
                                        }}
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        enableSorting: false,
    },
];
