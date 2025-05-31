"use client";

import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Calendar.css"; // Assuming you have a CSS file for styles
import { Availability } from "../models/Availability";

export default function HelperAvailabilityCalendar({
  onSubmitAvailability,
  existingAvailability = [],
}: {
  onSubmitAvailability: (
    date: string,
    toAdd: string[],
    toDelete: number[]
  ) => Promise<{ success: boolean; error?: string }>;
  existingAvailability?: Availability[] | null;
}) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getUTCFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getUTCMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null
  );

  const daysInMonth = new Date(
    Date.UTC(currentYear, currentMonth + 1, 0)
  ).getUTCDate();
  const firstDayOfWeek = new Date(
    Date.UTC(currentYear, currentMonth, 1)
  ).getUTCDay();

  const hoursList = Array.from({ length: 11 }, (_, i) => i + 8); // 8–18

  useEffect(() => {
    // When existingAvailability changes, reset selected hours or refresh display if needed
  }, [existingAvailability]);

  const formatDateDDMMYYYY = (date: Date) => {
    const dd = String(date.getUTCDate()).padStart(2, "0");
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = date.getUTCFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const prefillHoursForDate = (dateStr: any) => {
    if (!existingAvailability) {
      setSelectedHours([]);
      return;
    }
    const hoursForDate = existingAvailability
      .filter((slot) => {
        const slotDate = new Date(slot.Date).toISOString().split("T")[0];
        const selectedISO = convertDDMMYYYYtoISO(dateStr);
        return slotDate === selectedISO && slot.IsBooked == 0;
      })
      .map((slot) => {
        const slotHour = new Date(slot.Date).getUTCHours();
        return String(slotHour).padStart(2, "0") + ":00";
      });
    console.log("Hours for date:", dateStr, hoursForDate);
    setSelectedHours(hoursForDate);
  };

  const convertDDMMYYYYtoISO = (ddmmyyyy: string) => {
    const [dd, mm, yyyy] = ddmmyyyy.split("-");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleHourToggle = (hour: number) => {
    const hourStr = String(hour).padStart(2, "0") + ":00";
    setSelectedHours((prev) =>
      prev.includes(hourStr)
        ? prev.filter((h) => h !== hourStr)
        : [...prev, hourStr]
    );
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      setFeedbackMessage("Please select a date.");
      setFeedbackType("error");
      return;
    }

    const selectedISODate = convertDDMMYYYYtoISO(selectedDate);

    const existingSlots = (existingAvailability || [])
      .filter((slot) => {
        const slotDate = new Date(slot.Date).toISOString().split("T")[0];
        return slotDate === selectedISODate && slot.IsBooked == 0;
      })
      .map((slot) => {
        const slotHour = new Date(slot.Date).getUTCHours();
        return {
          hourStr: String(slotHour).padStart(2, "0") + ":00",
          AV_id: slot.AV_id,
        };
      });

    const existingHours = existingSlots.map((s) => s.hourStr);

    const toAdd = selectedHours.filter((hour) => !existingHours.includes(hour));
    const toDelete = existingSlots.filter(
      (s) => !selectedHours.includes(s.hourStr)
    );

    if (toAdd.length === 0 && toDelete.length === 0) {
      setFeedbackMessage("No changes to update.");
      setFeedbackType("error");
      return;
    }
    const result = await onSubmitAvailability(
      selectedDate,
      toAdd,
      toDelete.map((s) => s.AV_id)
    );

    if (!result.success) {
      setFeedbackMessage(result.error || "Unknown error occurred.");
      setFeedbackType("error");
      return;
    }

    setFeedbackMessage("Availability updated successfully.");
    setFeedbackType("success");
  };

  const isPrevDisabled =
  currentYear < today.getUTCFullYear() ||
  (currentYear === today.getUTCFullYear() && currentMonth <= today.getUTCMonth());

  const maxDate = new Date(Date.UTC(today.getUTCFullYear() + 1, today.getUTCMonth(), 1));
  const isNextDisabled =
    currentYear > maxDate.getUTCFullYear() ||
    (currentYear === maxDate.getUTCFullYear() && currentMonth >= maxDate.getUTCMonth());

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          className="outline-button-custom"
          disabled={isPrevDisabled}
          onClick={() => {
            if (currentMonth === 0) {
              setCurrentYear(currentYear - 1);
              setCurrentMonth(11);
            } else {
              setCurrentMonth(currentMonth - 1);
            }
          }}
        >
          <ChevronLeft />
        </Button>
        <h5>
          {new Date(Date.UTC(currentYear, currentMonth)).toLocaleString(
            "default",
            {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            }
          )}
        </h5>
        <Button
          className="outline-button-custom"
          disabled={isNextDisabled}
          onClick={() => {
            if (currentMonth === 11) {
              setCurrentYear(currentYear + 1);
              setCurrentMonth(0);
            } else {
              setCurrentMonth(currentMonth + 1);
            }
          }}
        >
          <ChevronRight />
        </Button>
      </div>

      <h6>Select a Date</h6>
      <div className="calendar-grid mb-4">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateObj = new Date(Date.UTC(currentYear, currentMonth, day));
          const dateStr = formatDateDDMMYYYY(dateObj);

          // Calculate if this day is in the past
          const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
          const isPast = dateObj < todayUTC;

          return (
            <div
              key={day}
              className={`calendar-day rounded ${selectedDate === dateStr ? "selected" : ""} ${isPast ? "disabled" : ""}`}
              style={isPast ? { pointerEvents: "none", opacity: 0.5 } : {}}
              onClick={() => {
                if (!isPast) {
                  setSelectedDate(dateStr);
                  prefillHoursForDate(dateStr);
                  setFeedbackMessage(null);
                  setFeedbackType(null);
                }
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <>
          <h6>Select Available Hours for {selectedDate}</h6>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {hoursList.map((hour) => {
              const hourStr = String(hour).padStart(2, "0") + ":00";

              // Check if this slot exists and is booked
              const slotForHour = (existingAvailability || []).find((slot) => {
                const slotDate = new Date(slot.Date)
                  .toISOString()
                  .split("T")[0];
                const selectedISO = convertDDMMYYYYtoISO(selectedDate);
                const slotHour =
                  String(new Date(slot.Date).getUTCHours()).padStart(2, "0") +
                  ":00";
                return slotDate === selectedISO && slotHour === hourStr;
              });

              const isBooked = !!(slotForHour && slotForHour.IsBooked); // booked = has appointment
              const isSelected = selectedHours.includes(hourStr);

              //Disable if today and hour is in the past
              let isPastHour = false;
              if (selectedDate) {
                const [dd, mm, yyyy] = selectedDate.split("-");
                const selectedDateObj = new Date(+yyyy, +mm - 1, +dd, hour);
                const nowLocal = new Date();
                isPastHour = selectedDateObj.getTime() <= nowLocal.getTime();
              }

              let buttonClass = "toggle-button-custom";
              if (isBooked) {
                buttonClass = "toggle-button-custom-booked";
              } else if (isSelected) {
                buttonClass = "toggle-button-custom-active";
              }

              return (
                <Button
                  key={hour}
                  className={buttonClass}
                  title={
                    isBooked
                      ? "This slot is already booked"
                      : isPastHour
                        ? "This time has already passed"
                        : ""
                  }
                  onClick={() => handleHourToggle(hour)}
                  disabled={isBooked || isPastHour}
                >
                  {hourStr}
                </Button>
              );
            })}
          </div>
          <Button className="custom-button" onClick={handleSubmit}>
            Update Availability
          </Button>
          {feedbackMessage && (
            <div
              className={` ${
                feedbackType === "success" ? "text-success" : "text-danger"
              } small mt-1`}
            >
              {feedbackMessage}
            </div>
          )}
        </>
      )}
    </div>
  );
}
