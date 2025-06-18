"use client";

import { useState, useEffect } from "react";
import { Download, Settings, Ban } from "lucide-react";
import { exportToExcel } from "@/lib/excel-export";
import DeleteConfirmModal from "@/components/Bookings/delete-confirm-modal";
import RestrictBaysModal from "@/components/Bookings/restrict-bays-modal";
import EditSettingsModal from "@/components/Bookings/edit-settings-modal";
import BookingsTable from "@/components/Bookings/bookings-table";
import SearchBar from "@/components/Bookings/search-bar";
import DateRangePicker from "@/components/Bookings/date-range-picker";

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
  {
    id: 3,
    date: "08/01/2024",
    name: "Tom Cavanaugh",
    bay: 1,
    hours: 2,
    startTime: "02:00 AM",
    endTime: "04:00 AM",
    players: 1,
    members: 1,
    guests: 0,
  },
  {
    id: 4,
    date: "08/01/2024",
    name: "Jason Rice",
    bay: 2,
    hours: 2,
    startTime: "10:00 PM",
    endTime: "12:00 AM",
    players: 1,
    members: 1,
    guests: 0,
  },
  {
    id: 5,
    date: "08/02/2024",
    name: "Tina Wolverton",
    bay: 1,
    hours: 1,
    startTime: "06:00 AM",
    endTime: "07:00 AM",
    players: 1,
    members: 1,
    guests: 0,
  },
  {
    id: 6,
    date: "08/04/2024",
    name: "Josh Covault",
    bay: 2,
    hours: 4,
    startTime: "11:00 PM",
    endTime: "03:00 AM",
    players: 1,
    members: 1,
    guests: 0,
  },
];

export default function Page() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRestrictModal, setShowRestrictModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBooking, setDeleteBooking] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [isExporting, setIsExporting] = useState(false);

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

  const confirmDelete = () => {
    setBookings(bookings.filter((booking) => booking.id !== deleteBooking.id));
    setShowDeleteModal(false);
    setDeleteBooking(null);
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
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
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
