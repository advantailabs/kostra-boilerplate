"use client"

import type {
    OnChangeFn,
    RowSelectionState,
} from '@tanstack/react-table'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    meta?: Record<string, unknown>
    rowSelection?: RowSelectionState
    onRowSelectionChange?: OnChangeFn<RowSelectionState>
    emptyMessage?: string
    isLoading?: boolean
    loadingMessage?: string
}

export function DataTable<TData, TValue>({
    columns,
    data,
    meta,
    rowSelection,
    onRowSelectionChange,
    emptyMessage = 'No results.',
    isLoading,
    loadingMessage,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta,
        onRowSelectionChange,
        state: {
            ...(rowSelection !== undefined && { rowSelection }),
        },
    })

    return (
        <div className="overflow-hidden rounded-xl border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => {
                            const tableMeta = table.options.meta as {
                                onEdit?: (data: TData) => void
                            } | undefined
                            return (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    onClick={() =>
                                        tableMeta?.onEdit?.(row.original)
                                    }
                                    className={
                                        tableMeta?.onEdit
                                            ? 'cursor-pointer'
                                            : undefined
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            )
                        })
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center text-text-muted!"
                            >
                                {isLoading && loadingMessage ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <span className="text-sm text-text-muted">
                                            {loadingMessage}
                                        </span>
                                    </div>
                                ) : (
                                    emptyMessage
                                )}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}