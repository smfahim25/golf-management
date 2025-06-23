"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export default function JoinSlotModal({ isOpen, onClose, booking, onConfirm }) {
  const [numberOfPlayers, setNumberOfPlayers] = useState("single");
  const [playerOptions, setPlayerOptions] = useState([]);
  const [showPlayersDropdown, setShowPlayersDropdown] = useState(false);
  const playersDropdownRef = useRef(null);
  const playersButtonRef = useRef(null);

  useEffect(() => {
    if (!booking?.playingTime) return;

    const playingTime = booking.playingTime;
    const options = [
      { value: "single", label: "Single Member", guests: 0, price: 0 },
    ];

    if (playingTime === 1) {
      options.push({
        value: "guest1",
        label: "Member with 1 Guest",
        guests: 1,
        price: 10,
      });
    } else if (playingTime === 2) {
      options.push(
        { value: "guest1", label: "Member with 1 Guest", guests: 1, price: 20 },
        {
          value: "guest2",
          label: "Member with 2 Guests",
          guests: 2,
          price: 35,
        },
        { value: "guest3", label: "Member with 3 Guests", guests: 3, price: 45 }
      );
    } else if (playingTime === 4) {
      options.push(
        { value: "guest1", label: "Member with 1 Guest", guests: 1, price: 40 },
        {
          value: "guest2",
          label: "Member with 2 Guests",
          guests: 2,
          price: 70,
        },
        { value: "guest3", label: "Member with 3 Guests", guests: 3, price: 90 }
      );
    }

    setPlayerOptions(options);

    if (booking?.numberOfGuest !== undefined) {
      const matchingOption = options.find(
        (opt) => opt.guests === booking.numberOfGuest
      );
      if (matchingOption) {
        setNumberOfPlayers(matchingOption.value);
      } else {
        setNumberOfPlayers("single");
      }
    } else {
      const currentOption = options.find(
        (opt) => opt.value === numberOfPlayers
      );
      if (!currentOption) {
        setNumberOfPlayers("single");
      }
    }
  }, [booking?.playingTime, booking?.numberOfGuest]);

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

  const formatTime = (time) => {
    const hour = Number.parseInt(time.split(":")[0]);
    if (hour === 0) return "12:00 AM";
    if (hour < 12) return `${hour}:00 AM`;
    if (hour === 12) return "12:00 PM";
    return `${hour - 12}:00 PM`;
  };

  const getSelectedOption = () => {
    return playerOptions.find((option) => option.value === numberOfPlayers);
  };

  const handleConfirm = () => {
    const selectedOption = getSelectedOption();
    const totalPlayers = 1 + selectedOption.guests;
    onConfirm({
      bookingId: booking._id,
      numberOfPlayers: totalPlayers,
      playerOption: selectedOption,
    });
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Join a Slot</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">
              Booking Details
            </h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Time:</span>{" "}
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </p>
              <p>
                <span className="font-medium">Bay:</span> {booking.bay}
              </p>
              <p>
                <span className="font-medium">Playing Time:</span>{" "}
                {booking.playingTime} hour{booking.playingTime !== 1 ? "s" : ""}
              </p>
              <p>
                <span className="font-medium">Host:</span>{" "}
                {booking.bookingType === "member"
                  ? booking.memberName
                  : "Member"}
              </p>
            </div>
          </div>

          {/* Number of Players Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Number of Players
            </label>
            <div className="relative">
              <button
                ref={playersButtonRef}
                onClick={() => setShowPlayersDropdown(!showPlayersDropdown)}
                className="w-full p-4 border border-gray-300 rounded-xl text-left flex items-center justify-between hover:border-blue-400 hover:shadow-md transition-all duration-200 bg-white"
              >
                <span className="font-medium">
                  {getSelectedOption()?.label}
                  {getSelectedOption()?.price > 0 &&
                    ` - $${getSelectedOption()?.price}`}
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
                      key={option.value}
                      onClick={() => {
                        setNumberOfPlayers(option.value);
                        setShowPlayersDropdown(false);
                      }}
                      className={`w-full p-4 text-left hover:bg-blue-50 transition-colors duration-200 font-medium flex items-center justify-between ${
                        numberOfPlayers === option.value
                          ? "bg-blue-50 text-blue-900"
                          : ""
                      }`}
                    >
                      <span>{option.label}</span>
                      {option.price > 0 && (
                        <span className="text-green-600 font-semibold">
                          ${option.price}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-3 rounded-lg italic">
              Please note that additional fees for guests will apply, determined
              by the chosen session duration.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
