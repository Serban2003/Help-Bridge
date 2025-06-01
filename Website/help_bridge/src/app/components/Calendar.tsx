import React, { useState, JSX } from "react";
import { Modal, Button } from "react-bootstrap";
import "./Calendar.css";
import "./../globals.css";
import { Availability } from "../models/Availability";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../models/AuthContext";

interface CalendarProps {
  availableSlots: Availability[] | null;
  onBook: (
    date: string,
    time: string,
    title: string,
    message: string,
    AV_id: string
  ) => any;
}

const Calendar = ({ availableSlots, onBook }: CalendarProps) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getUTCFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getUTCMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { auth } = useAuth();
  const [bookingError, setBookingError] = useState<string>("");
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(
    Date.UTC(currentYear, currentMonth + 1, 0)
  ).getUTCDate();
  const firstDayOfWeek = new Date(
    Date.UTC(currentYear, currentMonth, 1)
  ).getUTCDay();
  // Book the selected slot
  const handleBook = async () => {
    if (!auth) {
      setBookingError("You must be logged in to book a consultation.");
      return;
    }
    if (auth.role === "helper") {
      setBookingError("Helpers cannot book sessions.");
      return;
    }
    if (selectedDate && selectedTime && title.trim() && message.trim()) {
      const result = await onBook(
        selectedDate,
        selectedTime,
        title,
        message,
        selectedAvailability
      );

      if (!result.success) {
        setBookingError(result.error || "Failed to book appointment.");
      } else {
        setShowSuccessModal(true);
        setBookingError("");
      }
    } else {
      setBookingError("Please fill in all fields before booking.");
    }
  };

  const renderCalendarDays = () => {
    const calendar: JSX.Element[] = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      calendar.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDateUTC = new Date(Date.UTC(currentYear, currentMonth, day));
      const dateStr = currentDateUTC.toISOString().split("T")[0];

      const hasAvailableSlot = availableSlots?.some((slot) => {
        const slotDateStr =
          slot.Date instanceof Date
            ? slot.Date.toISOString().split("T")[0]
            : new Date(slot.Date).toISOString().split("T")[0];
        return slotDateStr === dateStr && slot.IsBooked == 0 &&
          (
            // If not today, always show
            slotDateStr !== new Date().toISOString().split("T")[0] ||
            // If today, only show if slot hour is in the future
            new Date(slot.Date).getHours() > new Date().getHours()
          );
      });

      const todayUTC = new Date();
      const todayMidnightUTC = Date.UTC(
        todayUTC.getUTCFullYear(),
        todayUTC.getUTCMonth(),
        todayUTC.getUTCDate()
      );
      const currentDateMillisUTC = Date.UTC(currentYear, currentMonth, day);
      const isPast = currentDateMillisUTC < todayMidnightUTC;

      calendar.push(
        <div
          key={day}
          className={`calendar-day rounded ${hasAvailableSlot && !isPast ? "available" : "disabled"
            } ${selectedDate === dateStr ? "selected" : ""}`}
          onClick={() => {
            if (hasAvailableSlot && !isPast) {
              setSelectedDate(dateStr);
              setSelectedTime(null);
              setSelectedAvailability(null);
            }
          }}
        >
          {day}
        </div>
      );
    }

    return calendar;
  };

  // Disable previous month button if current month is the same as today or earlier
  const isPrevDisabled =
    currentYear < today.getUTCFullYear() ||
    (currentYear === today.getUTCFullYear() && currentMonth <= today.getUTCMonth());

  const maxDate = new Date(Date.UTC(today.getUTCFullYear() + 1, today.getUTCMonth(), 1));
  const isNextDisabled =
    currentYear > maxDate.getUTCFullYear() ||
    (currentYear === maxDate.getUTCFullYear() && currentMonth >= maxDate.getUTCMonth());

  return (
    <>
      <div className="calendar-booking p-4 border rounded bg-white shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button
            className="outline-button-custom"
            disabled={isPrevDisabled}
            onClick={() => {
              setSelectedDate(null);
              setSelectedTime(null);
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
            {new Date(Date.UTC(currentYear, currentMonth)).toLocaleString("default", {
              month: "long",
              year: "numeric",
              timeZone: "UTC",
            })}
          </h5>
          <Button
            className="outline-button-custom"
            disabled={isNextDisabled}
            onClick={() => {
              setSelectedDate(null);
              setSelectedTime(null);
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

        <h5 className="fw-bold mb-3">Select a Consultation Date</h5>
        <div className="calendar-grid mb-4">{renderCalendarDays()}</div>

        {selectedDate && (
          <>
            <h6 className="fw-semibold mb-2">
              Available times on {new Date(selectedDate).toLocaleDateString("en-GB")}
            </h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {(availableSlots?.filter((slot) => {
                const slotDate =
                  slot.Date instanceof Date ? slot.Date : new Date(slot.Date);
                return (
                  slotDate.toISOString().split("T")[0] === selectedDate && slot.IsBooked == 0 &&
                  (
                    slotDate.toLocaleDateString("en-CA") !== new Date().toLocaleDateString("en-CA")
                    || slotDate.getHours() > new Date().getHours()
                  )
                );
              }) || [])
                .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime())
                .map((slot) => (
                  <Button
                    key={slot.AV_id}
                    className={
                      selectedTime === slot.getFormattedTime()
                        ? "toggle-button-custom-active"
                        : "toggle-button-custom"
                    }
                    onClick={() => {
                      setSelectedTime(slot.getFormattedTime());
                      setSelectedAvailability(slot.AV_id.toString());
                      setBookingError("");
                    }}
                  >
                    {slot.getFormattedTime()}
                  </Button>
                ))}
            </div>

            {auth?.role === "helper" ? (
              <div className="text-danger mb-3">
                Helpers cannot book sessions.
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Help with website"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Add details about your request..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="d-flex flex-column">
                  <Button
                    onClick={handleBook}
                    className="custom-button mb-2"
                    disabled={!selectedTime || !title || !message}
                  >
                    Confirm Booking
                  </Button>
                  {bookingError && (
                    <div className="text-danger small mt-1">{bookingError}</div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>🎉 Successfully Booked</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your consultation has been scheduled successfully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              setShowSuccessModal(false);
              setTitle("");
              setMessage("");
              setSelectedAvailability(null);
              setSelectedTime(null);
              setSelectedDate(null);
            }}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Calendar;
