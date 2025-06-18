"use client";

import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function EditSettingsModal({ onClose }) {
  const [bookingsIn60Days, setBookingsIn60Days] = useState(3);

  const handleConfirm = () => {
    toast.success(`Settings updated: ${bookingsIn60Days} bookings in 60 days`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Settings</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Bookings in 60 Days
          </label>
          <input
            type="number"
            value={bookingsIn60Days}
            onChange={(e) =>
              setBookingsIn60Days(Number.parseInt(e.target.value))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min="1"
          />
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
