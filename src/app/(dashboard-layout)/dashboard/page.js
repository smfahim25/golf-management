"use client";

import BookingModal from "@/components/BookingCalendar/booking-modal";
import Calendar from "@/components/BookingCalendar/calendar";
import JoinSlotModal from "@/components/BookingCalendar/join-slot-modal";
import useAuthStore from "@/stores/AuthStore";
import useBookingStore from "@/stores/BookingStore";
import useClubStore from "@/stores/ClubStore";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

const localTimeToISO = (timeString, dateString, startTimeString = null) => {
  if (!timeString || !dateString) {
    console.error("Invalid timeString or dateString:", {
      timeString,
      dateString,
    });
    throw new Error("timeString and dateString are required");
  }

  if (!/^\d{1,2}:\d{2}$/.test(timeString)) {
    console.error("Invalid timeString format:", timeString);
    throw new Error("timeString must be in HH:MM format");
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error("Invalid dateString:", dateString);
    throw new Error("Invalid dateString provided");
  }

  const [hours, minutes] = timeString.split(":").map(Number);

  if (
    isNaN(hours) ||
    isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    console.error("Invalid time values:", { hours, minutes, timeString });
    throw new Error("Invalid time values in timeString");
  }

  if (startTimeString) {
    if (!/^\d{1,2}:\d{2}$/.test(startTimeString)) {
      console.error("Invalid startTimeString format:", startTimeString);
    } else {
      const [startHours] = startTimeString.split(":").map(Number);
      if (!isNaN(startHours) && hours < startHours) {
        date.setDate(date.getDate() + 1);
      }
    }
  }

  date.setHours(hours, minutes, 0, 0);

  if (isNaN(date.getTime())) {
    console.error("Invalid date after setting hours/minutes:", {
      hours,
      minutes,
      date,
    });
    throw new Error("Failed to create valid date");
  }

  return date.toISOString();
};

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedClub, setSelectedClub] = useState(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);

  const { clubs, fetchClubs, isLoading: clubsLoading } = useClubStore();
  const {
    availability,
    checkAvailability,
    createBooking,
    joinBooking,
    isLoading: availabilityLoading,
  } = useBookingStore();
  const { user } = useAuthStore();

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

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  useEffect(() => {
    if (clubs.length > 0 && !selectedClub) {
      setSelectedClub(clubs[0]);
    }
  }, [clubs, selectedClub]);

  useEffect(() => {
    if (selectedClub && selectedDate) {
      const loadAvailability = async () => {
        try {
          await checkAvailability(selectedDate, selectedClub._id, timezone);
        } catch (error) {
          console.error("Failed to check availability:", error);
        }
      };
      loadAvailability();
    }
  }, [selectedClub, selectedDate, checkAvailability, timezone]);

  const calculateEndTime = (startTime, durationHours) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHour = (hours + durationHours) % 24;
    return `${endHour.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const hasTimeConflict = (existingBooking, newBooking) => {
    if (existingBooking.bay !== newBooking.bay) return false;
    if (existingBooking.club !== selectedClub?._id) return false;

    const existingStart = new Date(existingBooking.startTime);
    const existingEnd = new Date(existingBooking.endTime);

    const newStart = new Date(
      localTimeToISO(newBooking.startTime, selectedDate)
    );
    const newEnd = new Date(
      localTimeToISO(newBooking.endTime, selectedDate, newBooking.startTime)
    );

    return newStart < existingEnd && newEnd > existingStart;
  };

  const handleSlotClick = (time, bay) => {
    const isSlotBooked = availability.some((booking) => {
      if (booking.bay !== bay) return false;
      if (booking.club !== selectedClub?._id) return false;

      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);

      const slotStart = new Date(localTimeToISO(time, selectedDate));

      const slotEnd = new Date(
        localTimeToISO(calculateEndTime(time, 1), selectedDate, time)
      );

      return slotStart < bookingEnd && slotEnd > bookingStart;
    });

    if (!isSlotBooked) {
      setSelectedSlot({
        time,
        bay,
        date: selectedDate,
        clubId: selectedClub?._id,
      });
      setIsModalOpen(true);
    } else {
      toast.error("This slot is already booked. Please select another time.");
    }
  };

  const handleBookSlotClick = () => {
    if (!selectedClub) {
      toast.error("Please select a club first");
      return;
    }

    setSelectedSlot({
      time: null,
      bay: selectedClub.bays[0],
      date: selectedDate,
      clubId: selectedClub._id,
    });
    setIsModalOpen(true);
  };

  const handleJoinSlotClick = (booking) => {
    setSelectedBooking(booking);
    setIsJoinModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
    setSelectedBooking(null);
  };

  const refreshAvailability = async () => {
    if (selectedClub && selectedDate) {
      try {
        await checkAvailability(selectedDate, selectedClub._id, timezone);
      } catch (error) {
        console.error("Failed to refresh availability:", error);
      }
    }
  };

  const handleBookingConfirm = async (bookingData) => {
    const hasConflict = availability.some((booking) =>
      hasTimeConflict(booking, bookingData)
    );

    if (hasConflict) {
      toast.error(
        "This booking conflicts with an existing booking. Please select a different time or bay."
      );

      await refreshAvailability();
      return;
    }

    setIsBookingLoading(true);

    try {
      // Create members array based on booking type
      const members = [];

      if (bookingData.bookingType === "yourself") {
        // Book for yourself - add current user to members array
        if (!user?._id) {
          throw new Error("User not logged in");
        }
        members.push({
          userId: user._id,
          guests: bookingData.numberOfGuests || 0,
        });
      } else if (bookingData.bookingType === "member") {
        // Book for another member - add selected member to members array
        if (!bookingData.memberId) {
          throw new Error("Member ID is required");
        }
        members.push({
          userId: bookingData.memberId,
          guests: bookingData.numberOfGuests || 0,
        });
      }

      const apiBookingData = {
        date: selectedDate,
        playingTime: bookingData.playingTime,
        bay: bookingData.bay,
        club: bookingData.clubId,
        startTime: localTimeToISO(bookingData.startTime, selectedDate),
        endTime: localTimeToISO(
          bookingData.endTime,
          selectedDate,
          bookingData.startTime
        ),
        members: members,
      };

      await createBooking(apiBookingData);

      setIsModalOpen(false);
      setSelectedSlot(null);

      await refreshAvailability();

      toast.success("Booking created successfully!");
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast.error(
        error.message || "Failed to create booking. Please try again."
      );

      await refreshAvailability();
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleJoinSlotConfirm = async (joinData) => {
    try {
      if (!user?._id) {
        throw new Error("User not logged in");
      }
      console.log(joinData);
      await joinBooking({
        bookingId: joinData.bookingId,
        guests: joinData?.playerOption?.guests || 0,
      });

      setIsJoinModalOpen(false);
      setSelectedBooking(null);

      await refreshAvailability();

      toast.success("Successfully joined the booking!");
    } catch (error) {
      console.error("Failed to join slot:", error);
      toast.error("Failed to join slot. Please try again.");

      await refreshAvailability();
    }
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleClubChange = (club) => {
    setSelectedClub(club);
  };

  if (clubsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clubs...</p>
        </div>
      </div>
    );
  }

  if (!clubsLoading && clubs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">No clubs available</p>
          <p className="text-gray-500">
            Please contact administrator to set up clubs.
          </p>
        </div>
      </div>
    );
  }

  if (!selectedClub) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading club information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="">
        <Calendar
          onSlotClick={handleSlotClick}
          onBookSlotClick={handleBookSlotClick}
          onJoinSlotClick={handleJoinSlotClick}
          bookings={availability}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          selectedClub={selectedClub}
          clubs={clubs}
          onClubChange={handleClubChange}
          availability={availability}
          isLoadingAvailability={availabilityLoading}
        />

        {isModalOpen && selectedSlot && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            selectedSlot={selectedSlot}
            onConfirm={handleBookingConfirm}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            existingBookings={availability}
            selectedClub={selectedClub}
            clubs={clubs}
            isBookingLoading={isBookingLoading}
          />
        )}

        {isJoinModalOpen && selectedBooking && (
          <JoinSlotModal
            isOpen={isJoinModalOpen}
            onClose={handleCloseJoinModal}
            booking={selectedBooking}
            onConfirm={handleJoinSlotConfirm}
          />
        )}
      </div>
    </div>
  );
}
