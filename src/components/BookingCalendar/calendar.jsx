"use client";

import { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Plus,
  Building2,
  ChevronDown,
} from "lucide-react";
import DatePicker from "./date-picker";

export default function Calendar({
  onSlotClick,
  onBookSlotClick,
  onJoinSlotClick,
  bookings,
  selectedDate,
  onDateChange,
  selectedClub,
  clubs,
  onClubChange,
  availability,
  isLoadingAvailability,
}) {
  const [selectedBayView, setSelectedBayView] = useState("Both");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showClubDropdown, setShowClubDropdown] = useState(false);
  const [bayStartIndex, setBayStartIndex] = useState(0);

  const datePickerRef = useRef(null);
  const dateButtonRef = useRef(null);
  const clubDropdownRef = useRef(null);
  const clubButtonRef = useRef(null);

  const timeSlots = [
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "00:00",
  ];

  // Get current club's bays
  const clubBays = selectedClub?.bays || [];

  // Calculate visible bays (show 2 at a time)
  const baysPerView = 2;
  const visibleBays =
    selectedBayView === "Both"
      ? clubBays.slice(bayStartIndex, bayStartIndex + baysPerView)
      : [selectedBayView];

  // Bay navigation options - only show current visible bays + Both option
  const bayViewOptions =
    selectedBayView === "Both"
      ? ["Both", ...visibleBays]
      : ["Both", ...clubBays];

  const formatTime = (time) => {
    const hour = Number.parseInt(time.split(":")[0]);
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const goToPreviousDay = () => {
    const currentDate = new Date(selectedDate + "T00:00:00");
    currentDate.setDate(currentDate.getDate() - 1);
    const newDate = currentDate.toISOString().split("T")[0];
    onDateChange(newDate);
  };

  const goToNextDay = () => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const currentDate = new Date(year, month - 1, day);
    currentDate.setDate(currentDate.getDate() + 1);

    const newYear = currentDate.getFullYear();
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const newDay = String(currentDate.getDate()).padStart(2, "0");

    const newDate = `${newYear}-${newMonth}-${newDay}`;
    onDateChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    onDateChange(todayStr);
  };

  // Bay navigation functions
  const goToPreviousBays = () => {
    setBayStartIndex(Math.max(0, bayStartIndex - baysPerView));
  };

  const goToNextBays = () => {
    setBayStartIndex(
      Math.min(clubBays.length - baysPerView, bayStartIndex + baysPerView)
    );
  };

  const canGoToPreviousBays = bayStartIndex > 0;
  const canGoToNextBays = bayStartIndex + baysPerView < clubBays.length;

  // Enhanced bay matching function
  const bayMatches = (bookingBay, slotBay) => {
    if (!bookingBay || !slotBay) return false;
    return bookingBay.toLowerCase() === slotBay.toLowerCase();
  };

  const getBookingForSlot = (time, bay) => {
    if (!bookings || bookings.length === 0) return null;

    return bookings.find((booking) => {
      if (booking.date !== selectedDate) return false;
      if (!bayMatches(booking.bay, bay)) return false;
      if (booking.startTime !== time) return false;
      return true;
    });
  };

  const isBookingInSlot = (time, bay) => {
    if (!bookings || bookings.length === 0) return false;

    return bookings.find((booking) => {
      if (booking.date !== selectedDate) return false;
      if (!bayMatches(booking.bay, bay)) return false;

      const bookingStart = Number.parseInt(booking.startTime.split(":")[0]);
      const bookingEnd = Number.parseInt(booking.endTime.split(":")[0]);
      const slotHour = Number.parseInt(time.split(":")[0]);

      if (bookingEnd > bookingStart) {
        return slotHour >= bookingStart && slotHour < bookingEnd;
      } else {
        return slotHour >= bookingStart || slotHour < bookingEnd;
      }
    });
  };

  const getBookingSpan = (booking) => {
    const start = Number.parseInt(booking.startTime.split(":")[0]);
    let end = Number.parseInt(booking.endTime.split(":")[0]);

    if (end < start) {
      end += 24;
    }

    return end - start;
  };

  // Check if slot is available based on API availability data
  const isSlotAvailable = (time, bay) => {
    if (!availability || !Array.isArray(availability)) return true;

    const isBooked = availability.some((booking) => {
      if (booking.bay !== bay) return false;
      if (booking.club !== selectedClub?._id) return false;

      const bookingStart = Number.parseInt(booking.startTime.split(":")[0]);
      const bookingEnd = Number.parseInt(booking.endTime.split(":")[0]);
      const slotHour = Number.parseInt(time.split(":")[0]);

      if (bookingEnd > bookingStart) {
        return slotHour >= bookingStart && slotHour < bookingEnd;
      } else {
        return slotHour >= bookingStart || slotHour < bookingEnd;
      }
    });

    return !isBooked;
  };

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showClubDropdown &&
        clubDropdownRef.current &&
        !clubDropdownRef.current.contains(event.target) &&
        clubButtonRef.current &&
        !clubButtonRef.current.contains(event.target)
      ) {
        setShowClubDropdown(false);
      }
    }

    if (showClubDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showClubDropdown]);

  // Reset bay index when club changes
  useEffect(() => {
    setBayStartIndex(0);
    setSelectedBayView("Both");
  }, [selectedClub]);

  const renderTimeSlot = (time, bay) => {
    const booking = getBookingForSlot(time, bay);
    const isSlotBooked = isBookingInSlot(time, bay);
    const available = isSlotAvailable(time, bay);

    if (booking) {
      const span = getBookingSpan(booking);
      const displayName =
        booking.bookingType === "member" ? booking.memberName : "Your Booking";

      return (
        <div className="relative h-16">
          <div
            className="absolute inset-0 bg-green-500 text-white flex flex-col justify-between p-2"
            style={{ height: `${span * 64}px` }}
          >
            <div className="flex-1">
              <div className="text-xs font-medium truncate">
                👤 {displayName}
              </div>
              <div className="text-xs opacity-90">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJoinSlotClick(booking);
              }}
              className="bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-black transition-colors duration-200 absolute bottom-1 right-1 w-6 h-6"
            >
              <Plus size={12} className="text-gray-700" />
            </button>
          </div>
        </div>
      );
    } else if (isSlotBooked || !available) {
      return <div className="h-16 bg-gray-100"></div>;
    } else {
      return (
        <button
          onClick={() => onSlotClick(time, bay)}
          className="w-full h-16 hover:bg-blue-50 transition-colors duration-200 group flex items-center justify-center"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Plus className="text-white w-4 h-4" />
          </div>
        </button>
      );
    }
  };

  return (
    <div className="bg-white">
      {/* Header Controls */}
      <div className="bg-gray-50 p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <button
            onClick={onBookSlotClick}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Book a Slot
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Date Navigation */}
            <div className="flex items-center space-x-3">
              <button
                onClick={goToPreviousDay}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={goToToday}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
                >
                  Today
                </button>

                <div className="relative">
                  <button
                    ref={dateButtonRef}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
                  >
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <span>{formatDate(selectedDate)}</span>
                  </button>

                  {showDatePicker && (
                    <div
                      ref={datePickerRef}
                      className="absolute top-full left-0 mt-2 z-20"
                    >
                      <DatePicker
                        selectedDate={selectedDate}
                        onDateSelect={(date) => {
                          onDateChange(date);
                          setShowDatePicker(false);
                        }}
                        onClose={() => setShowDatePicker(false)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={goToNextDay}
                className="p-2 hover:bg-gray-200 rounded transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Club Selection */}
            <div className="relative">
              <button
                ref={clubButtonRef}
                onClick={() => setShowClubDropdown(!showClubDropdown)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors duration-200 text-sm font-medium bg-white"
              >
                <Building2 className="w-4 h-4 text-gray-500" />
                <span>{selectedClub?.name || "Select Club"}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showClubDropdown && (
                <div
                  ref={clubDropdownRef}
                  className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-20 min-w-[200px] overflow-hidden"
                >
                  {clubs.map((club) => (
                    <button
                      key={club._id}
                      onClick={() => {
                        onClubChange(club);
                        setShowClubDropdown(false);
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-50 transition-colors duration-200 font-medium text-sm ${
                        selectedClub?._id === club._id ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{club.name}</span>
                        <span className="text-xs text-gray-500">
                          {club.bays.length} bays
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bay Selection with Navigation */}
            <div className="flex items-center gap-2">
              {/* Bay Navigation */}
              {selectedBayView === "Both" && clubBays.length > baysPerView && (
                <div className="flex items-center gap-1 mr-2">
                  <button
                    onClick={goToPreviousBays}
                    disabled={!canGoToPreviousBays}
                    className={`p-2 rounded transition-colors duration-200 ${
                      canGoToPreviousBays
                        ? "hover:bg-gray-200 text-gray-600"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-500 px-2">
                    {bayStartIndex + 1}-
                    {Math.min(bayStartIndex + baysPerView, clubBays.length)} of{" "}
                    {clubBays.length}
                  </span>
                  <button
                    onClick={goToNextBays}
                    disabled={!canGoToNextBays}
                    className={`p-2 rounded transition-colors duration-200 ${
                      canGoToNextBays
                        ? "hover:bg-gray-200 text-gray-600"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Bay Selection */}
              <div className="flex items-center gap-1 bg-white rounded p-1 border border-gray-200">
                <button
                  onClick={() => setSelectedBayView("Both")}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                    selectedBayView === "Both"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Both
                </button>
                {selectedBayView === "Both"
                  ? // Show only current visible bays when "Both" is selected
                    visibleBays.map((bay) => (
                      <button
                        key={bay}
                        onClick={() => setSelectedBayView(bay)}
                        className="px-4 py-2 rounded text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      >
                        {bay}
                      </button>
                    ))
                  : // Show all bays when individual bay is selected
                    clubBays.map((bay) => (
                      <button
                        key={bay}
                        onClick={() => setSelectedBayView(bay)}
                        className={`px-4 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                          selectedBayView === bay
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {bay}
                      </button>
                    ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isLoadingAvailability && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-gray-600">
              Checking availability...
            </span>
          </div>
        )}
      </div>

      {/* Calendar Grid - Exact Image Layout */}
      <div className="border border-gray-300">
        <table className="w-full border-collapse">
          {/* Header Row */}
          <thead>
            <tr>
              <th className="border border-gray-300 p-4 text-left text-sm font-medium text-gray-600 bg-white w-24">
                GMT-08
              </th>
              {selectedBayView === "Both" && visibleBays.length > 1 ? (
                visibleBays.map((bay) => (
                  <th
                    key={bay}
                    className="border border-gray-300 p-4 text-center text-sm font-medium text-gray-900 bg-white"
                  >
                    {bay}
                  </th>
                ))
              ) : (
                <th className="border border-gray-300 p-4 text-center text-sm font-medium text-gray-900 bg-white">
                  {selectedBayView === "Both"
                    ? visibleBays[0]
                    : selectedBayView}
                </th>
              )}
            </tr>
          </thead>

          {/* Time Slots */}
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <td className="border border-gray-300 p-4 text-sm text-gray-600 bg-white w-24">
                  {formatTime(time)}
                </td>
                {selectedBayView === "Both" && visibleBays.length > 1 ? (
                  visibleBays.map((bay) => (
                    <td
                      key={bay}
                      className="border border-gray-300 p-0 bg-white h-16"
                    >
                      {renderTimeSlot(time, bay)}
                    </td>
                  ))
                ) : (
                  <td className="border border-gray-300 p-0 bg-white h-16">
                    {renderTimeSlot(
                      time,
                      selectedBayView === "Both"
                        ? visibleBays[0]
                        : selectedBayView
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
