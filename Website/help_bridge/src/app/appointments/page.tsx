"use client";

// Import necessary libraries and components
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
  // Initialize authentication context and router
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

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAppointmentId, setReviewAppointmentId] = useState<number | null>(
    null
  );
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHelperId, setReviewHelperId] = useState<number | null>(null);

  useEffect(() => {
    if (!auth) {
      // User is not authenticated, redirect to home
      router.push("/");
      return;
    }

    // User is authenticated, proceed to load data
    const loadData = async () => {
      try {
        // Fetch availability and appointments based on user role
        if (auth.role === "helper") {
          const slots = await fetchAvailabilityByHelperId(auth.id);
          const booked = await fetchAppointmentsByHelperId(auth.id);
          console.log("Fetched slots:", booked);
          setAvailability(slots);
          setAppointments(booked);
        } else if (auth.role === "user") {
          // User role, fetch user appointments
          const booked = await fetchAppointmentsByUserId(auth.id);
          setAppointments(booked);
        }
      } catch (err) {
        // Handle any errors that occur during data fetching
        console.error("Failed to load data:", err);
      } finally {
        // Set loading to false after data is fetched
        setLoading(false);
      }
    };

    loadData();
  }, [auth]);

  // Function to handle setting availability
  const handleSetAvailability = async (
    date: string,
    toAdd: string[],
    toDelete: number[]
  ) => {
    try {
      // Check if user is authenticated
      if (!auth) {
        return { success: false, error: "Not authenticated." };
      }
      // Validate date format
      if (toAdd.length > 0) {
        await addHelperAvailability(auth.id, date, toAdd); // POST new slots
      }
      // Validate toDelete array
      if (toDelete.length > 0) {
        await deleteHelperAvailability(toDelete); // DELETE slots by AV_id
      }
      // Fetch updated availability after changes
      const updated = await fetchAvailabilityByHelperId(auth.id);
      setAvailability(updated);

      return { success: true };
    } catch (err) {
      // Handle any errors that occur during availability update
      console.error("Failed to update availability:", err);
      return { success: false, error: "Failed to update availability." };
    }
  };

  // Function to handle cancelling an appointment
  const handleCancelAppointment = async (appointmentId: any) => {
    if (!auth) {
      setFeedbackMessage("You must be logged in to cancel an appointment.");
      setFeedbackType("error");
      return;
    }

    // Validate appointmentId
    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments?id=${appointmentId}`,
        {
          method: "DELETE",
        }
      );

      // Check if the response is ok
      if (!res.ok) throw new Error("Failed to cancel appointment");

      let updatedAppointments;

      // Fetch updated appointments based on user role
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

  // Function to create a review
  const createReview = async () => {
    if (!auth) return;
    if (!reviewHelperId || !reviewAppointmentId) {
      setFeedbackMessage("Missing review target.");
      setFeedbackType("error");
      return;
    }

    // Validate review inputs
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          H_id: reviewHelperId,
          Title: reviewTitle,
          Description: reviewDescription,
          U_id: auth.id,
          Rating: reviewRating,
          A_id: reviewAppointmentId,
        }),
      });

      // Check if the response is ok
      if (!res.ok) throw new Error("Failed to submit review");

      const result = await res.json();

      setFeedbackMessage(`Review submitted successfully.`);
      setFeedbackType("success");
      setShowReviewModal(false);

      // Refresh appointments to reflect updated R_id
      const updatedAppointments =
        auth.role === "helper"
          ? await fetchAppointmentsByHelperId(auth.id)
          : await fetchAppointmentsByUserId(auth.id);
      setAppointments(updatedAppointments);
    } catch (err) {
      console.error("Error submitting review:", err);
      setFeedbackMessage("Failed to submit review. Please try again.");
      setFeedbackType("error");
    }
  };

  // Filter appointments to only show those that are not in the past
  const filteredAppointments = (appointments || []).filter((appt: any) => {
    const utcDate = new Date(appt.Date);
    const oneHourAfterUtc = new Date(utcDate.getTime() + 60 * 60 * 1000);
    const now = new Date();
    if (auth && auth.role === "helper") {
      return oneHourAfterUtc.getTime() >= now.getTime();
    }
    return true;
  });

  return (
    // Main container for the appointments page
    <div className="container py-4">
      {feedbackMessage && (
        <div className={`alert ${feedbackType === "success" ? "alert-success" : "alert-danger"} mt-2`}>
          {feedbackMessage}
        </div>
      )}
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
          {!filteredAppointments || filteredAppointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            filteredAppointments.map((appt: any) => {
              const utcDate = new Date(appt.Date);
              const dateStr = utcDate.toISOString().split("T")[0];
              const timeStr = utcDate
                .toISOString()
                .split("T")[1]
                .substring(0, 5);
              const now = new Date();
              const oneHourAfterUtc = new Date(
                utcDate.getTime() + 60 * 60 * 1000
              );
              const isPast = oneHourAfterUtc.getTime() < now.getTime();

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
                      <Col className="col-md-4 col-12 text-md-end d-flex flex-column gap-2">
                        {!isPast && (
                          <Button
                            variant="outline-danger"
                            onClick={() => {
                              setSelectedAppointmentId(appt.A_id);
                              setShowConfirmModal(true);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        {auth && auth.role === "user" && !appt.R_id && (
                          <Button
                            className="outline-button-custom"
                            disabled={!isPast}
                            onClick={() => {
                              setReviewHelperId(appt.Helper?.H_id);
                              setReviewAppointmentId(appt.A_id);
                              setShowReviewModal(true);
                              setReviewAppointmentId(appt.A_id);
                            }}
                          >
                            Add Review
                          </Button>
                        )}
                      </Col>
                    </Row>
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

      <Modal
        show={showReviewModal}
        onHide={() => setShowReviewModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rating (1.0–5.0)</label>
            <input
              type="number"
              className="form-control"
              value={reviewRating}
              min={1}
              max={5}
              step={0.5}
              onChange={(e) => setReviewRating(parseFloat(e.target.value))}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button className="custom-button" onClick={createReview}>
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
