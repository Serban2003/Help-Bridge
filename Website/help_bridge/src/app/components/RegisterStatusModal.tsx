"use client";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface RegisterStatusModalProps {
  show: boolean;
  handleClose: () => void;
}

const RegisterStatusModal = ({
  show,
  handleClose,
}: RegisterStatusModalProps) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Success!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <h4>🎉 Your account has been created!</h4>
        <p>Welcome to the platform.</p>
        <Button variant="success" className="mt-3" onClick={handleClose}>
          Go to Dashboard
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterStatusModal;
