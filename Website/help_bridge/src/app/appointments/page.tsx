"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/models/AuthContext";
import Calendar from "@/app/components/Calendar";
import {
  fetchAvailabilityByHelperId,
  fetchAppointmentsByHelperId,
  fetchAppointmentsByUserId,
  addHelperAvailability,
  deleteHelperAvailability,
} from "@/app/utils";
import { Availability } from "@/app/models/Availability";
import HelperAvailabilityCalendar from "@/app/components/HelperAvailabilityCalendar";
import { Card, Row, Col, Modal, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
export default function AppointmentsPage() {
  const { auth } = useAuth();
  const router = useRouter();
  const [availability, setAvailability] = useState<Availability[] | null>([]);
  const [appointments, setAppointments] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(
    null
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (!auth) {
      router.push("/");
      return;
    }

    const loadData = async () => {
      try {
        if (auth.role === "helper") {
          const slots = await fetchAvailabilityByHelperId(auth.id);
          const booked = await fetchAppointmentsByHelperId(auth.id);
          console.log("Fetched slots:", booked);
          setAvailability(slots);
          setAppointments(booked);
        } else if (auth.role === "user") {
          const booked = await fetchAppointmentsByUserId(auth.id);
          setAppointments(booked);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [auth]);

  const handleSetAvailability = async (
    date: string,
    toAdd: string[],
    toDelete: number[]
  ) => {
    try {
      if (!auth) {
        return { success: false, error: "Not authenticated." };
      }

      if (toAdd.length > 0) {
        await addHelperAvailability(auth.id, date, toAdd); // POST new slots
      }

      if (toDelete.length > 0) {
        await deleteHelperAvailability(toDelete); // DELETE slots by AV_id
      }

      const updated = await fetchAvailabilityByHelperId(auth.id);
      setAvailability(updated);

      return { success: true };
    } catch (err) {
      console.error("Failed to update availability:", err);
      return { success: false, error: "Failed to update availability." };
    }
  };

  const handleCancelAppointment = async (appointmentId: any) => {
    if (!auth) {
      setFeedbackMessage("You must be logged in to cancel an appointment.");
      setFeedbackType("error");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments?id=${appointmentId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to cancel appointment");

      let updatedAppointments;

      if (auth.role === "helper") {
        updatedAppointments = await fetchAppointmentsByHelperId(auth.id);
        const updatedAvailability = await fetchAvailabilityByHelperId(auth.id);
        setAvailability(updatedAvailability);
      } else if (auth.role === "user") {
        updatedAppointments = await fetchAppointmentsByUserId(auth.id);
      }

      setAppointments(updatedAppointments);

      setFeedbackMessage("Appointment cancelled successfully.");
      setFeedbackType("success");
    } catch (err) {
      console.error("Error cancelling appointment:", err);
      setFeedbackMessage("Failed to cancel appointment. Please try again.");
      setFeedbackType("error");
    }
  };

  return (
    <div className="container py-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {auth && auth.role === "helper" && (
            <>
              <h2 className="mt-4">Set Your Availability</h2>
              <HelperAvailabilityCalendar
                onSubmitAvailability={handleSetAvailability}
                existingAvailability={availability}
              />
            </>
          )}

          <h2 className="mt-4">Your Appointments</h2>
          {!appointments || appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            appointments.map((appt: any) => {
              const utcDate = new Date(appt.Date);
              const dateStr = utcDate.toISOString().split("T")[0];
              const timeStr = utcDate
                .toISOString()
                .split("T")[1]
                .substring(0, 5); // hh:mm

              return (
                <Card key={appt.A_id} className="mb-3 shadow-sm">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col className="col-md-8 col-12 mb-md-0 mb-2">
                        <h5 className="mb-1">{appt.Title}</h5>
                        <p className="mb-1 text-muted">{appt.Message}</p>
                        <small className="text-secondary">
                          {auth && auth.role === "helper" ? (
                            <>
                              <strong>
                                {appt.User?.Firstname} {appt.User?.Lastname}
                              </strong>{" "}
                              — {dateStr} at {timeStr} UTC
                            </>
                          ) : (
                            <>
                              <strong>
                                {appt.Helper?.Firstname} {appt.Helper?.Lastname}
                              </strong>{" "}
                              — {dateStr} at {timeStr} UTC
                            </>
                          )}
                        </small>
                      </Col>
                      <Col className="col-md-4 col-12 text-md-end">
                        <Button
                          variant="outline-danger"
                          onClick={() => {
                            setSelectedAppointmentId(appt.A_id);
                            setShowConfirmModal(true);
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </Row>
                    {feedbackMessage && (
                      <p
                        className={` ${
                          feedbackType === "success"
                            ? "text-success"
                            : "text-danger"
                        } mt-3 mb-0`}
                      >
                        {feedbackMessage}
                      </p>
                    )}
                  </Card.Body>
                </Card>
              );
            })
          )}
        </>
      )}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Cancellation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this appointment?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (selectedAppointmentId !== null) {
                handleCancelAppointment(selectedAppointmentId);
              }
              setShowConfirmModal(false);
            }}
          >
            Confirm Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
