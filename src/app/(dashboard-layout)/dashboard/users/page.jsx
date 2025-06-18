"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import DeleteUserModal from "@/components/members/delete-user-modal";
import EditUserModal from "@/components/members/edit-user-modal";
import UsersTable from "@/components/members/user-table";
import SearchBar from "@/components/members/search-bar";
import { exportUsersToExcel } from "@/lib/excel-export";

// Mock data
const mockUsers = [
  {
    id: 1,
    createdAt: "07/30/2024",
    name: "Connor McCarl",
    email: "connormccarl@gmail.com",
    membership: "Admin",
    accountStatus: "Active",
    subscriptionStatus: "Active",
    subscriptionDate: "",
    subscriptionPlan: "",
    avatar: "/images/user-avatar.png",
  },
  {
    id: 2,
    createdAt: "07/30/2024",
    name: "Jason Rice",
    email: "jay@gpcgolf.com",
    membership: "Admin",
    accountStatus: "Active",
    subscriptionStatus: "Active",
    subscriptionDate: "",
    subscriptionPlan: "",
    avatar: "",
  },
  {
    id: 3,
    createdAt: "07/30/2024",
    name: "Connor Test",
    email: "connormccarl+1@gmail.com",
    membership: "User",
    accountStatus: "Active",
    subscriptionStatus: "Inactive",
    subscriptionDate: "",
    subscriptionPlan: "",
    avatar: "",
  },
  {
    id: 4,
    createdAt: "07/31/2024",
    name: "Brian Hirt",
    email: "castryon@gmail.com",
    membership: "User",
    accountStatus: "Active",
    subscriptionStatus: "Active",
    subscriptionDate: "07/31/2024",
    subscriptionPlan: "Monthly",
    avatar: "",
  },
  {
    id: 5,
    createdAt: "07/31/2024",
    name: "David Hunter",
    email: "dhunter8288@gmail.com",
    membership: "User",
    accountStatus: "Active",
    subscriptionStatus: "Active",
    subscriptionDate: "08/02/2024",
    subscriptionPlan: "Monthly",
    avatar: "",
  },
  {
    id: 6,
    createdAt: "07/31/2024",
    name: "Steven Sorensen",
    email: "sasorens@gmail.com",
    membership: "User",
    accountStatus: "Active",
    subscriptionStatus: "Active",
    subscriptionDate: "07/31/2024",
    subscriptionPlan: "Monthly",
    avatar: "",
  },
  {
    id: 7,
    createdAt: "07/31/2024",
    name: "Adam Gorcya",
    email: "awgoryca14@gmail.com",
    membership: "User",
    accountStatus: "Active",
    subscriptionStatus: "Active",
    subscriptionDate: "08/07/2024",
    subscriptionPlan: "Monthly",
    avatar: "",
  },
  {
    id: 8,
    createdAt: "07/31/2024",
    name: "Adam Walsh",
    email: "acwalsh1@yahoo.com",
    membership: "User",
    accountStatus: "Active",
    subscriptionStatus: "Active",
    subscriptionDate: "07/31/2024",
    subscriptionPlan: "Yearly",
    avatar: "",
  },
  {
    id: 9,
    createdAt: "07/31/2024",
    name: "Allen Pyc",
    email: "apyc@graphicresource.com",
    membership: "User",
    accountStatus: "Pending",
    subscriptionStatus: "Active",
    subscriptionDate: "08/14/2024",
    subscriptionPlan: "Monthly",
    avatar: "",
  },
];

export default function Page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  // Simulate API loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Sorting function
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort users
  const filteredAndSortedUsers = () => {
    const filtered = users.filter((user) =>
      Object.values(user).some(
        (value) =>
          value &&
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

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(
      users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleStatusChange = (userId, field, newValue) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, [field]: newValue } : user
      )
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const dataToExport = filteredAndSortedUsers();
      const filename = `users_${new Date().toISOString().split("T")[0]}`;
      await exportUsersToExcel(dataToExport, filename);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-4">
      <div className="px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Users
            </h1>

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

          {/* Search */}
          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          {/* Export Info */}
          {searchTerm && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Search Results:</span>{" "}
                {filteredAndSortedUsers().length} users found
              </p>
            </div>
          )}
        </div>

        {/* Table */}
        <UsersTable
          users={filteredAndSortedUsers()}
          loading={loading}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />

        {/* Modals */}
        {showEditModal && selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            onSave={handleSaveUser}
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
