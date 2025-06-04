"use client";

import BookingModal from "@/components/BookingCalendar/booking-modal";
import Calendar from "@/components/BookingCalendar/calendar";
import JoinSlotModal from "@/components/BookingCalendar/join-slot-modal";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Debug localStorage
  useEffect(() => {
    console.log("🔍 DEBUGGING PAGE COMPONENT:");
    const savedBookings = localStorage.getItem("calendarBookings");
    console.log("📦 Raw localStorage data:", savedBookings);

    if (savedBookings) {
      try {
        const parsed = JSON.parse(savedBookings);
        console.log("📋 Parsed bookings:", parsed);
        setBookings(parsed);
      } catch (error) {
        console.error("❌ Error parsing localStorage:", error);
        setBookings([]);
      }
    } else {
      console.log("❌ No bookings found in localStorage");
      setBookings([]);
    }
  }, []);

  useEffect(() => {
    console.log("💾 Saving bookings to localStorage:", bookings);
    localStorage.setItem("calendarBookings", JSON.stringify(bookings));
  }, [bookings]);

  // Debug state changes
  useEffect(() => {
    console.log("🔄 Bookings state updated:", bookings);
  }, [bookings]);

  const handleSlotClick = (time, bay) => {
    const isSlotBooked = bookings.some((booking) => {
      if (booking.date !== selectedDate) return false;
      if (booking.bay !== bay) return false;

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
      });
      setIsModalOpen(true);
    } else {
      toast.error("This slot is already booked. Please select another time.");
    }
  };

  const handleBookSlotClick = () => {
    setSelectedSlot({
      time: null,
      bay: "Bay 1",
      date: selectedDate,
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

  const handleBookingConfirm = (bookingData) => {
    console.log("✅ Confirming booking:", bookingData);

    // Check for booking conflicts before confirming
    const hasConflict = bookings.some((booking) => {
      if (booking.date !== selectedDate) return false;
      if (booking.bay !== bookingData.bay) return false;

      const existingStart = Number.parseInt(booking.startTime.split(":")[0]);
      const existingEnd = Number.parseInt(booking.endTime.split(":")[0]);
      const newStart = Number.parseInt(bookingData.startTime.split(":")[0]);
      const newEnd = Number.parseInt(bookingData.endTime.split(":")[0]);

      // Check for overlap
      if (existingEnd > existingStart && newEnd > newStart) {
        // Both are normal bookings (not overnight)
        return (
          (newStart >= existingStart && newStart < existingEnd) || // New booking starts during existing booking
          (newEnd > existingStart && newEnd <= existingEnd) || // New booking ends during existing booking
          (newStart <= existingStart && newEnd >= existingEnd) // New booking completely covers existing booking
        );
      } else if (existingEnd <= existingStart && newEnd <= newStart) {
        // Both are overnight bookings
        return (
          newStart >= existingStart ||
          newStart < existingEnd || // New booking starts during existing booking
          newEnd > existingStart ||
          newEnd <= existingEnd || // New booking ends during existing booking
          (newStart <= existingStart && newEnd >= existingEnd) // New booking completely covers existing booking
        );
      } else {
        // One is overnight, one is normal
        return (
          (newStart >= existingStart && newStart < 24) || // New booking starts during existing booking (before midnight)
          (newEnd > 0 && newEnd <= existingEnd) || // New booking ends during existing booking (after midnight)
          (existingStart >= newStart && existingStart < 24) || // Existing booking starts during new booking (before midnight)
          (existingEnd > 0 && existingEnd <= newEnd) // Existing booking ends during new booking (after midnight)
        );
      }
    });

    if (hasConflict) {
      toast.error(
        "This booking conflicts with an existing booking. Please select a different time or bay."
      );
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      date: selectedDate,
    };

    console.log("📝 Creating new booking:", newBooking);
    setBookings((prev) => {
      const updated = [...prev, newBooking];
      console.log("📋 Updated bookings array:", updated);
      return updated;
    });
    setIsModalOpen(false);
    setSelectedSlot(null);
    toast.success("Booking confirmed successfully!");
  };

  const handleJoinSlotConfirm = (joinData) => {
    toast.success(
      `Successfully joined the slot! ${joinData.playerOption.label}${
        joinData.playerOption.price > 0
          ? ` - Additional fee: $${joinData.playerOption.price}`
          : ""
      }`
    );
    setIsJoinModalOpen(false);
    setSelectedBooking(null);
  };

  const handleDateChange = (newDate) => {
    console.log("📅 Date changed to:", newDate);
    setSelectedDate(newDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <Calendar
          onSlotClick={handleSlotClick}
          onBookSlotClick={handleBookSlotClick}
          onJoinSlotClick={handleJoinSlotClick}
          bookings={bookings}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />

        {isModalOpen && selectedSlot && (
          <BookingModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            selectedSlot={selectedSlot}
            onConfirm={handleBookingConfirm}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            existingBookings={bookings}
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
