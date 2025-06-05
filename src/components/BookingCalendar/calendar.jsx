"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarIcon, Plus } from "lucide-react";
import DatePicker from "./date-picker";

export default function Calendar({
  onSlotClick,
  onBookSlotClick,
  onJoinSlotClick,
  bookings,
  selectedDate,
  onDateChange,
}) {
  const [selectedBay, setSelectedBay] = useState("Both");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  const dateButtonRef = useRef(null);

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

  // Enhanced bay matching function
  const bayMatches = (bookingBay, slotBay) => {
    // Normalize bay names for comparison
    const normalize = (bay) => {
      if (!bay) return "";
      const str = bay.toString().toLowerCase();
      if (str.includes("bay 1") || str === "1" || str === "bay1") return "bay1";
      if (str.includes("bay 2") || str === "2" || str === "bay2") return "bay2";
      return str;
    };

    const normalizedBookingBay = normalize(bookingBay);
    const normalizedSlotBay = normalize(slotBay);

    return normalizedBookingBay === normalizedSlotBay;
  };

  const getBookingForSlot = (time, bay) => {
    if (!bookings || bookings.length === 0) {
      return null;
    }

    const booking = bookings.find((booking) => {
      if (booking.date !== selectedDate) {
        return false;
      }

      if (!bayMatches(booking.bay, bay)) {
        return false;
      }

      if (booking.startTime !== time) {
        return false;
      }

      return true;
    });

    return booking;
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

  const renderTimeSlot = (time, bay) => {
    const booking = getBookingForSlot(time, bay);
    const isSlotBooked = isBookingInSlot(time, bay);

    if (booking) {
      const span = getBookingSpan(booking);
      const displayName =
        booking.bookingType === "member" ? booking.memberName : "Your Booking";

      return (
        <div className="relative h-16">
          <div
            className="absolute inset-x-1 top-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg flex flex-col justify-between py-2 px-3 border border-green-400"
            style={{ height: `${span * 64 - 15}px` }}
          >
            <div className="flex-1">
              <div className="text-sm font-semibold truncate">
                👤 {displayName}
              </div>
              <div className="text-sm opacity-90">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onJoinSlotClick(booking);
              }}
              className="bg-white hover:bg-gray-100 rounded-full flex items-center justify-center text-black transition-all duration-200 self-end -mt-6 -mr-3 cursor-pointer shadow-md absolute bottom-1 right-3 z-10 w-8 h-8"
            >
              <Plus size={16} className="text-gray-700" />
            </button>
          </div>
        </div>
      );
    } else if (isSlotBooked) {
      return <div className="h-16 border-b border-gray-100 bg-green-50"></div>;
    } else {
      return (
        <button
          onClick={() => onSlotClick(time, bay)}
          className="w-full h-16 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100 group cursor-pointer"
        >
          <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">
                <Plus />
              </span>
            </div>
          </div>
        </button>
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <button
            onClick={onBookSlotClick}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Book a Slot
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={goToPreviousDay}
                className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={goToToday}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 text-sm font-medium"
                >
                  Today
                </button>

                <div className="relative">
                  <button
                    ref={dateButtonRef}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 text-sm font-medium"
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
                className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Bay Selection */}
            <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-md border border-gray-200">
              {["Bay 1", "Bay 2", "Both"].map((bay) => (
                <button
                  key={bay}
                  onClick={() => setSelectedBay(bay)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedBay === bay
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
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

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div
            className={`grid ${
              selectedBay === "Both"
                ? "grid-cols-[100px_1fr_1fr]"
                : "grid-cols-[100px_1fr]"
            } border-b bg-gradient-to-r from-gray-50 to-gray-100`}
          >
            <div className="p-4 text-sm font-semibold text-gray-600 border-r border-gray-200 bg-gray-100">
              GMT-08
            </div>
            {selectedBay === "Both" ? (
              <>
                <div className="p-4 text-center text-sm font-semibold text-gray-900 border-r border-gray-200">
                  Bay 1
                </div>
                <div className="p-4 text-center text-sm font-semibold text-gray-900">
                  Bay 2
                </div>
              </>
            ) : (
              <div className="p-4 text-center text-sm font-semibold text-gray-900">
                {selectedBay}
              </div>
            )}
          </div>

          {/* Time Slots */}
          {timeSlots.map((time) => (
            <div
              key={time}
              className={`grid ${
                selectedBay === "Both"
                  ? "grid-cols-[100px_1fr_1fr]"
                  : "grid-cols-[100px_1fr]"
              } hover:bg-gray-50 transition-colors duration-150`}
            >
              <div className="p-4 text-sm text-gray-600 border-r border-gray-200 bg-gray-50 flex items-center">
                <span className="font-medium">{formatTime(time)}</span>
              </div>

              {selectedBay === "Both" ? (
                <>
                  <div className="border-r border-gray-200 relative">
                    {renderTimeSlot(time, "Bay 1")}
                  </div>
                  <div className="relative">
                    {renderTimeSlot(time, "Bay 2")}
                  </div>
                </>
              ) : (
                <div className="relative">
                  {renderTimeSlot(time, selectedBay)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
