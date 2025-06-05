'use client';

import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronsUpDown, Search } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
export const columns = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Date
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='font-medium'>{row.getValue('date')}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Name
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'bay',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Bay
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='text-center'>{row.getValue('bay')}</div>,
  },
  {
    accessorKey: 'hours',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          # of Hours
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='text-center'>{row.getValue('hours')}</div>,
  },
  {
    accessorKey: 'startTime',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Start Time
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('startTime')}</div>,
  },
  {
    accessorKey: 'endTime',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          End Time
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('endTime')}</div>,
  },
  {
    accessorKey: 'players',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Player(s)
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='text-center'>{row.getValue('players')}</div>,
  },
  {
    accessorKey: 'members',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Member(s)
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='text-center'>{row.getValue('members')}</div>,
  },
  {
    accessorKey: 'guests',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Guest(s)
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='text-center'>{row.getValue('guests')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const booking = row.original;

      return (
        <Button
          variant='destructive'
          size='sm'
          onClick={() => {
            // Handle delete action
            console.log('Delete booking:', booking.id);
          }}
        >
          Delete
        </Button>
      );
    },
  },
];

export default function AdvancedDataTable({ data = [] }) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className='w-full space-y-4 font-sans'>
      <div className='flex items-center space-x-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search by any field'
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className='pl-10'
          />
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className='bg-muted/50'
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='font-medium'
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {data.length > 0 && (
        <div className='flex items-center justify-end space-x-2 py-4'>
          <div className='flex-1 text-sm text-muted-foreground'>{table.getFilteredRowModel().rows.length} row(s) total.</div>
          <div className='space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
