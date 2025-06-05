'use client';

import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';

export const bookingColumns = [
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
            console.log('Delete booking:', booking.id);
          }}
        >
          Delete
        </Button>
      );
    },
  },
];
