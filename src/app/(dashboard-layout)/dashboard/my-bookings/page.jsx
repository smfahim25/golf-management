"use client";

import { useState, useEffect } from "react";
import BookingsTable from "@/components/bookings/bookings-table";
import SearchBar from "@/components/bookings/search-bar";
import DeleteConfirmModal from "@/components/bookings/delete-confirm-modal";

const mockBookings = [
  {
    id: 1,
    date: "08/08/2024",
    name: "Brian Hirt",
    bay: 2,
    hours: 4,
    startTime: "04:00 AM",
    endTime: "08:00 AM",
    players: 2,
    members: 2,
    guests: 0,
  },
  {
    id: 2,
    date: "08/01/2024",
    name: "Brian Hirt",
    bay: 2,
    hours: 4,
    startTime: "04:00 AM",
    endTime: "08:00 AM",
    players: 2,
    members: 1,
    guests: 1,
  },
];

export default function Page() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedBookings = () => {
    let filtered = bookings.filter((booking) =>
      Object.values(booking).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  const handleDelete = (booking) => {
    setDeleteBooking(booking);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setBookings(bookings.filter((booking) => booking.id !== deleteBooking.id));
    setShowDeleteModal(false);
    setDeleteBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            My Bookings
          </h1>

          <div className="flex flex-col md:flex-row gap-4 items-start lg:items-center justify-between"></div>

          {/* Search */}
          <div className="mt-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>

        {/* Table */}
        <BookingsTable
          bookings={filteredAndSortedBookings()}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onDelete={handleDelete}
        />
        {showDeleteModal && deleteBooking && (
          <DeleteConfirmModal
            booking={deleteBooking}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </div>
  );
}
