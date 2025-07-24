/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    displayName: string;
  }
}
