"use client";

import { useState, useEffect } from "react";
import { Download, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteUserModal from "@/components/members/delete-user-modal";
import EditUserModal from "@/components/members/edit-user-modal";
import UsersTable from "@/components/members/user-table";
import SearchBar from "@/components/members/search-bar";
import { exportUsersToExcel } from "@/lib/excel-export";
import useUserStore from "@/stores/UserStore";
import useAuthStore from "@/stores/AuthStore";
import toast from "react-hot-toast";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    users,
    totalUsers,
    getAllUsers,
    isLoading,
    error,
    updateUser,
    deleteUser,
  } = useUserStore();

  const { currentUser } = useAuthStore();
  const isCurrentUserAdmin = currentUser?.role === "admin";

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, searchTerm]);

  const fetchUsers = async () => {
    const params = {
      page: currentPage,
      limit: pageSize,
      ...(searchTerm && { searchTerm }),
    };
    await getAllUsers(params);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchUsers();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const transformedUsers = users.map((user) => ({
    id: user._id,
    createdAt: new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    name: user.name,
    email: user.email,
    membership: user.role === "admin" ? "Admin" : "User",
    accountStatus: user.isVerified ? "Active" : "Inactive",
    subscriptionStatus: user.isVerified ? "Active" : "Inactive",
    subscriptionDate: new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    subscriptionPlan: user.role === "admin" ? "Admin Plan" : "User Plan",
    avatar: user?.profile_photo || "",
    phone: user.phone || "",
    address: user.address || "",
    isVerified: user.isVerified,
    needsPasswordChange: user.needsPasswordChange,
    originalData: user,
  }));

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = () => {
    if (!sortConfig.key) return transformedUsers;

    return [...transformedUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSaveUser = async (userId, formData) => {
    try {
      await updateUser(userId, formData);

      await fetchUsers();

      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error("Failed to update user. Please try again.");
    }
  };

  const handleConfirmDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setShowDeleteModal(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  const handleStatusChange = async (userId, field, newValue) => {
    try {
      if (field === "membership") {
        await updateUser(userId, { role: newValue.toLowerCase() });
        await fetchUsers();
      } else if (field === "accountStatus") {
        const isVerified = newValue === "Active";
        await updateUser(userId, { isVerified: isVerified });
        await fetchUsers();
      } else if (field === "subscriptionStatus") {
        const isVerified = newValue === "Active";
        await updateUser(userId, { isVerified: isVerified });
        await fetchUsers();
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const dataToExport = sortedUsers();
      const filename = `users_${new Date().toISOString().split("T")[0]}`;
      await exportUsersToExcel(dataToExport, filename);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalUsers);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-4">
      <div className="px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Users ({totalUsers})
              </h1>
            </div>
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

          {/* Search and Filters */}
          <div className="space-y-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />

            {/* Filters */}
            <div className="flex justify-end gap-4 flex-wrap">
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          {searchTerm && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Results:</span> Showing{" "}
                {startIndex}-{endIndex} of {totalUsers} users
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Error: {error}</p>
            <button
              onClick={fetchUsers}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <UsersTable
          users={sortedUsers()}
          loading={isLoading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          isCurrentUserAdmin={isCurrentUserAdmin}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex} to {endIndex} of {totalUsers} results
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex gap-1">
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showEditModal && selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            onSave={handleSaveUser}
            isCurrentUserAdmin={isCurrentUserAdmin}
          />
        )}

        {showDeleteModal && selectedUser && (
          <DeleteUserModal
            user={selectedUser}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedUser(null);
            }}
            onConfirm={handleConfirmDelete}
          />
        )}
      </div>
    </div>
  );
}
