"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  X,
  CalendarIcon,
  ChevronDown,
  AlertCircle,
  User,
  Search,
  Clock,
  Users,
  MapPin,
  DollarSign,
  Loader2,
} from "lucide-react";
import DatePicker from "./date-picker";
import toast from "react-hot-toast";
import useBookingStore from "@/stores/BookingStore";
import useUserStore from "@/stores/UserStore";

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
  isBookingLoading = false,
}) {
  // State management
  const [bookingType, setBookingType] = useState("yourself");
  const [memberName, setMemberName] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [playingTime, setPlayingTime] = useState(1);
  const [playerOption, setPlayerOption] = useState({
    type: "single",
    label: "Single Member",
    guests: 0,
    price: 0,
  });
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
  const [playerOptions, setPlayerOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // Refs for click outside detection
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
  const memberDropdownRef = useRef(null);
  const memberInputRef = useRef(null);

  const { checkAvailability, isLoading: availabilityLoading } =
    useBookingStore();
  const { getAllUsers } = useUserStore();

  // Time slots configuration
  const timeSlots = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, "0");
      return `${hour}:00`;
    });
  }, []);

  // Timezone detection
  const timezone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (error) {
      console.error(
        "Failed to get timezone, falling back to Asia/Dhaka:",
        error
      );
      return "Asia/Dhaka";
    }
  }, []);

  // Utility functions
  const isoToLocalTime = useCallback((isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formatTime = useCallback((time) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  }, []);

  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const calculateEndTime = useCallback((start, duration) => {
    if (!start) return "";
    const startHour = parseInt(start.split(":")[0]);
    const endHour = (startHour + duration) % 24;
    return `${endHour.toString().padStart(2, "0")}:00`;
  }, []);

  // Debounced user search
  const debouncedSearch = useCallback(
    (searchTerm) => {
      const fetchUsers = async () => {
        if (bookingType === "member") {
          setUsersLoading(true);
          try {
            const result = await getAllUsers({
              searchTerm: searchTerm || undefined,
              page: 1,
              limit: 10,
            });
            setUsers(result || []);
          } catch (error) {
            console.error("Failed to fetch users:", error);
            setUsers([]);
            toast.error("Failed to fetch users");
          } finally {
            setUsersLoading(false);
          }
        }
      };

      const timer = setTimeout(fetchUsers, 300);
      return () => clearTimeout(timer);
    },
    [bookingType, getAllUsers]
  );

  // Player options based on playing time
  useEffect(() => {
    const options = [
      { type: "single", label: "Single Member", guests: 0, price: 0 },
    ];

    const priceMap = {
      1: { guest1: 10 },
      2: { guest1: 20, guest2: 35, guest3: 45 },
      4: { guest1: 40, guest2: 70, guest3: 90 },
    };

    if (priceMap[playingTime]) {
      const prices = priceMap[playingTime];
      if (prices.guest1) {
        options.push({
          type: "guest1",
          label: "Member with 1 Guest",
          guests: 1,
          price: prices.guest1,
        });
      }
      if (prices.guest2) {
        options.push({
          type: "guest2",
          label: "Member with 2 Guests",
          guests: 2,
          price: prices.guest2,
        });
      }
      if (prices.guest3) {
        options.push({
          type: "guest3",
          label: "Member with 3 Guests",
          guests: 3,
          price: prices.guest3,
        });
      }
    }

    setPlayerOptions(options);

    // Reset player option if invalid for current playing time
    if (
      (playingTime === 1 && playerOption.guests > 1) ||
      !options.find((opt) => opt.type === playerOption.type)
    ) {
      setPlayerOption(options[0]);
    }
  }, [playingTime, playerOption.type, playerOption.guests]);

  // User search effect
  useEffect(() => {
    const cleanup = debouncedSearch(memberSearchTerm);
    return cleanup;
  }, [memberSearchTerm, debouncedSearch]);

  // Reset member selection when booking type changes
  useEffect(() => {
    if (bookingType === "member") {
      setMemberSearchTerm("");
      setSelectedMember(null);
      setMemberName("");
    }
  }, [bookingType]);

  // Conflict checking
  const checkForConflicts = useCallback(() => {
    if (!startTime || !endTime || !selectedBay) {
      setConflictWarning("");
      return false;
    }

    const newStart = parseInt(startTime.split(":")[0]);
    const newEnd = parseInt(endTime.split(":")[0]);

    const conflict = existingBookings.find((booking) => {
      if (booking.date !== selectedDate || booking.bay !== selectedBay) {
        return false;
      }

      const existingStartLocal = isoToLocalTime(booking.startTime);
      const existingEndLocal = isoToLocalTime(booking.endTime);
      const existingStart = parseInt(existingStartLocal.split(":")[0]);
      const existingEnd = parseInt(existingEndLocal.split(":")[0]);

      // Handle conflicts considering overnight bookings
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
      const conflictMessage = `Time conflicts with existing booking (${formatTime(
        isoToLocalTime(conflict.startTime)
      )} - ${formatTime(isoToLocalTime(conflict.endTime))})`;
      setConflictWarning(conflictMessage);
      return true;
    } else {
      setConflictWarning("");
      return false;
    }
  }, [
    startTime,
    endTime,
    selectedBay,
    existingBookings,
    selectedDate,
    isoToLocalTime,
    formatTime,
  ]);

  // Time slot availability checking
  const isTimeSlotAvailable = useCallback(
    (time) => {
      if (!selectedModalClub || !selectedBay) return false;

      const dateStr = selectedDate;
      const potentialStart = new Date(`${dateStr}T${time}:00`);
      const potentialEnd = new Date(potentialStart);
      potentialEnd.setHours(potentialEnd.getHours() + playingTime);

      return !modalAvailability.some((booking) => {
        if (
          booking.bay !== selectedBay ||
          booking.club !== selectedModalClub._id
        ) {
          return false;
        }

        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);

        return (
          (potentialStart >= bookingStart && potentialStart < bookingEnd) ||
          (potentialEnd > bookingStart && potentialEnd <= bookingEnd) ||
          (potentialStart <= bookingStart && potentialEnd >= bookingEnd)
        );
      });
    },
    [
      selectedModalClub,
      selectedBay,
      selectedDate,
      playingTime,
      modalAvailability,
    ]
  );

  // Event handlers
  const handleMemberSelect = useCallback((user) => {
    setSelectedMember(user);
    setMemberName(user.name);
    setMemberSearchTerm(user.name);
    setShowMemberDropdown(false);
    setFormErrors((prev) => ({ ...prev, member: null }));
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const errors = {};

    if (!startTime) errors.startTime = "Please select a start time";
    if (!selectedBay) errors.bay = "Please select a bay";
    if (!selectedModalClub) errors.club = "Please select a club";
    if (bookingType === "member" && !selectedMember) {
      errors.member = "Please select a member";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [startTime, selectedBay, selectedModalClub, bookingType, selectedMember]);

  const handleConfirm = useCallback(() => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
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
      memberName: bookingType === "member" ? selectedMember.name : "",
      memberId: bookingType === "member" ? selectedMember._id : null,
      playingTime,
      numberOfPlayers: playerOption.guests + 1,
      numberOfGuests: playerOption.guests,
      bay: selectedBay,
      startTime,
      endTime,
      clubId: selectedModalClub._id,
      price: playerOption.price,
    };

    onConfirm(bookingData);
  }, [
    validateForm,
    checkForConflicts,
    bookingType,
    selectedMember,
    playingTime,
    playerOption,
    selectedBay,
    startTime,
    endTime,
    selectedModalClub,
    onConfirm,
  ]);

  // Click outside handlers
  const useClickOutside = (ref, buttonRef, isOpen, setIsOpen) => {
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          isOpen &&
          ref.current &&
          !ref.current.contains(event.target) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      }

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, ref, buttonRef, setIsOpen]);
  };

  useClickOutside(
    datePickerRef,
    dateButtonRef,
    showDatePicker,
    setShowDatePicker
  );
  useClickOutside(
    playersDropdownRef,
    playersButtonRef,
    showPlayersDropdown,
    setShowPlayersDropdown
  );
  useClickOutside(
    startTimeDropdownRef,
    startTimeButtonRef,
    showStartTimeDropdown,
    setShowStartTimeDropdown
  );
  useClickOutside(
    clubDropdownRef,
    clubButtonRef,
    showClubDropdown,
    setShowClubDropdown
  );
  useClickOutside(
    bayDropdownRef,
    bayButtonRef,
    showBayDropdown,
    setShowBayDropdown
  );
  useClickOutside(
    memberDropdownRef,
    memberInputRef,
    showMemberDropdown,
    setShowMemberDropdown
  );

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && selectedSlot) {
      setStartTime(selectedSlot.time || "");
      setSelectedBay(selectedSlot.bay || "");
      setSelectedModalClub(selectedClub);
      setFormErrors({});
    }
  }, [isOpen, selectedSlot, selectedClub]);

  // Load availability when club or date changes
  useEffect(() => {
    if (selectedModalClub && selectedDate) {
      const loadAvailability = async () => {
        try {
          const result = await checkAvailability(
            selectedDate,
            selectedModalClub._id,
            timezone
          );
          setModalAvailability(result || []);
        } catch (error) {
          console.error("Failed to check availability:", error);
          setModalAvailability([]);
        }
      };
      loadAvailability();
    }
  }, [selectedModalClub, selectedDate, checkAvailability, timezone]);

  // Auto-select first bay when club changes
  useEffect(() => {
    if (selectedModalClub) {
      const clubBays = selectedModalClub.bays || [];
      if (clubBays.length > 0 && !clubBays.includes(selectedBay)) {
        setSelectedBay(clubBays[0]);
      }
    }
  }, [selectedModalClub, selectedBay]);

  // Update end time when start time or playing time changes
  useEffect(() => {
    if (startTime) {
      const newEndTime = calculateEndTime(startTime, playingTime);
      setEndTime(newEndTime);
      setTimeout(checkForConflicts, 0);
    }
  }, [startTime, playingTime, calculateEndTime, checkForConflicts]);

  // Check conflicts when bay changes
  useEffect(() => {
    if (startTime && endTime) {
      checkForConflicts();
    }
  }, [selectedBay, startTime, endTime, checkForConflicts]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
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
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  bookingType === "yourself"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Book for Yourself
              </button>
              <button
                onClick={() => setBookingType("member")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
              <div className="relative">
                <div className="relative">
                  <input
                    ref={memberInputRef}
                    type="text"
                    value={memberSearchTerm}
                    onChange={(e) => {
                      setMemberSearchTerm(e.target.value);
                      setShowMemberDropdown(true);
                      if (!e.target.value) {
                        setSelectedMember(null);
                        setMemberName("");
                      }
                    }}
                    onFocus={() => setShowMemberDropdown(true)}
                    placeholder="Search and select member..."
                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {usersLoading && (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    )}
                  </div>
                </div>

                {showMemberDropdown && (
                  <div
                    ref={memberDropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
                  >
                    {usersLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto mb-2"></div>
                        Loading members...
                      </div>
                    ) : users.length > 0 ? (
                      users.map((user) => (
                        <button
                          key={user._id}
                          onClick={() => handleMemberSelect(user)}
                          className={`w-full p-4 text-left hover:bg-blue-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${
                            selectedMember?._id === user._id
                              ? "bg-blue-50 text-blue-900"
                              : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                            {user.role && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {user.role}
                              </span>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {memberSearchTerm
                          ? "No members found"
                          : "Start typing to search members"}
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
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
                  {playerOption.label}
                  {playerOption.price > 0 ? ` - $${playerOption.price}` : ""}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {showPlayersDropdown && (
                <div
                  ref={playersDropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  {playerOptions.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => {
                        setPlayerOption(option);
                        setShowPlayersDropdown(false);
                      }}
                      className={`w-full p-4 text-left hover:bg-blue-50 transition-colors duration-200 font-medium ${
                        playerOption.type === option.type
                          ? "bg-blue-50 text-blue-900"
                          : ""
                      } ${option.guests > 0 ? "border-t border-gray-200" : ""}`}
                    >
                      {option.label}
                      {option.price > 0 ? ` - $${option.price}` : ""}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bay Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Bay
            </label>
            {selectedModalClub && selectedModalClub.bays.length > 2 ? (
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
              <div className="grid grid-cols-2 gap-3">
                {selectedModalClub?.bays.map((bay) => (
                  <button
                    key={bay}
                    onClick={() => setSelectedBay(bay)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedBay === bay
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {bay}
                  </button>
                ))}
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
              {availabilityLoading ? (
                <div className="w-full p-4 border border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-gray-600">
                    Loading available times...
                  </span>
                </div>
              ) : (
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
                      {timeSlots.map((time) => {
                        const isAvailable = isTimeSlotAvailable(time);
                        return (
                          <button
                            key={time}
                            onClick={() => {
                              if (isAvailable) {
                                setStartTime(time);
                                setShowStartTimeDropdown(false);
                              }
                            }}
                            disabled={!isAvailable}
                            className={`w-full p-3 text-left transition-colors duration-200 font-medium ${
                              isAvailable
                                ? "hover:bg-blue-50 cursor-pointer"
                                : "text-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {formatTime(time)}
                            {!isAvailable && (
                              <span className="text-xs text-gray-400 ml-2">
                                (Unavailable)
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* End Time */}
              <div className="relative">
                <div className="w-full p-4 border border-gray-200 rounded-xl text-left flex items-center justify-between bg-gray-100 cursor-not-allowed">
                  <span className="text-gray-500 font-medium">
                    {endTime
                      ? formatTime(endTime)
                      : "End Time (Auto-calculated)"}
                  </span>
                  <div className="text-gray-400 text-sm">🔒</div>
                </div>
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
              className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!!conflictWarning || availabilityLoading}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                conflictWarning || availabilityLoading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
              }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
