'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Mail, Phone } from 'lucide-react';

export const userColumns = [
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
    cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Email
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Mail className='h-4 w-4 text-muted-foreground' />
        {row.getValue('email')}
      </div>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <Phone className='h-4 w-4 text-muted-foreground' />
        {row.getValue('phone')}
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Role
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const role = row.getValue('role');
      return <Badge variant={role === 'admin' ? 'default' : role === 'moderator' ? 'secondary' : 'outline'}>{role}</Badge>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Status
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue('status');
      return <Badge variant={status === 'active' ? 'default' : 'destructive'}>{status}</Badge>;
    },
  },
  {
    accessorKey: 'joinDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='h-auto p-0 font-medium hover:bg-transparent'
        >
          Join Date
          <ChevronsUpDown className='ml-2 h-4 w-4 opacity-50' />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue('joinDate')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => console.log('Edit user:', user.id)}
          >
            Edit
          </Button>
          <Button
            variant='destructive'
            size='sm'
            onClick={() => console.log('Delete user:', user.id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];
