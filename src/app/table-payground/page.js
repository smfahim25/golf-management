'use client';

import { AdvancedDataTable } from '@/components/ui/advanced-data-table';
import { bookingColumns } from './booking-column';
import { userColumns } from './user-column';

// Sample booking data
const bookingData = [
  {
    id: '1',
    date: '08/08/2024',
    name: 'Brian Hirt',
    bay: 2,
    hours: 4,
    startTime: '04:00 AM',
    endTime: '08:00 AM',
    players: 2,
    members: 2,
    guests: 0,
  },
  {
    id: '2',
    date: '08/01/2024',
    name: 'Jason Rice',
    bay: 2,
    hours: 2,
    startTime: '10:00 PM',
    endTime: '12:00 AM',
    players: 1,
    members: 1,
    guests: 0,
  },
  {
    id: '3',
    date: '08/04/2024',
    name: 'Josh Covault',
    bay: 2,
    hours: 4,
    startTime: '11:00 PM',
    endTime: '03:00 AM',
    players: 1,
    members: 1,
    guests: 0,
  },
];

// Sample user data
const userData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 987-6543',
    role: 'user',
    status: 'active',
    joinDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+1 (555) 456-7890',
    role: 'moderator',
    status: 'inactive',
    joinDate: '2024-03-10',
  },
];

export default function Page() {
  return (
    <div className='container mx-auto py-10 space-y-12'>
      {/* Bookings Table */}
      <div>
        <h1 className='text-2xl font-bold mb-4'>Bookings Management</h1>
        <AdvancedDataTable
          columns={bookingColumns}
          data={bookingData}
          searchPlaceholder='Search bookings...'
          pageSize={5}
        />
      </div>

      {/* Users Table */}
      <div>
        <h1 className='text-2xl font-bold mb-4'>User Management</h1>
        <AdvancedDataTable
          columns={userColumns}
          data={userData}
          searchPlaceholder='Search users by name, email, or role...'
          pageSize={10}
          emptyMessage='No users found.'
        />
      </div>

      {/* Example with minimal features */}
      <div>
        <h1 className='text-2xl font-bold mb-4'>Simple Table (No Search/Pagination)</h1>
        <AdvancedDataTable
          columns={userColumns.slice(0, 4)} // Only first 4 columns
          data={userData.slice(0, 2)} // Only first 2 rows
          showSearch={false}
          showPagination={false}
          emptyMessage='No data available.'
        />
      </div>
    </div>
  );
}
