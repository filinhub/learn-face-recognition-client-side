import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import * as React from 'react';
import { FiList } from 'react-icons/fi';

import clsxm from '@/lib/clsxm';

import Filter from '@/components/table/Filter';
import PaginationControl from '@/components/table/PaginationControl';
import TBody from '@/components/table/TBody';
import THead from '@/components/table/THead';
import TOption from '@/components/table/TOption';
import Typography from '@/components/typography/Typography';

import { PaginatedApiResponse } from '@/types/api';

export type ServerTableState = {
  globalFilter: string;
  pagination: PaginationState;
  sorting: SortingState;
};

type SetServerTableState = {
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};

type ServerTableProps<T extends object> = {
  columns: ColumnDef<T>[];
  data: T[];
  header?: React.ReactNode;
  isLoading: boolean;
  meta: PaginatedApiResponse<T>['meta'] | undefined;
  tableState: ServerTableState;
  setTableState: SetServerTableState;
  omitSort?: boolean;
  withFilter?: boolean;
  /**Title : A descriptive title for the table (e.g. User Table)*/
  title?: string;
  /**Description : A descriptive body text comes here */
  description?: string;
} & React.ComponentPropsWithoutRef<'div'>;

export default function ServerTable<T extends object>({
  className,
  columns,
  data,
  header: Header,
  isLoading,
  meta,
  tableState,
  setTableState,
  omitSort = false,
  withFilter = false,
  title = 'Table',
  description = 'A descriptive body text comes here',
  ...rest
}: ServerTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    pageCount: meta?.last_page,
    state: {
      ...tableState,
    },
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    onGlobalFilterChange: setTableState.setGlobalFilter,
    onPaginationChange: setTableState.setPagination,
    onSortingChange: setTableState.setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className={clsxm('flex flex-col ', className)} {...rest}>
      <pre>{JSON.stringify({ isLoading }, null, 2)}</pre>
      <div
        className={clsx(
          '-mx-4 sm:-mx-6 md:-mx-0',
          'flex flex-col items-stretch gap-3 sm:flex-row',
          withFilter ? 'sm:justify-between' : 'sm:justify-end',
          'rounded-t-xl bg-base-1000 px-6 py-5',
          'border border-white'
        )}
      >
        <div>
          <Typography variant='h3' as='h3' color='primary'>
            {title}
          </Typography>
          <Typography variant='b3' color='tertiary'>
            {description}
          </Typography>
        </div>
        <div className='flex flex-col-reverse gap-3 md:flex-row md:items-center'>
          <div className='flex items-center gap-3'>
            <TOption
              icon={<FiList />}
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 25].map((page) => (
                <option key={page} value={page}>
                  {page} Entries
                </option>
              ))}
            </TOption>
            {Header}
          </div>
          {withFilter && <Filter table={table} />}
        </div>
      </div>
      <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
          <div className='overflow-hidden border-x border-white shadow ring-1 ring-black ring-opacity-5'>
            <table className='min-w-full'>
              <THead table={table} omitSort={omitSort} />
              <TBody table={table} isLoading={isLoading} />
            </table>
          </div>
        </div>
      </div>

      <PaginationControl
        table={table}
        data={data}
        className='border border-white'
      />
    </div>
  );
}
