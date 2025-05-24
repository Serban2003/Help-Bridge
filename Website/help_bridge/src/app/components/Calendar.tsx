import React, { useState, JSX } from "react";
import { Modal, Button } from "react-bootstrap";
import "./Calendar.css";
import "./../globals.css";
import { Availability } from "../models/Availability";
import { getFormattedDate } from "../utils";
import { useAuth } from "../models/AuthContext";

interface CalendarProps {
  availableSlots: Availability[] | null;
  onBook: (date: string, time: string, title: string, message: string, AV_id: string) => any;
}

const Calendar = ({ availableSlots, onBook }: CalendarProps) => {
  const today = new Date();
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
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Book the selected slot
  const handleBook = async() => {
    if (!auth) {
      setBookingError("You must be logged in to book a consultation.");
      return;
    }
    if (selectedDate && selectedTime && title.trim() && message.trim()) {
      const result = await onBook(selectedDate, selectedTime, title, message, selectedAvailability);

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
  const firstDayOfWeek = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const calendar: JSX.Element[] = [];

  // Empty cells before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendar.push(<div key={`empty-${i}`} className="calendar-day empty" />);
  }

  // Render the actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDateUTC = new Date(Date.UTC(year, month, day));
    const dateStr = getFormattedDate(currentDateUTC, "yyyy-mm-dd");

    const availableSlot = availableSlots?.find((slot : Availability) => {
      let slotDateStr;
  

      if (slot.Date instanceof Date) {
        slotDateStr = slot.Date.toISOString().split("T")[0];
      } else if (typeof slot.Date === "string") {
        slotDateStr = new Date(slot.Date).toISOString().split("T")[0];
      } else {
        return false;
      }

      return slotDateStr === dateStr;
    });

    const isAvailable = !!availableSlot && availableSlot.IsBooked == 0;

    // Check if this day (UTC) is before today (UTC midnight)
    const todayUTC = new Date();
    const todayMidnightUTC = Date.UTC(
      todayUTC.getUTCFullYear(),
      todayUTC.getUTCMonth(),
      todayUTC.getUTCDate()
    );
    const currentDateMillisUTC = Date.UTC(year, month, day);
    const isPast = currentDateMillisUTC < todayMidnightUTC;
    calendar.push(
      <div
        key={day}
        className={`calendar-day rounded ${
          isAvailable && !isPast ? "available" : "disabled"
        } ${selectedDate === dateStr ? "selected" : ""}`}
        onClick={() => {
          if (isAvailable && !isPast) {
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


  return (
    <>
      <div className="calendar-booking p-4 border rounded bg-white shadow-sm">
        <h5 className="fw-bold mb-3">Select a Consultation Date</h5>

        <div className="calendar-grid mb-4">{renderCalendarDays()}</div>

        {selectedDate && (
          <>
            <h6 className="fw-semibold mb-2">
              Available times on{" "}
              {getFormattedDate(new Date(selectedDate), "dd-mm-yyyy")}
            </h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {(
                availableSlots?.filter((slot) => {
                  console.log("Slot Date:", slot.IsBooked);
                  const slotDate =
                    slot.Date instanceof Date ? slot.Date : new Date(slot.Date);
                  return slotDate.toISOString().split("T")[0] === selectedDate && (slot.IsBooked == 0);
                }) || []
              ).map((slot) => (
                <Button
                  key={slot.AV_id}
                  className={
                    selectedTime === slot.getFormattedTime()
                      ? "toggle-button-custom-active"
                      : "toggle-button-custom"
                  }
                  onClick={() => {setSelectedTime(slot.getFormattedTime())
                    setSelectedAvailability(slot.AV_id.toString());
                    setBookingError("");
                  }}
                >
                  {slot.getFormattedTime()}
                </Button>
              ))}
            </div>

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
