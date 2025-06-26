"use client";

import { useState, useEffect } from "react";
import { Download, Settings, Ban } from "lucide-react";
import { exportToExcel } from "@/lib/excel-export";
import DateRangePicker from "../components/bookings/date-range-picker";
import DeleteConfirmModal from "../components/bookings/delete-confirm-modal";
import RestrictBaysModal from "../components/bookings/restrict-bays-modal";
import EditSettingsModal from "../components/bookings/edit-settings-modal";
import BookingsTable from "../components/bookings/bookings-table";
import SearchBarBooking from "../components/bookings/search-bar";
import useBookingStore from "@/stores/BookingStore";

export default function Page() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestrictModal, setShowRestrictModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isExporting, setIsExporting] = useState(false);

  const {
    getAllBookings,
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
      members: booking?.numberOfGuest
        ? booking.numberOfPlayers - booking?.numberOfGuest
        : 0,
      guests: booking?.numberOfGuest || 0,
      originalData: booking,
    }));
  };

  const fetchBookings = async () => {
    try {
      const response = await getAllBookings();
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
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= startDate && bookingDate <= endDate;
      });
    }

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

  const confirmDelete = async () => {
    try {
      await deleteBookingAPI(deleteBooking.id);

      setBookings(bookings.filter((b) => b.id !== deleteBooking.id));

      setShowDeleteModal(false);
      setDeleteBooking(null);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const dataToExport = filteredAndSortedBookings();

      let filename = "bookings";
      if (dateRange.start && dateRange.end) {
        filename += `_${dateRange.start}_to_${dateRange.end}`;
      } else {
        filename += `_${new Date().toISOString().split("T")[0]}`;
      }

      await exportToExcel(dataToExport, filename);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            All Bookings
          </h1>

          <div className="flex flex-col md:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export
                  </>
                )}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                Edit Settings
              </button>
              <button
                onClick={() => setShowRestrictModal(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
              >
                <Ban className="w-4 h-4" />
                Restrict Bays
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4">
            <SearchBarBooking value={searchTerm} onChange={setSearchTerm} />
          </div>

          {/* Export Info */}
          {dateRange.start && dateRange.end && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Export Range:</span>{" "}
                {dateRange.start} to {dateRange.end} (
                {filteredAndSortedBookings().length} bookings)
              </p>
            </div>
          )}
        </div>

        {/* Table */}
        <BookingsTable
          bookings={filteredAndSortedBookings()}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onDelete={handleDelete}
        />

        {/* Modals */}
        {showEditModal && (
          <EditSettingsModal onClose={() => setShowEditModal(false)} />
        )}

        {showRestrictModal && (
          <RestrictBaysModal onClose={() => setShowRestrictModal(false)} />
        )}

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
