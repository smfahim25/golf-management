"use client";

import { useEffect, useState } from "react";
import SearchBarBooking from "../components/bookings/search-bar";
import BookingsTable from "../components/bookings/bookings-table";
import DeleteConfirmModal from "../components/bookings/delete-confirm-modal";
import useBookingStore from "@/stores/BookingStore";

export default function Page() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(null);

  const {
    getMyBookings,
    deleteBooking: deleteBookingAPI,
    isLoading: loading,
  } = useBookingStore();

  const transformBookingData = (apiBookings) => {
    return apiBookings.map((booking) => ({
      id: booking._id,
      date: new Date(booking.date).toLocaleDateString(),
      name: booking.userId?.name || "Unknown User",
      bay: booking.bay,
      hours: booking.playingTime,
      startTime: booking.startTime,
      endTime: booking.endTime,
      players: booking.numberOfPlayers,
      members: booking?.numberOfGuests
        ? booking.numberOfPlayers - booking?.numberOfGuests
        : 0,
      guests: booking?.numberOfGuests || 0,
      originalData: booking,
    }));
  };

  const fetchBookings = async () => {
    try {
      const response = await getMyBookings();
      const transformedData = transformBookingData(response);
      setBookings(transformedData);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
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
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aVal > bVal) {
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

  const confirmDelete = async () => {
    try {
      setShowDeleteModal(false);
      await deleteBookingAPI(deleteBooking.id);

      setBookings(bookings.filter((b) => b.id !== deleteBooking.id));
      setDeleteBooking(null);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            My Bookings
          </h1>

          {/* Search */}
          <div className="mt-4">
            <SearchBarBooking value={searchTerm} onChange={setSearchTerm} />
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
