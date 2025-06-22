"use client";

import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";

export default function BookingsTable({
  bookings,
  loading,
  sortConfig,
  onSort,
  onDelete,
}) {
  const formatTime = (timeString) => {
    if (!timeString) return timeString;

    const [hours, minutes] = timeString.split(":");
    const hour24 = parseInt(hours, 10);

    if (hour24 === 0) {
      return `12:${minutes} AM`;
    } else if (hour24 < 12) {
      return `${hour24}:${minutes} AM`;
    } else if (hour24 === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hour24 - 12}:${minutes} PM`;
    }
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  const columns = [
    { key: "date", label: "Date", width: "w-28" },
    { key: "name", label: "Name", width: "w-36" },
    { key: "bay", label: "Bay", width: "w-20" },
    { key: "hours", label: "# of Hours", width: "w-24" },
    { key: "startTime", label: "Start Time", width: "w-32" },
    { key: "endTime", label: "End Time", width: "w-32" },
    { key: "players", label: "Player(s)", width: "w-24" },
    { key: "members", label: "Member(s)", width: "w-28" },
    { key: "guests", label: "Guest(s)", width: "w-24" },
    { key: "actions", label: "", width: "w-24" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`${
                      column.width
                    } px-3 py-3 text-left text-sm font-semibold text-gray-900 ${
                      column.key !== "actions"
                        ? "cursor-pointer hover:bg-gray-100"
                        : ""
                    }`}
                    onClick={() =>
                      column.key !== "actions" && onSort(column.key)
                    }
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <span className="truncate">{column.label}</span>
                      {column.key !== "actions" && (
                        <SortIcon column={column.key} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-8 text-center text-gray-500"
                  >
                    No bookings found matching your search criteria.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-gray-900">
                      <div className="w-28 truncate" title={booking.date}>
                        {booking.date}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-900 font-medium">
                      <div className="w-36 truncate" title={booking.name}>
                        {booking.name}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-900">
                      <div className="w-20 truncate" title={booking.bay}>
                        {booking.bay}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-900">
                      <div className="w-24 truncate" title={booking.hours}>
                        {booking.hours}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-900">
                      <div
                        className="w-32 truncate"
                        title={formatTime(booking.startTime)}
                      >
                        {formatTime(booking.startTime)}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-900">
                      <div
                        className="w-32 truncate"
                        title={formatTime(booking.endTime)}
                      >
                        {formatTime(booking.endTime)}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-900">
                      <div className="w-24 truncate" title={booking.players}>
                        {booking.players}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-900">
                      <div className="w-28 truncate" title={booking.members}>
                        {booking.members}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-900">
                      <div className="w-24 truncate" title={booking.guests}>
                        {booking.guests}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => onDelete(booking)}
                        className="text-red-500 px-2 py-1 rounded-md font-medium transition-colors duration-200 flex items-center gap-1 min-w-max"
                        title="Delete booking"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
