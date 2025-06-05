"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, SquarePen, Trash2 } from "lucide-react";

export default function UsersTable({
  users,
  loading,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [dropdownStates, setDropdownStates] = useState({});
  const dropdownRefs = useRef({});

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

  const toggleDropdown = (userId, field) => {
    const key = `${userId}-${field}`;
    setDropdownStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const closeDropdown = (userId, field) => {
    const key = `${userId}-${field}`;
    setDropdownStates((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  // Handle click outside dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      Object.keys(dropdownStates).forEach((key) => {
        if (
          dropdownStates[key] &&
          dropdownRefs.current[key] &&
          !dropdownRefs.current[key].contains(event.target)
        ) {
          setDropdownStates((prev) => ({
            ...prev,
            [key]: false,
          }));
        }
      });
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownStates]);

  const StatusDropdown = ({ user, field, options, value }) => {
    const key = `${user.id}-${field}`;
    const isOpen = dropdownStates[key];

    return (
      <div className="relative" ref={(el) => (dropdownRefs.current[key] = el)}>
        <button
          onClick={() => toggleDropdown(user.id, field)}
          className="flex items-center justify-between w-full px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 min-w-0"
        >
          <span className={`${getStatusColor(value, field)} truncate`}>
            {value}
          </span>
          <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0 ml-1" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[120px]">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onStatusChange(user.id, field, option);
                  closeDropdown(user.id, field);
                }}
                className={`w-full px-3 py-2 text-left  hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                  value === option ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getStatusColor = (status, field) => {
    if (field === "membership") {
      return status === "Admin"
        ? "text-purple-700 font-medium"
        : "text-gray-700";
    }
    if (field === "accountStatus") {
      return status === "Active"
        ? "text-green-700 font-medium"
        : "text-yellow-700 font-medium";
    }
    if (field === "subscriptionStatus") {
      return status === "Active"
        ? "text-green-700 font-medium"
        : "text-red-700 font-medium";
    }
    return "text-gray-700";
  };

  const columns = [
    { key: "createdAt", label: "Created At", width: "w-28" },
    { key: "name", label: "Name", width: "w-48" },
    { key: "email", label: "Email", width: "w-52" },
    { key: "membership", label: "Membership", width: "w-28" },
    { key: "accountStatus", label: "Account Status", width: "w-32" },
    { key: "subscriptionStatus", label: "Subscription Status", width: "w-36" },
    { key: "subscriptionDate", label: "Subscription Date", width: "w-32" },
    { key: "subscriptionPlan", label: "Subscription Plan", width: "w-32" },
    { key: "actions", label: "", width: "w-32" },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${
                    column.width
                  } px-3 py-3 text-left  font-semibold text-gray-900 ${
                    column.key !== "actions"
                      ? "cursor-pointer hover:bg-gray-100"
                      : ""
                  }`}
                  onClick={() => column.key !== "actions" && onSort(column.key)}
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
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-8 text-center text-gray-500"
                >
                  No users found matching your search criteria.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3  text-gray-900">
                    <div className="w-28 truncate" title={user.createdAt}>
                      {user.createdAt}
                    </div>
                  </td>
                  <td className="px-3 py-3  text-gray-900">
                    <div className="w-48 flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-600">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        )}
                      </div>
                      <span className="font-medium truncate" title={user.name}>
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3  text-gray-900">
                    <div className="w-52 truncate" title={user.email}>
                      {user.email}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="w-28">
                      <StatusDropdown
                        user={user}
                        field="membership"
                        options={["Admin", "User"]}
                        value={user.membership}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="w-32">
                      <StatusDropdown
                        user={user}
                        field="accountStatus"
                        options={["Active", "Pending"]}
                        value={user.accountStatus}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="w-36">
                      <StatusDropdown
                        user={user}
                        field="subscriptionStatus"
                        options={["Active", "Inactive"]}
                        value={user.subscriptionStatus}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-900">
                    <div
                      className="w-32 truncate"
                      title={user.subscriptionDate || "-"}
                    >
                      {user.subscriptionDate || "-"}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-900">
                    <div
                      className="w-32 truncate"
                      title={user.subscriptionPlan || "-"}
                    >
                      {user.subscriptionPlan || "-"}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="w-32 flex items-center justify-center">
                      <button
                        onClick={() => onEdit(user)}
                        className=" text-black px-2 py-1 rounded font-medium transition-colors duration-200"
                        title="Edit user"
                      >
                        <SquarePen />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className=" text-black px-2 py-1 rounded font-medium transition-colors duration-200"
                        title="Delete user"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
