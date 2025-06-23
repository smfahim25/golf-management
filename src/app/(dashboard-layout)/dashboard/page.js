"use client";

import BookingModal from "@/components/BookingCalendar/booking-modal";
import Calendar from "@/components/BookingCalendar/calendar";
import JoinSlotModal from "@/components/BookingCalendar/join-slot-modal";
import useBookingStore from "@/stores/BookingStore";
import useClubStore from "@/stores/ClubStore";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

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
    updateBooking,
    isLoading: availabilityLoading,
  } = useBookingStore();

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
          await checkAvailability(selectedDate, selectedClub._id);
        } catch (error) {
          console.error("Failed to check availability:", error);
        }
      };
      loadAvailability();
    }
  }, [selectedClub, selectedDate, checkAvailability]);

  const handleSlotClick = (time, bay) => {
    const isSlotBooked = availability.some((booking) => {
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

  const handleBookingConfirm = async (bookingData) => {
    const hasConflict = availability.some((booking) => {
      if (booking.bay !== bookingData.bay) return false;
      if (booking.club !== selectedClub?._id) return false;

      const existingStart = Number.parseInt(booking.startTime.split(":")[0]);
      const existingEnd = Number.parseInt(booking.endTime.split(":")[0]);
      const newStart = Number.parseInt(bookingData.startTime.split(":")[0]);
      const newEnd = Number.parseInt(bookingData.endTime.split(":")[0]);

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

    if (hasConflict) {
      toast.error(
        "This booking conflicts with an existing booking. Please select a different time or bay."
      );
      return;
    }

    setIsBookingLoading(true);

    try {
      const apiBookingData = {
        date: selectedDate,
        bookedFor: bookingData.bookingType === "yourself" ? "self" : "member",
        memberName: bookingData.memberName || undefined,
        playingTime: bookingData.playingTime,
        numberOfPlayers: bookingData.numberOfPlayers,
        numberOfGuest: bookingData.numberOfGuests,
        bay: bookingData.bay,
        club: bookingData.clubId,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
      };

      await createBooking(apiBookingData);

      setIsModalOpen(false);
      setSelectedSlot(null);

      if (selectedClub && selectedDate) {
        await checkAvailability(selectedDate, selectedClub._id);
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast.error(
        error.message || "Failed to create booking. Please try again."
      );
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleJoinSlotConfirm = async (joinData) => {
    await updateBooking(joinData.bookingId, {
      numberOfPlayers: joinData?.numberOfPlayers,
      numberOfGuest: joinData?.playerOption?.guests,
    });
    setIsJoinModalOpen(false);
    setSelectedBooking(null);
    if (selectedClub && selectedDate) {
      await checkAvailability(selectedDate, selectedClub._id);
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

  // Show message if no clubs available
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

  // Show message if no club is selected
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
