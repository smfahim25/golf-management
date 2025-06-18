"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteUserModal({ user, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onConfirm(user.id);
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete User
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-medium">{user.name}</span>?
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Membership:</span> {user.membership}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Status:</span> {user.accountStatus}
            </p>
          </div>

          <p className="text-sm text-red-600 mb-6">
            This action cannot be undone. The user will be permanently removed
            from the system along with all their data.
          </p>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
