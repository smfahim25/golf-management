"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown, SquarePen, Trash2, Lock } from "lucide-react";

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
  const [dropdownPositions, setDropdownPositions] = useState({});
  const dropdownRefs = useRef({});
  const tableRef = useRef(null);

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
    const buttonElement = dropdownRefs.current[key];

    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      setDropdownPositions((prev) => ({
        ...prev,
        [key]: {
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        },
      }));
    }

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
          !dropdownRefs.current[key].contains(event.target) &&
          !event.target.closest(`[data-dropdown="${key}"]`)
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

  // Close dropdowns on scroll
  useEffect(() => {
    function handleScroll() {
      if (Object.values(dropdownStates).some((state) => state)) {
        setDropdownStates({});
      }
    }

    const scrollContainer = tableRef.current?.closest(".overflow-x-auto");
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }

    // Also listen to window scroll
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dropdownStates]);

  // Update dropdown positions on window resize
  useEffect(() => {
    function handleResize() {
      if (Object.values(dropdownStates).some((state) => state)) {
        setDropdownStates({});
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dropdownStates]);

  // Check if a field should show as plain text (for admin users on restricted fields)
  const shouldShowAsPlainText = (user, field) => {
    const isUserAdmin = user.membership === "Admin";
    const isSubscriptionField = field === "subscriptionStatus";
    const hasNoActiveSubscription = !user.hasActiveSubscription;

    return (
      (isUserAdmin &&
        (field === "accountStatus" || field === "subscriptionStatus")) ||
      (isSubscriptionField && hasNoActiveSubscription)
    );
  };

  const StatusDropdown = ({ user, field, options, value }) => {
    const key = `${user.id}-${field}`;
    const isOpen = dropdownStates[key];
    const showAsPlainText = shouldShowAsPlainText(user, field);
    const position = dropdownPositions[key];
    const isDisabled =
      field === "subscriptionStatus" && !user.hasActiveSubscription;

    if (showAsPlainText) {
      return (
        <div className="w-full px-3 py-2">
          <div className="flex items-center gap-2">
            <span className={`${getStatusColor(value, field)} font-medium`}>
              {value}
            </span>
            {isDisabled && (
              <Lock
                className="w-3 h-3 text-gray-400"
                title="Payment required to change subscription status"
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="relative">
          <button
            ref={(el) => (dropdownRefs.current[key] = el)}
            onClick={() => toggleDropdown(user.id, field)}
            disabled={isDisabled}
            className={`flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded bg-white min-w-0 transition-colors ${
              isDisabled
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "hover:bg-gray-50"
            }`}
          >
            <span
              className={`${getStatusColor(value, field)} truncate ${
                isDisabled ? "text-gray-400" : ""
              }`}
            >
              {value}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              {isDisabled && <Lock className="w-3 h-3 text-gray-400" />}
              <ChevronDown
                className={`w-3 h-3 ${
                  isDisabled ? "text-gray-400" : "text-gray-400"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Portal-style dropdown rendered at document level */}
        {isOpen && position && !isDisabled && (
          <div
            className="fixed inset-0 z-[9999]"
            style={{ pointerEvents: "none" }}
          >
            {/* Invisible overlay to catch clicks */}
            <div
              className="absolute inset-0"
              style={{ pointerEvents: "auto" }}
              onClick={() => closeDropdown(user.id, field)}
            />
            {/* Dropdown menu */}
            <div
              data-dropdown={key}
              className="absolute bg-white border border-gray-300 rounded-lg shadow-lg min-w-[140px] max-w-[200px]"
              style={{
                top: `${position.top + 4}px`,
                left: `${position.left}px`,
                width: `${Math.max(position.width, 140)}px`,
                pointerEvents: "auto",
              }}
            >
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onStatusChange(user.id, field, option);
                    closeDropdown(user.id, field);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                    value === option ? "bg-blue-50 text-blue-700" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </>
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
    { key: "createdAt", label: "Created At", width: "w-32" },
    { key: "name", label: "Name", width: "w-48" },
    { key: "email", label: "Email", width: "w-56" },
    { key: "membership", label: "Membership", width: "w-36" },
    { key: "accountStatus", label: "Account Status", width: "w-44" },
    { key: "subscriptionStatus", label: "Subscription Status", width: "w-52" },
    { key: "subscriptionDate", label: "Subscription Date", width: "w-52" },
    {
      key: "subscriptionFrequency",
      label: "Subscription Frequency",
      width: "w-52",
    },
    { key: "actions", label: "Actions", width: "w-24" },
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
      <div className="overflow-x-auto" style={{ position: "relative" }}>
        <table ref={tableRef} className="w-full min-w-max table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${
                    column.width
                  } px-4 py-4 text-left font-semibold text-gray-900 ${
                    column.key !== "actions"
                      ? "cursor-pointer hover:bg-gray-100"
                      : ""
                  }`}
                  onClick={() => column.key !== "actions" && onSort(column.key)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-[14px]">{column.label}</span>
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
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 text-gray-900">
                    <div className="truncate text-sm" title={user.createdAt}>
                      {user.createdAt}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-900">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                      <span
                        className="font-medium truncate text-sm"
                        title={user.name}
                      >
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-900">
                    <div className="truncate text-sm" title={user.email}>
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusDropdown
                      user={user}
                      field="membership"
                      options={["Admin", "User"]}
                      value={user.membership}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <StatusDropdown
                      user={user}
                      field="accountStatus"
                      options={["Active", "Pending"]}
                      value={user.accountStatus}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <StatusDropdown
                      user={user}
                      field="subscriptionStatus"
                      options={["Active", "Inactive"]}
                      value={user.subscriptionStatus}
                    />
                  </td>
                  <td className="px-4 py-4 text-gray-900">
                    <div
                      className="truncate text-[15px] text-black"
                      title={user.subscriptionDate || "No subscription"}
                    >
                      {user.subscriptionDate || ""}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-900">
                    <div
                      className="truncate text-[15px] text-black"
                      title={user.subscriptionFrequency || "No frequency set"}
                    >
                      {user.subscriptionFrequency || ""}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onEdit(user)}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded transition-colors duration-200"
                        title="Edit user"
                      >
                        <SquarePen className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors duration-200"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
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
