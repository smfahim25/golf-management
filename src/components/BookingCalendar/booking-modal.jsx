"use client";

import { useState, useEffect, useRef } from "react";
import { X, CalendarIcon, ChevronDown, AlertCircle } from "lucide-react";
import DatePicker from "./date-picker";
import toast from "react-hot-toast";
import useBookingStore from "@/stores/BookingStore";

export default function BookingModal({
  isOpen,
  onClose,
  selectedSlot,
  onConfirm,
  selectedDate,
  onDateChange,
  existingBookings,
  selectedClub,
  clubs,
}) {
  const [bookingType, setBookingType] = useState("yourself");
  const [memberName, setMemberName] = useState("");
  const [playingTime, setPlayingTime] = useState(1);
  const [numberOfPlayers, setNumberOfPlayers] = useState("single");
  const [selectedBay, setSelectedBay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPlayersDropdown, setShowPlayersDropdown] = useState(false);
  const [showStartTimeDropdown, setShowStartTimeDropdown] = useState(false);
  const [conflictWarning, setConflictWarning] = useState("");
  const [selectedModalClub, setSelectedModalClub] = useState(null);
  const [showClubDropdown, setShowClubDropdown] = useState(false);
  const [modalAvailability, setModalAvailability] = useState([]);
  const [showBayDropdown, setShowBayDropdown] = useState(false);

  const datePickerRef = useRef(null);
  const dateButtonRef = useRef(null);
  const playersDropdownRef = useRef(null);
  const playersButtonRef = useRef(null);
  const startTimeDropdownRef = useRef(null);
  const startTimeButtonRef = useRef(null);
  const clubDropdownRef = useRef(null);
  const clubButtonRef = useRef(null);
  const bayDropdownRef = useRef(null);
  const bayButtonRef = useRef(null);

  const { checkAvailability, isLoading: availabilityLoading } =
    useBookingStore();

  const timeSlots = [
    "00:00",
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
  ];

  // Get available bays from selected club
  const availableBays = selectedClub?.bays || [];

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

  const calculateEndTime = (start, duration) => {
    if (!start) return "";
    const startHour = Number.parseInt(start.split(":")[0]);
    const endHour = (startHour + duration) % 24;
    return `${endHour.toString().padStart(2, "0")}:00`;
  };

  const checkForConflicts = () => {
    if (!startTime || !endTime || !selectedBay) {
      setConflictWarning("");
      return false;
    }

    const newStart = Number.parseInt(startTime.split(":")[0]);
    const newEnd = Number.parseInt(endTime.split(":")[0]);

    const conflict = existingBookings.find((booking) => {
      if (booking.date !== selectedDate) return false;
      if (booking.bay !== selectedBay) return false;

      const existingStart = Number.parseInt(booking.startTime.split(":")[0]);
      const existingEnd = Number.parseInt(booking.endTime.split(":")[0]);

      if (existingEnd > existingStart && newEnd > newStart) {
        return (
          (newStart >= existingStart && newStart < existingEnd) ||
          (newEnd > existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd)
        );
      } else if (existingEnd <= existingStart && newEnd <= newStart) {
        return (
          newStart >= existingStart ||
          newStart < existingEnd ||
          newEnd > existingStart ||
          newEnd <= existingEnd ||
          (newStart <= existingStart && newEnd >= existingEnd)
        );
      } else {
        return (
          (newStart >= existingStart && newStart < 24) ||
          (newEnd > 0 && newEnd <= existingEnd) ||
          (existingStart >= newStart && existingStart < 24) ||
          (existingEnd > 0 && existingEnd <= newEnd)
        );
      }
    });

    if (conflict) {
      setConflictWarning(
        `This time conflicts with an existing booking (${formatTime(
          conflict.startTime
        )} - ${formatTime(conflict.endTime)})`
      );
      return true;
    } else {
      setConflictWarning("");
      return false;
    }
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
        showPlayersDropdown &&
        playersDropdownRef.current &&
        !playersDropdownRef.current.contains(event.target) &&
        playersButtonRef.current &&
        !playersButtonRef.current.contains(event.target)
      ) {
        setShowPlayersDropdown(false);
      }
    }

    if (showPlayersDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPlayersDropdown]);

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showBayDropdown &&
        bayDropdownRef.current &&
        !bayDropdownRef.current.contains(event.target) &&
        bayButtonRef.current &&
        !bayButtonRef.current.contains(event.target)
      ) {
        setShowBayDropdown(false);
      }
    }

    if (showBayDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBayDropdown]);

  useEffect(() => {
    if (startTime) {
      const newEndTime = calculateEndTime(startTime, playingTime);
      setEndTime(newEndTime);
      setTimeout(checkForConflicts, 0);
    }
  }, [startTime, playingTime]);

  useEffect(() => {
    if (startTime && endTime) {
      checkForConflicts();
    }
  }, [selectedBay]);

  useEffect(() => {
    if (selectedSlot) {
      setStartTime(selectedSlot.time || "");
      setSelectedBay(selectedSlot.bay || "");
      setSelectedModalClub(selectedClub); // Set the modal club to current selected club
    }
  }, [selectedSlot, selectedClub]);

  // Check availability when modal club or date changes
  useEffect(() => {
    if (selectedModalClub && selectedDate) {
      const loadAvailability = async () => {
        try {
          const result = await checkAvailability(
            selectedDate,
            selectedModalClub._id
          );
          setModalAvailability(result || []);
        } catch (error) {
          console.error("Failed to check availability:", error);
          setModalAvailability([]);
        }
      };
      loadAvailability();
    }
  }, [selectedModalClub, selectedDate, checkAvailability]);

  // Reset bay selection when club changes
  useEffect(() => {
    if (selectedModalClub) {
      const clubBays = selectedModalClub.bays || [];
      if (clubBays.length > 0 && !clubBays.includes(selectedBay)) {
        setSelectedBay(clubBays[0]);
      }
    }
  }, [selectedModalClub]);

  const handleConfirm = () => {
    if (!startTime) {
      toast.error("Please select a start time");
      return;
    }

    if (!selectedBay) {
      toast.error("Please select a bay");
      return;
    }

    if (!selectedModalClub) {
      toast.error("Please select a club");
      return;
    }

    if (bookingType === "member" && !memberName.trim()) {
      toast.error("Please enter member name");
      return;
    }

    if (checkForConflicts()) {
      toast.error(
        "This booking conflicts with an existing booking. Please select a different time or bay."
      );
      return;
    }

    const bookingData = {
      bookingType,
      memberName: bookingType === "member" ? memberName : "",
      playingTime,
      numberOfPlayers,
      bay: selectedBay,
      startTime,
      endTime,
      clubId: selectedModalClub._id,
    };

    onConfirm(bookingData);
  };

  const getAvailableTimeSlots = () => {
    if (!selectedModalClub || !selectedBay) return [];

    return timeSlots.filter((time) => {
      const hour = Number.parseInt(time.split(":")[0]);

      // Check against API availability data
      const isSlotBooked = modalAvailability.some((booking) => {
        if (booking.bay !== selectedBay) return false;
        if (booking.club !== selectedModalClub._id) return false;

        const bookingStart = Number.parseInt(booking.startTime.split(":")[0]);
        const bookingEnd = Number.parseInt(booking.endTime.split(":")[0]);
        const potentialEnd = (hour + playingTime) % 24;

        // Check if the potential booking would conflict
        if (bookingEnd > bookingStart) {
          return (
            (hour >= bookingStart && hour < bookingEnd) ||
            (potentialEnd > bookingStart && potentialEnd <= bookingEnd) ||
            (hour <= bookingStart && potentialEnd >= bookingEnd)
          );
        } else {
          return (
            hour >= bookingStart ||
            hour < bookingEnd ||
            potentialEnd > bookingStart ||
            potentialEnd <= bookingEnd ||
            (hour <= bookingStart && potentialEnd >= bookingEnd)
          );
        }
      });

      return !isSlotBooked;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Book a Slot</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Selected Club Info */}
          {selectedModalClub && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-1">
                Selected Club
              </h3>
              <p className="text-blue-700">{selectedModalClub.name}</p>
              <p className="text-blue-600 text-sm">
                {selectedModalClub.bays.length} bays available
              </p>
            </div>
          )}

          {/* Club Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Club
            </label>
            <div className="relative">
              <button
                ref={clubButtonRef}
                onClick={() => setShowClubDropdown(!showClubDropdown)}
                className="w-full p-4 border border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-gray-50 cursor-pointer"
              >
                <span className="font-medium">
                  {selectedModalClub?.name || "Select Club"}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {showClubDropdown && (
                <div
                  ref={clubDropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
                >
                  {clubs.map((club) => (
                    <button
                      key={club._id}
                      onClick={() => {
                        setSelectedModalClub(club);
                        setShowClubDropdown(false);
                      }}
                      className={`w-full p-4 text-left hover:bg-blue-50 transition-colors duration-200 font-medium ${
                        selectedModalClub?._id === club._id
                          ? "bg-blue-50 text-blue-900"
                          : ""
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

            {availabilityLoading && (
              <div className="mt-2 flex items-center text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                Checking availability...
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Pick a Date
            </label>
            <div className="relative">
              <button
                ref={dateButtonRef}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="w-full p-4 border border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {showDatePicker && (
                <div
                  ref={datePickerRef}
                  className="absolute top-full left-0 right-0 mt-2 z-10"
                >
                  <DatePicker
                    selectedDate={selectedDate}
                    onDateSelect={(date) => {
                      onDateChange(date);
                      setShowDatePicker(false);
                      setTimeout(checkForConflicts, 0);
                    }}
                    onClose={() => setShowDatePicker(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Booking Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Whom are you booking for?
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setBookingType("yourself")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  bookingType === "yourself"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Book for Yourself
              </button>
              <button
                onClick={() => setBookingType("member")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  bookingType === "member"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Book for Member
              </button>
            </div>
          </div>

          {/* Member Name Input */}
          {bookingType === "member" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Member
              </label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder="Enter member name"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
              />
            </div>
          )}

          {/* Playing Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Playing Time
            </label>
            <div className="flex space-x-3">
              {[1, 2, 4].map((hours) => (
                <button
                  key={hours}
                  onClick={() => setPlayingTime(hours)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    playingTime === hours
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {hours} Hour{hours > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Number of Players */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Number of Players
            </label>
            <div className="relative">
              <button
                ref={playersButtonRef}
                onClick={() => setShowPlayersDropdown(!showPlayersDropdown)}
                className="w-full p-4 border border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-gray-50 cursor-pointer"
              >
                <span className="font-medium">
                  {numberOfPlayers === "single"
                    ? "Single Member"
                    : "Member with 1 Guest - $10"}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {showPlayersDropdown && (
                <div
                  ref={playersDropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setNumberOfPlayers("single");
                      setShowPlayersDropdown(false);
                    }}
                    className="w-full p-4 text-left hover:bg-blue-50 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Single Member
                  </button>
                  <button
                    onClick={() => {
                      setNumberOfPlayers("guest");
                      setShowPlayersDropdown(false);
                    }}
                    className="w-full p-4 text-left hover:bg-blue-50 transition-colors duration-200 border-t border-gray-200 font-medium"
                  >
                    Member with 1 Guest - $10
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-3 rounded-lg">
              💡 Please note that additional fees for guests will apply,
              determined by the chosen session duration.
            </p>
          </div>

          {/* Bay Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Bay
            </label>
            {selectedModalClub && selectedModalClub.bays.length > 2 ? (
              // Dropdown for more than 2 bays
              <div className="relative">
                <button
                  ref={bayButtonRef}
                  onClick={() => setShowBayDropdown(!showBayDropdown)}
                  className="w-full p-4 border border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-gray-50 cursor-pointer"
                >
                  <span className="font-medium">
                    {selectedBay || "Select Bay"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>

                {showBayDropdown && (
                  <div
                    ref={bayDropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
                  >
                    {selectedModalClub.bays.map((bay) => (
                      <button
                        key={bay}
                        onClick={() => {
                          setSelectedBay(bay);
                          setShowBayDropdown(false);
                        }}
                        className={`w-full p-4 text-left hover:bg-blue-50 transition-colors duration-200 font-medium ${
                          selectedBay === bay ? "bg-blue-50 text-blue-900" : ""
                        }`}
                      >
                        {bay}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              // Buttons for 2 or fewer bays
              <div className="grid grid-cols-2 gap-3">
                {selectedModalClub?.bays.map((bay) => (
                  <button
                    key={bay}
                    onClick={() => setSelectedBay(bay)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      selectedBay === bay
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {bay}
                  </button>
                )) || []}
              </div>
            )}
          </div>

          {/* Booking Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Booking Time
            </label>
            <div className="space-y-3">
              {/* Start Time */}
              <div className="relative">
                <button
                  ref={startTimeButtonRef}
                  onClick={() =>
                    setShowStartTimeDropdown(!showStartTimeDropdown)
                  }
                  className="w-full p-4 border border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-gray-50 cursor-pointer"
                >
                  <span
                    className={`font-medium ${
                      startTime ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {startTime ? formatTime(startTime) : "Select Start Time"}
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
                          setStartTime(time);
                          setShowStartTimeDropdown(false);
                        }}
                        className="w-full p-3 text-left hover:bg-blue-50 transition-colors duration-200 font-medium"
                      >
                        {formatTime(time)}
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

              {/* End Time - Disabled */}
              <div className="relative">
                <div className="w-full p-4 border border-gray-200 rounded-xl text-left flex items-center justify-between bg-gray-100 cursor-not-allowed">
                  <span className="text-gray-500 font-medium">
                    {endTime
                      ? formatTime(endTime)
                      : "End Time (Auto-calculated)"}
                  </span>
                  <div className="text-gray-400 text-sm">🔒</div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  End time is automatically calculated based on playing duration
                </p>
              </div>
            </div>
          </div>

          {/* Conflict Warning */}
          {conflictWarning && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{conflictWarning}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!!conflictWarning}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer ${
                conflictWarning
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
              }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
