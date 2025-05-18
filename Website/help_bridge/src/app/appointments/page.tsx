"use client";

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

interface Appointment {
  id: number;
  title: string;
  message: string;
  date: string;         // ISO date string: "2025-05-15"
  helperName?: string;  // pentru user
  userName?: string;    // pentru helper
  category?: string;
  review?: { title: string; description: string; rating: number };
}

export default function AppointmentsPage() {
  // date fictive
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, title: "Tax Advice", message: "Discuss 2024 taxes", date: "2025-05-15", helperName: "Bob", category: "Financial" },
    { id: 2, title: "Stress Management", message: "Mindfulness tips", date: "2025-05-15", helperName: "Cara", category: "Psychological", review: { title: "Great session", description: "Very helpful", rating: 5 } },
    { id: 3, title: "Server Setup", message: "Deploy Node.js app", date: "2025-05-16", helperName: "Alice", category: "IT" },
    // pentru helper, poți pune userName în loc de helperName
  ]);

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0,10));
  const [dayAppointments, setDayAppointments] = useState<Appointment[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [activeReview, setActiveReview] = useState<Appointment|null>(null);

  // Când se schimbă data, filtrăm programările
  useEffect(() => {
    const filtered = appointments.filter(a => a.date === selectedDate);
    setDayAppointments(filtered);
  }, [selectedDate, appointments]);

  const openReview = (appt: Appointment) => {
    setActiveReview(appt);
    setShowReviewModal(true);
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Appointments</h2>

      {/* Calendar simplu */}
      <Form.Group as={Row} className="mb-4" controlId="apptDate">
        <Form.Label column sm={2}>Select Date:</Form.Label>
        <Col sm={4}>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </Col>
      </Form.Group>

      {/* Lista programărilor de azi */}
      {dayAppointments.length > 0 ? (
        dayAppointments.map(appt => (
          <Row key={appt.id} className="align-items-center bg-white rounded p-3 mb-3 shadow-sm">
            <Col md={8}>
              <h5>{appt.title}</h5>
              <p className="mb-1">{appt.message}</p>
              <p className="text-muted mb-1">Date: {appt.date}</p>
              {/* Dacă e pagina user, afișăm helperName & category */}
              {appt.helperName && <p className="mb-1">Helper: {appt.helperName} ({appt.category})</p>}
              {/* Dacă e pagina helper, afișăm userName */}
              {appt.userName && <p className="mb-1">User: {appt.userName}</p>}
            </Col>
            <Col md={4} className="text-end">
              {/* Buton Review dacă există deja review */}
              {appt.review ? (
                <Button variant="outline-primary" onClick={() => openReview(appt)}>
                  View Review
                </Button>
              ) : (
                <Button variant="primary" onClick={() => openReview(appt)}>
                  Add Review
                </Button>
              )}
              <Button variant="outline-danger" className="ms-2">
                Cancel
              </Button>
            </Col>
          </Row>
        ))
      ) : (
        <p>No appointments for {selectedDate}.</p>
      )}

      {/* Modal Review */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{activeReview?.review ? "Review" : "Add Review"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeReview?.review ? (
            <>
              <h5>{activeReview.review.title}</h5>
              <p>{activeReview.review.description}</p>
              <p>Rating: {activeReview.review.rating} / 5</p>
            </>
          ) : (
            <Form>
              <Form.Group controlId="revTitle" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
              <Form.Group controlId="revDesc" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
              <Form.Group controlId="revRating" className="mb-3">
                <Form.Label>Rating</Form.Label>
                <Form.Select>
                  {[1,2,3,4,5].map(n => <option key={n}>{n}</option>)}
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
          {!activeReview?.review && (
            <Button variant="primary" onClick={() => setShowReviewModal(false)}>
              Save Review
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
