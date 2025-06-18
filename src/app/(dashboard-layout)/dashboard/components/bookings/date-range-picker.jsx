"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import DatePicker from "@/components/BookingCalendar/date-picker";

export default function DateRangePicker({ dateRange, onDateRangeChange }) {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const startDatePickerRef = useRef(null);
  const startButtonRef = useRef(null);
  const endDatePickerRef = useRef(null);
  const endButtonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showStartDatePicker &&
        startDatePickerRef.current &&
        !startDatePickerRef.current.contains(event.target) &&
        startButtonRef.current &&
        !startButtonRef.current.contains(event.target)
      ) {
        setShowStartDatePicker(false);
      }
    }

    if (showStartDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartDatePicker]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showEndDatePicker &&
        endDatePickerRef.current &&
        !endDatePickerRef.current.contains(event.target) &&
        endButtonRef.current &&
        !endButtonRef.current.contains(event.target)
      ) {
        setShowEndDatePicker(false);
      }
    }

    if (showEndDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEndDatePicker]);

  const clearStartDate = (e) => {
    e.stopPropagation();
    onDateRangeChange({ ...dateRange, start: "" });
  };

  const clearEndDate = (e) => {
    e.stopPropagation();
    onDateRangeChange({ ...dateRange, end: "" });
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex gap-2">
      {/* Start Date Picker */}
      <div className="relative">
        <button
          ref={startButtonRef}
          onClick={() => {
            setShowStartDatePicker(!showStartDatePicker);
            setShowEndDatePicker(false);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center gap-2 min-w-[120px] justify-between cursor-pointer"
        >
          <span className={dateRange.start ? "text-gray-900" : "text-gray-500"}>
            {dateRange.start
              ? formatDisplayDate(dateRange.start)
              : "Start date"}
          </span>
          {dateRange.start && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={clearStartDate}
            />
          )}
        </button>

        {showStartDatePicker && (
          <div
            ref={startDatePickerRef}
            className="absolute top-full left-0 mt-2 z-20"
          >
            <DatePicker
              selectedDate={
                dateRange.start || new Date().toISOString().split("T")[0]
              }
              onDateSelect={(date) => {
                onDateRangeChange({ ...dateRange, start: date });
                setShowStartDatePicker(false);
              }}
              onClose={() => setShowStartDatePicker(false)}
            />
          </div>
        )}
      </div>

      {/* End Date Picker */}
      <div className="relative">
        <button
          ref={endButtonRef}
          onClick={() => {
            setShowEndDatePicker(!showEndDatePicker);
            setShowStartDatePicker(false);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center gap-2 min-w-[120px] justify-between cursor-pointer"
        >
          <span className={dateRange.end ? "text-gray-900" : "text-gray-500"}>
            {dateRange.end ? formatDisplayDate(dateRange.end) : "End date"}
          </span>
          {dateRange.end && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={clearEndDate}
            />
          )}
        </button>

        {showEndDatePicker && (
          <div
            ref={endDatePickerRef}
            className="absolute top-full left-0 mt-2 z-20"
          >
            <DatePicker
              selectedDate={
                dateRange.end || new Date().toISOString().split("T")[0]
              }
              onDateSelect={(date) => {
                onDateRangeChange({ ...dateRange, end: date });
                setShowEndDatePicker(false);
              }}
              onClose={() => setShowEndDatePicker(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
