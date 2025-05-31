"use client";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/navigation"; // Import useRouter

interface RegisterStatusModalProps {
  show: boolean;
  handleClose: () => void;
}

const RegisterStatusModal = ({
  show,
  handleClose,
}: RegisterStatusModalProps) => {
  // Initialize the router to handle navigation
  const router = useRouter();

  // Function to handle the close action and navigate to the dashboard
  const goToDashboard = () => {
    router.push("/settings"); 
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Success!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <h4>🎉 Your account has been created!</h4>
        <p>Welcome to the platform.</p>
        <Button variant="success" className="mt-3" onClick={goToDashboard}>
          Go to Dashboard
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterStatusModal;
