"use client";

import { Trash2 } from "lucide-react";

export default function DeleteConfirmModal({ booking, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Booking
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete the booking for{" "}
                <span className="font-medium">{booking.name}</span> on{" "}
                <span className="font-medium">{booking.date}</span>?
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Bay:</span> {booking.bay}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Time:</span> {booking.startTime} -{" "}
              {booking.endTime}
            </p>
          </div>

          <p className="text-sm text-red-600">
            This action cannot be undone. The booking will be permanently
            removed from the system.
          </p>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
