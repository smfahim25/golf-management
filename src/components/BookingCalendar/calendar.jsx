"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  Plus,
  Building2,
  ChevronDown,
} from "lucide-react";
import DatePicker from "./date-picker";
import useUserStore from "@/stores/UserStore";
import useAuthStore from "@/stores/AuthStore";

export default function Calendar({
  onSlotClick,
  onBookSlotClick,
  onJoinSlotClick,
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
  const [userCache, setUserCache] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(new Set());

  const datePickerRef = useRef(null);
  const dateButtonRef = useRef(null);
  const clubDropdownRef = useRef(null);
  const clubButtonRef = useRef(null);

  const { getUserById } = useUserStore();
  const { user } = useAuthStore();

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

  const clubBays = selectedClub?.bays || [];
  const baysPerView = 2;

  const convertISOToTimeFormat = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const convertISOToLocalDate = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const transformedAvailability = useCallback(() => {
    if (!availability || !Array.isArray(availability)) return [];

    return availability.map((booking) => ({
      ...booking,
      // Keep original ISO strings for proper date/time handling
      originalStartTime: booking.startTime,
      originalEndTime: booking.endTime,

      startTime: convertISOToTimeFormat(booking.startTime),
      endTime: convertISOToTimeFormat(booking.endTime),

      startDate: convertISOToLocalDate(booking.startTime),
      endDate: convertISOToLocalDate(booking.endTime),
      date: booking.date || booking.startDateTime?.split("T")[0],

      numberOfPlayers:
        booking.members?.reduce(
          (total, member) => total + 1 + (member.guests || 0),
          0
        ) || 0,

      isCurrentUserMember:
        booking.members?.some((member) => member.userId === user?._id) || false,
    }));
  }, [availability, user?._id]);

  const stableGetUserById = useCallback(
    async (userId) => {
      try {
        const userData = await getUserById(userId);
        setUserCache((prev) => ({
          ...prev,
          [userId]: userData,
        }));
        return userData;
      } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
        setUserCache((prev) => ({
          ...prev,
          [userId]: null,
        }));
        throw error;
      } finally {
        setLoadingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
    },
    [getUserById]
  );

  useEffect(() => {
    const transformedData = transformedAvailability();
    if (!transformedData || !Array.isArray(transformedData)) return;

    const userIds = [
      ...new Set(
        transformedData.flatMap(
          (booking) =>
            booking.members?.map((member) => member.userId).filter(Boolean) ||
            []
        )
      ),
    ];

    const fetchUsers = async () => {
      for (const userId of userIds) {
        if (userCache[userId] !== undefined || loadingUsers.has(userId)) {
          continue;
        }

        setLoadingUsers((prev) => new Set([...prev, userId]));

        await stableGetUserById(userId).catch(() => {});
      }
    };

    fetchUsers();
  }, [
    availability,
    userCache,
    loadingUsers,
    stableGetUserById,
    transformedAvailability,
  ]);

  const visibleBaysForButtons = clubBays.slice(
    bayStartIndex,
    bayStartIndex + baysPerView
  );

  const visibleBays =
    selectedBayView === "Both"
      ? clubBays.slice(bayStartIndex, bayStartIndex + baysPerView)
      : [selectedBayView];

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
    const [year, month, day] = selectedDate.split("-").map(Number);
    const currentDate = new Date(year, month - 1, day);
    currentDate.setDate(currentDate.getDate() - 1);

    const newYear = currentDate.getFullYear();
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const newDay = String(currentDate.getDate()).padStart(2, "0");

    const newDate = `${newYear}-${newMonth}-${newDay}`;
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

  const getBookingForSlot = (time, bay) => {
    const transformedData = transformedAvailability();
    if (!transformedData || !Array.isArray(transformedData)) return null;

    return transformedData.find((booking) => {
      if (booking.bay !== bay) return false;
      if (booking.club !== selectedClub?._id) return false;

      const startDate = convertISOToLocalDate(booking.originalStartTime);
      const endDate = convertISOToLocalDate(booking.originalEndTime);
      const startTime = convertISOToTimeFormat(booking.originalStartTime);
      const endTime = convertISOToTimeFormat(booking.originalEndTime);

      // Check if this slot falls within the booking period
      if (startDate === selectedDate) {
        // Booking starts on selected date
        return startTime === time;
      } else if (endDate === selectedDate && startDate !== selectedDate) {
        // Booking ends on selected date but started on previous date
        // Show the booking block starting from 00:00 on the end date
        return time === "00:00";
      }

      return false;
    });
  };

  const isBookingInSlot = (time, bay) => {
    const transformedData = transformedAvailability();
    if (!transformedData || !Array.isArray(transformedData)) return false;

    const slotHour = parseInt(time.split(":")[0]);

    return transformedData.some((booking) => {
      if (booking.bay !== bay) return false;
      if (booking.club !== selectedClub?._id) return false;

      const startDate = convertISOToLocalDate(booking.originalStartTime);
      const endDate = convertISOToLocalDate(booking.originalEndTime);
      const startTime = convertISOToTimeFormat(booking.originalStartTime);
      const endTime = convertISOToTimeFormat(booking.originalEndTime);

      const startHour = parseInt(startTime.split(":")[0]);
      const endHour = parseInt(endTime.split(":")[0]);

      // Case 1: Booking starts and ends on the selected date (same day)
      if (startDate === selectedDate && endDate === selectedDate) {
        return slotHour >= startHour && slotHour < endHour;
      }

      // Case 2: Booking starts on selected date but ends on next day
      else if (startDate === selectedDate && endDate !== selectedDate) {
        return slotHour >= startHour; // All slots from start time to end of day
      }

      // Case 3: Booking started on previous date but ends on selected date
      else if (startDate !== selectedDate && endDate === selectedDate) {
        return slotHour < endHour; // All slots from start of day to end time
      }

      // Case 4: Multi-day booking that spans across selected date
      else if (startDate < selectedDate && endDate > selectedDate) {
        return true; // Entire day is booked
      }

      return false;
    });
  };

  const renderTimeSlot = (time, bay) => {
    const booking = getBookingForSlot(time, bay);
    const isSlotBooked = isBookingInSlot(time, bay);

    const currentDate = new Date();

    const [year, month, day] = selectedDate.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const slotDateTime = new Date(year, month - 1, day, hour, minute);

    const isPast = slotDateTime.getTime() <= currentDate.getTime();

    const getShortDisplayName = (fullName, userId) => {
      if (
        !fullName ||
        fullName === "Unknown User" ||
        fullName === "Loading..."
      ) {
        return fullName;
      }

      const nameParts = fullName.trim().split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`;
      }

      if (nameParts[0].length > 8) {
        return `${nameParts[0].substring(0, 8)}...`;
      }

      return nameParts[0];
    };

    if (booking) {
      const getAvailableSpanWithinHours = (booking, currentTime) => {
        const [currentHour] = currentTime.split(":").map(Number);

        const startDate = convertISOToLocalDate(booking.originalStartTime);
        const endDate = convertISOToLocalDate(booking.originalEndTime);
        const endTime = convertISOToTimeFormat(booking.originalEndTime);
        const bookingEndHour = parseInt(endTime.split(":")[0]);

        let remainingHours;

        if (startDate === selectedDate && endDate === selectedDate) {
          remainingHours = bookingEndHour - currentHour;
        } else if (startDate === selectedDate && endDate !== selectedDate) {
          remainingHours = 24 - currentHour;
        } else if (startDate !== selectedDate && endDate === selectedDate) {
          remainingHours = bookingEndHour - currentHour;
        } else if (startDate < selectedDate && endDate > selectedDate) {
          remainingHours = 24 - currentHour;
        } else {
          remainingHours = bookingEndHour - currentHour;
        }

        const endOfDayHour = 23;
        const maxPossibleSpan = endOfDayHour - currentHour + 1;

        return Math.min(Math.max(remainingHours, 1), maxPossibleSpan);
      };

      const actualSpan = getAvailableSpanWithinHours(booking, time);

      const members = booking.members || [];
      const memberUsers = members.map((member) => ({
        userId: member.userId,
        guests: member.guests || 0,
        user: userCache[member.userId],
        isLoading: loadingUsers.has(member.userId),
      }));

      const displayNames = memberUsers.map((memberData) => {
        let displayName = "Unknown User";
        if (memberData.isLoading) {
          displayName = "Loading...";
        } else if (memberData.user) {
          displayName = getShortDisplayName(
            memberData.user.name,
            memberData.userId
          );
        } else if (memberData.userId) {
          displayName = `User ${memberData.userId.slice(-8)}`;
        }

        if (memberData.guests > 0) {
          displayName += ` +${memberData.guests}G`;
        }

        return displayName;
      });

      const formatMemberList = (names, maxLength, screenSize = "mobile") => {
        if (names.length === 0) return "No members";
        if (names.length === 1) return names[0];

        if (screenSize === "mobile") {
          if (names.length <= 2) {
            return names.join(", ");
          }
          return `${names[0]} +${names.length - 1}`;
        }

        if (screenSize === "tablet") {
          const joinedNames = names.join(", ");
          if (joinedNames.length <= maxLength) {
            return joinedNames;
          }

          if (names.length > 2) {
            return `${names[0]}, ${names[1]} +${names.length - 2}`;
          }
          return `${names[0]} +${names.length - 1}`;
        }

        const joinedNames = names.join(", ");
        if (joinedNames.length <= maxLength) {
          return joinedNames;
        }

        return `${names[0]} +${names.length - 1}`;
      };

      const maxPlayers = booking.playingTime > 1 ? 4 : 2;
      const numberOfPlayers = booking.numberOfPlayers;

      const width = `calc(100% / ${maxPlayers} * ${numberOfPlayers})`;

      const isSlotFull =
        (booking.playingTime > 1 && booking.numberOfPlayers === 4) ||
        booking.playingTime === 1;
      const shouldShowJoinButton =
        !isSlotFull && !isPast && !booking.isCurrentUserMember;

      return (
        <div className="relative h-12 sm:h-14 lg:h-16">
          <div
            className={`absolute inset-0 ${
              isSlotFull || isPast ? "bg-red-500" : "bg-[#6fbf49]"
            } rounded-md sm:rounded-lg text-black font-bold flex flex-col justify-between p-1`}
            style={{
              height: `${actualSpan * 60}px`,
              width: width,

              "@media (minWidth: 640px)": {
                height: `${actualSpan * 56}px`,
              },
              "@media (minWidth: 1024px)": {
                height: `${actualSpan * 60}px`,
              },
            }}
          >
            <div className="flex-1 min-h-0">
              <div className="block sm:hidden">
                <div className="text-xs font-bold truncate leading-tight">
                  👤 {formatMemberList(displayNames, 12, "mobile")} (
                  {booking.numberOfPlayers})
                </div>

                <div className="text-xs opacity-90 truncate leading-tight">
                  {formatTime(booking.startTime).slice(0, 5)} -{" "}
                  {formatTime(booking.endTime).slice(0, 5)}
                </div>
              </div>

              <div className="hidden sm:block lg:hidden">
                <div className="text-sm font-bold truncate">
                  👤 {formatMemberList(displayNames, 20, "tablet")} (
                  {booking.numberOfPlayers})
                </div>

                <div className="text-sm opacity-90 truncate">
                  {formatTime(booking.startTime)} -{" "}
                  {formatTime(booking.endTime)}
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="text-xs sm:text-sm font-bold text-wrap">
                  👤{" "}
                  {displayNames.length > 0
                    ? formatMemberList(displayNames, 40, "desktop")
                    : "No members"}{" "}
                  ({booking.numberOfPlayers})
                </div>

                <div className="text-xs sm:text-sm opacity-90">
                  {formatTime(booking.startTime)} -{" "}
                  {formatTime(booking.endTime)}
                </div>
              </div>
            </div>

            {shouldShowJoinButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinSlotClick(booking);
                }}
                className="bg-white hover:bg-gray-100 active:bg-gray-200 rounded-full flex items-center justify-center text-black transition-colors duration-200 absolute bottom-1 right-1 
                      w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6
                      touch-manipulation" // Better touch handling on mobile
              >
                <Plus size={10} className="text-gray-700 sm:hidden" />
                <Plus size={12} className="text-gray-700 hidden sm:block" />
              </button>
            )}
          </div>
        </div>
      );
    }

    if (isSlotBooked) {
      return <div className="h-12 sm:h-14 lg:h-16 bg-white"></div>;
    }

    return (
      <button
        onClick={() => onSlotClick(time, bay)}
        className="w-full h-12 sm:h-14 lg:h-16 transition-colors duration-200 group flex items-center justify-center 
             hover:bg-blue-50 active:bg-blue-100 touch-manipulation" // Better mobile interaction
      >
        <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200">
          <Plus className="text-white w-3 h-3 sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
        </div>
      </button>
    );
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

  useEffect(() => {
    setBayStartIndex(0);
    setSelectedBayView("Both");
  }, [selectedClub]);

  return (
    <div className="bg-white relative">
      {/* Header Controls */}
      {isLoadingAvailability && (
        <div className="fixed inset-0 bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex items-center border border-gray-200">
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-xs sm:text-sm text-gray-900 font-medium">
              Checking availability...
            </span>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-2 sm:p-3 md:p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4 xl:flex-row xl:items-center xl:justify-between xl:space-y-0 xl:gap-6">
          {/* Book Slot Button */}
          <button
            onClick={onBookSlotClick}
            className="bg-primary hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-md sm:rounded-lg font-medium transition-colors duration-200 text-sm md:text-base w-full sm:w-full md:w-auto xl:flex-shrink-0 order-1 xl:order-none"
          >
            Book a Slot
          </button>

          {/* Controls Container */}
          <div className="flex flex-col space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:gap-3 xl:gap-4 order-2 xl:order-none">
            {/* Date Navigation */}
            <div className="flex items-center justify-center sm:justify-between lg:justify-start">
              <button
                onClick={goToPreviousDay}
                className="p-1.5 sm:p-2 hover:bg-gray-200 rounded transition-colors duration-200 flex-shrink-0"
                aria-label="Previous day"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 mx-1 sm:mx-2 md:mx-3">
                <button
                  onClick={goToToday}
                  className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  Today
                </button>

                <div className="relative">
                  <button
                    ref={dateButtonRef}
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 text-xs sm:text-sm font-medium min-w-0"
                  >
                    <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="hidden sm:inline truncate">
                      {formatDate(selectedDate)}
                    </span>
                    <span className="sm:hidden truncate text-xs">
                      {selectedDate.split("-")[2]}/{selectedDate.split("-")[1]}
                    </span>
                  </button>

                  {showDatePicker && (
                    <div
                      ref={datePickerRef}
                      className="absolute top-full left-0 mt-1 sm:mt-2 z-20"
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
                className="p-1.5 sm:p-2 hover:bg-gray-200 rounded transition-colors duration-200 flex-shrink-0"
                aria-label="Next day"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
            </div>

            {/* Club Selection */}
            <div className="relative w-full lg:w-auto lg:min-w-[180px] xl:min-w-[220px]">
              <button
                ref={clubButtonRef}
                onClick={() => setShowClubDropdown(!showClubDropdown)}
                className="flex items-center justify-between w-full space-x-2 px-3 py-2 sm:px-4 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200 text-xs sm:text-sm font-medium bg-white min-w-0"
              >
                <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0 flex-1">
                  <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                  <span className="truncate text-left">
                    {selectedClub?.name || "Select Club"}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              </button>

              {showClubDropdown && (
                <div
                  ref={clubDropdownRef}
                  className="absolute top-full left-0 right-0 mt-1 sm:mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-20 lg:right-auto lg:min-w-[220px] xl:min-w-[260px] overflow-hidden max-h-60 overflow-y-auto"
                >
                  {clubs.map((club) => (
                    <button
                      key={club._id}
                      onClick={() => {
                        onClubChange(club);
                        setShowClubDropdown(false);
                      }}
                      className={`w-full p-2.5 sm:p-3 text-left hover:bg-gray-50 transition-colors duration-200 font-medium text-xs sm:text-sm ${
                        selectedClub?._id === club._id ? "bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate pr-2">{club.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                          {club.bays.length} bays
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bay Selection with Navigation */}
            <div className="flex flex-col space-y-2 sm:space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:gap-2 xl:gap-3">
              {/* Bay Navigation */}
              {clubBays.length > baysPerView && (
                <div className="flex items-center justify-center gap-1 order-2 lg:order-1">
                  <button
                    onClick={goToPreviousBays}
                    disabled={!canGoToPreviousBays}
                    className={`p-1.5 sm:p-2 rounded transition-colors duration-200 ${
                      canGoToPreviousBays
                        ? "hover:bg-gray-200 text-gray-600"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                    aria-label="Previous bays"
                  >
                    <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="text-xs text-gray-500 px-1.5 sm:px-2 whitespace-nowrap">
                    {bayStartIndex + 1}-
                    {Math.min(bayStartIndex + baysPerView, clubBays.length)} of{" "}
                    {clubBays.length}
                  </span>
                  <button
                    onClick={goToNextBays}
                    disabled={!canGoToNextBays}
                    className={`p-1.5 sm:p-2 rounded transition-colors duration-200 ${
                      canGoToNextBays
                        ? "hover:bg-gray-200 text-gray-600"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                    aria-label="Next bays"
                  >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}

              {/* Bay Selection Buttons */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-white rounded-md p-0.5 sm:p-1 border border-gray-200 justify-center lg:justify-center order-1 lg:order-2 flex-wrap">
                <button
                  onClick={() => setSelectedBayView("Both")}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                    selectedBayView === "Both"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Both
                </button>
                {visibleBaysForButtons.map((bay) => (
                  <button
                    key={bay}
                    onClick={() => setSelectedBayView(bay)}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                      selectedBayView === bay
                        ? "bg-blue-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    } max-w-[70px] sm:max-w-[90px] md:max-w-none overflow-hidden`}
                    title={bay}
                  >
                    <span className="truncate">{bay}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid - Responsive Design */}
      <div className="w-full">
        <div className="block sm:hidden">
          <div className="space-y-4">
            {selectedBayView === "Both" && visibleBays.length > 1 ? (
              visibleBays.map((bay) => (
                <div
                  key={bay}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 rounded-t-lg">
                    <h3 className="text-sm font-medium text-gray-900">{bay}</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {timeSlots.map((time) => (
                      <div key={time} className="flex items-center px-4">
                        <div className="w-16 flex-shrink-0 flex items-center border-r-2 h-10">
                          <span className="text-xs text-gray-600">{time}</span>
                        </div>
                        <div className="flex-1 ml-3">
                          {renderTimeSlot(time, bay)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Mobile view with single bay
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 rounded-t-lg">
                  <h3 className="text-sm font-medium text-gray-900">
                    {selectedBayView === "Both"
                      ? visibleBays[0]
                      : selectedBayView}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {timeSlots.map((time) => (
                    <div key={time} className="flex items-center px-4 py-3">
                      <div className="w-16 flex-shrink-0">
                        <span className="text-xs text-gray-600">{time}</span>
                      </div>
                      <div className="flex-1 ml-3">
                        {renderTimeSlot(
                          time,
                          selectedBayView === "Both"
                            ? visibleBays[0]
                            : selectedBayView
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tablet View (screens 640px - 1024px) */}
        <div className="hidden sm:block lg:hidden">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[600px]">
                {/* Header Row */}
                <thead className="border-b bg-gradient-to-r from-gray-100 to-gray-200">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-600 w-20">
                      GMT-08
                    </th>
                    {selectedBayView === "Both" && visibleBays.length > 1 ? (
                      visibleBays.map((bay) => (
                        <th
                          key={bay}
                          className="border border-gray-300 p-3 text-center text-sm font-medium text-gray-900 min-w-[140px]"
                        >
                          {bay}
                        </th>
                      ))
                    ) : (
                      <th className="border border-gray-300 p-3 text-center text-sm font-medium text-gray-900">
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
                      <td className="border border-gray-300 px-2 py-1 text-sm text-gray-600 bg-white w-20">
                        {formatTime(time)}
                      </td>
                      {selectedBayView === "Both" && visibleBays.length > 1 ? (
                        visibleBays.map((bay) => (
                          <td
                            key={bay}
                            className="border border-gray-300 p-0 bg-white h-14"
                          >
                            {renderTimeSlot(time, bay)}
                          </td>
                        ))
                      ) : (
                        <td className="border border-gray-300 p-0 bg-white h-14">
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
        </div>

        {/* Desktop View (screens >= 1024px) - Your original code */}
        <div className="hidden lg:block">
          <div className="border border-gray-300 overflow-x-auto">
            <table className="w-full border-collapse min-w-[400px] sm:min-w-[500px] lg:min-w-0">
              {/* Header Row */}
              <thead className="border-b bg-gradient-to-r from-gray-100 to-gray-200">
                <tr>
                  <th className="border border-gray-300 p-2 sm:p-4 text-left text-xs sm:text-sm font-medium text-gray-600 w-16 sm:w-20 lg:w-24">
                    GMT-08
                  </th>
                  {selectedBayView === "Both" && visibleBays.length > 1 ? (
                    visibleBays.map((bay) => (
                      <th
                        key={bay}
                        className="border border-gray-300 p-2 sm:p-4 text-center text-xs sm:text-sm font-medium text-gray-900 min-w-[120px] sm:min-w-[150px]"
                      >
                        {bay}
                      </th>
                    ))
                  ) : (
                    <th className="border border-gray-300 p-2 sm:p-4 text-center text-xs sm:text-sm font-medium text-gray-900 min-w-[200px] sm:min-w-[250px]">
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
                    <td className="border border-gray-300 p-2 sm:p-4 text-xs sm:text-sm text-gray-600 bg-white w-16 sm:w-20 lg:w-24">
                      <span className="hidden sm:inline">
                        {formatTime(time)}
                      </span>
                      <span className="sm:hidden">{time}</span>
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
      </div>
    </div>
  );
}
