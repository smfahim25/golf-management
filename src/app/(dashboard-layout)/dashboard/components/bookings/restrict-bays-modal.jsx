"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import DatePicker from "@/components/BookingCalendar/date-picker";

export default function RestrictBaysModal({ onClose }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [showEndTimeDropdown, setShowEndTimeDropdown] = useState(false);
  const [restrictData, setRestrictData] = useState({
    date: "",
    bay: "Bay 1",
    allDay: false,
    startTime: "",
    endTime: "",
    note: "",
  });

  const datePickerRef = useRef(null);
  const dateButtonRef = useRef(null);
  const startTimeDropdownRef = useRef(null);
  const startTimeButtonRef = useRef(null);
  const endTimeDropdownRef = useRef(null);
  const endTimeButtonRef = useRef(null);

  // Handle click outside for date picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showDatePicker &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        dateButtonRef.current &&
        !dateButtonRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    }

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  // Handle click outside for start time dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showStartTimeDropdown &&
        startTimeDropdownRef.current &&
        !startTimeDropdownRef.current.contains(event.target) &&
        startTimeButtonRef.current &&
        !startTimeButtonRef.current.contains(event.target)
      ) {
        setShowStartTimeDropdown(false);
      }
    }

    if (showStartTimeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartTimeDropdown]);

  // Handle click outside for end time dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showEndTimeDropdown &&
        endTimeDropdownRef.current &&
        !endTimeDropdownRef.current.contains(event.target) &&
        endTimeButtonRef.current &&
        !endTimeButtonRef.current.contains(event.target)
      ) {
        setShowEndTimeDropdown(false);
      }
    }

    if (showEndTimeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEndTimeDropdown]);

  const timeOptions = [
    "12:00 AM",
    "01:00 AM",
    "02:00 AM",
    "03:00 AM",
    "04:00 AM",
    "05:00 AM",
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  const handleConfirm = () => {
    // Save restriction logic would go here
    alert(
      `Bay restriction added for ${restrictData.bay} on ${
        restrictData.date || "selected date"
      }`
    );
    onClose();
  };

  const clearDate = (e) => {
    e.stopPropagation();
    setRestrictData({ ...restrictData, date: "" });
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get available time slots - in a real app, this would filter based on existing bookings
  const getAvailableTimeSlots = () => {
    // For demo purposes, return all time slots
    return timeOptions;
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Restrict a Bay
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Pick a Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pick a Date
            </label>
            <div className="relative">
              <button
                ref={dateButtonRef}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left flex items-center justify-between"
              >
                <span
                  className={
                    restrictData.date ? "text-gray-900" : "text-gray-500"
                  }
                >
                  {formatDisplayDate(restrictData.date)}
                </span>
                <div className="flex items-center gap-2">
                  {restrictData.date && (
                    <X
                      className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={clearDate}
                    />
                  )}
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
              </button>

              {showDatePicker && (
                <div
                  ref={datePickerRef}
                  className="absolute top-full left-0 mt-2 z-20"
                >
                  <DatePicker
                    selectedDate={
                      restrictData.date ||
                      new Date().toISOString().split("T")[0]
                    }
                    onDateSelect={(date) => {
                      setRestrictData({
                        ...restrictData,
                        date: date,
                      });
                      setShowDatePicker(false);
                    }}
                    onClose={() => setShowDatePicker(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Choose Bay */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Bay
            </label>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setRestrictData({ ...restrictData, bay: "Bay 1" })
                }
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  restrictData.bay === "Bay 1"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Bay 1
              </button>
              <button
                onClick={() =>
                  setRestrictData({ ...restrictData, bay: "Bay 2" })
                }
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  restrictData.bay === "Bay 2"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Bay 2
              </button>
            </div>
          </div>

          {/* All Day Toggle */}
          <div>
            <label className="flex items-center gap-3 w-[103px]">
              <span className="text-sm font-medium text-gray-700">
                All Day?
              </span>
              <button
                onClick={() =>
                  setRestrictData({
                    ...restrictData,
                    allDay: !restrictData.allDay,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  restrictData.allDay ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    restrictData.allDay ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </label>
          </div>

          {/* Events to Cancel - Only shown when All Day is true */}
          {restrictData.allDay && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex justify-between items-center">
              <span className="text-sm font-medium text-red-700">
                Events to Cancel:
              </span>
              <span className="text-sm font-bold text-red-700">1</span>
            </div>
          )}

          {!restrictData.allDay && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Restrict Time
              </label>
              <div className="space-y-3">
                <div className="relative">
                  <button
                    ref={startTimeButtonRef}
                    onClick={() => {
                      setShowStartTimeDropdown(!showStartTimeDropdown);
                      setShowEndTimeDropdown(false);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <span
                      className={
                        restrictData.startTime
                          ? "text-gray-900"
                          : "text-gray-500"
                      }
                    >
                      {restrictData.startTime || "Start Time"}
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>

                  {showStartTimeDropdown && (
                    <div
                      ref={startTimeDropdownRef}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10"
                    >
                      {getAvailableTimeSlots().map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setRestrictData({
                              ...restrictData,
                              startTime: time,
                            });
                            setShowStartTimeDropdown(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-blue-50 transition-colors duration-200 font-medium ${
                            restrictData.startTime === time
                              ? "bg-blue-50 text-blue-700"
                              : ""
                          }`}
                        >
                          {time}
                        </button>
                      ))}

                      {getAvailableTimeSlots().length === 0 && (
                        <div className="p-3 text-center text-gray-500">
                          No available time slots for this bay and duration
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* End Time Custom Dropdown */}
                <div className="relative">
                  <button
                    ref={endTimeButtonRef}
                    onClick={() => {
                      setShowEndTimeDropdown(!showEndTimeDropdown);
                      setShowStartTimeDropdown(false);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <span
                      className={
                        restrictData.endTime ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {restrictData.endTime || "End Time"}
                    </span>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </button>

                  {showEndTimeDropdown && (
                    <div
                      ref={endTimeDropdownRef}
                      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10"
                    >
                      {getAvailableTimeSlots().map((time) => (
                        <button
                          key={time}
                          onClick={() => {
                            setRestrictData({ ...restrictData, endTime: time });
                            setShowEndTimeDropdown(false);
                          }}
                          className={`w-full p-3 text-left hover:bg-blue-50 transition-colors duration-200 font-medium ${
                            restrictData.endTime === time
                              ? "bg-blue-50 text-blue-700"
                              : ""
                          }`}
                        >
                          {time}
                        </button>
                      ))}

                      {getAvailableTimeSlots().length === 0 && (
                        <div className="p-3 text-center text-gray-500">
                          No available time slots for this bay and duration
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note
            </label>
            <textarea
              value={restrictData.note}
              onChange={(e) =>
                setRestrictData({ ...restrictData, note: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add a note..."
            />
          </div>
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
