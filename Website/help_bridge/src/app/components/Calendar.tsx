import React, { JSX, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./Calendar.css";
import "./../globals.css"; // Import your global CSS file
interface CalendarProps {
  availableSlots: Record<string, string[]>; // { '2025-05-07': ['10:00', '11:00'] }
  onBook: (date: string, time: string, title: string, message: string) => void;
}

const Calendar = ({ availableSlots, onBook }: CalendarProps) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const year = today.getFullYear();
  const month = today.getMonth(); // 0 = Jan
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleBook = () => {
    if (selectedDate && selectedTime && title.trim() && message.trim()) {
      setShowSuccessModal(true); // show confirmation modal
    } else {
      alert("Please fill in all fields before booking.");
    }
  };

  const renderCalendarDays = () => {
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // Sunday = 0
    const calendar: JSX.Element[] = [];

    // empty cells before 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendar.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = getFormatedDate(currentDate, "yyyy-mm-dd");
      const isAvailable = availableSlots[dateStr] !== undefined;
      const isPast = currentDate < new Date(new Date().setHours(0, 0, 0, 0));

      calendar.push(
        <div
          key={day}
          className={`calendar-day rounded ${
            isAvailable && !isPast ? "available" : "disabled"
          } ${selectedDate === dateStr ? "selected" : ""}`}
          onClick={() => {
            if (isAvailable && !isPast) {
              setSelectedDate(dateStr);
            }
          }}
        >
          {day}
        </div>
      );
    }

    return calendar;
  };

  const getFormatedDate = (date: Date, type: string) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    if (type === "yyyy-mm-dd") return `${yyyy}-${mm}-${dd}`;
    else return `${dd}-${mm}-${yyyy}`;
  }

  return (
    <>
      <div className="calendar-booking p-4 border rounded bg-white shadow-sm">
        <h5 className="fw-bold mb-3">Select a Consultation Date</h5>

        <div className="calendar-grid mb-4">{renderCalendarDays()}</div>

        {selectedDate && (
          <>
            <h6 className="fw-semibold mb-2">
              Available times on {getFormatedDate(new Date(selectedDate), "dd-mm-yyyy")}
            </h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {availableSlots[selectedDate]?.map((time) => (
                <Button
                  key={time}
                  className={
                    selectedTime === time
                      ? "toggle-button-custom-active"
                      : "toggle-button-custom"
                  }
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
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

            <Button
              onClick={handleBook}
              className="custom-button"
              disabled={!selectedTime || !title || !message}
            >
              Confirm Booking
            </Button>
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
