"use client";

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { User, Phone, Building, FileText, Briefcase } from "lucide-react";
import "./LoginRegisterModal.css";

interface AccountSetupModalProps {
  show: boolean;
  handleClose: () => void;
  onSetupComplete: () => void;
  registerRole: string;
}

const AccountSetupModal = ({
  show,
  handleClose,
  onSetupComplete,
  registerRole,
}: AccountSetupModalProps) => {
  const [validated, setValidated] = useState(false);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");

  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");

  const [selectedCompany, setSelectedCompany] = useState("");
  const [customCompanyName, setCustomCompanyName] = useState("");
  const [customCompanyDescription, setCustomCompanyDescription] = useState("");
  const [customCompanyAddress, setCustomCompanyAddress] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    // Everything valid
    onSetupComplete();
    resetForm();
  };

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setPhone("");
    setDescription("");
    setExperience("");
    setSelectedCompany("");
    setCustomCompanyName("");
    setCustomCompanyDescription("");
    setCustomCompanyAddress("");
    setValidated(false);
  };
  
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" centered>
      <Modal.Header>
        <Modal.Title>
          {registerRole === "helper"
            ? "Helper Account Setup"
            : "User Account Setup"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {/* Firstname */}
          <Form.Group className="mb-3" controlId="formFirstname">
            <Form.Label>
              <User size={16} className="me-2" />
              Firstname
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your firstname.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Lastname */}
          <Form.Group className="mb-3" controlId="formLastname">
            <Form.Label>
              <User size={16} className="me-2" />
              Lastname
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your lastname.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>
              <Phone size={16} className="me-2" />
              Phone Number
            </Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter your phone number.
            </Form.Control.Feedback>
          </Form.Group>

          {/* Fields only for Helper */}
          {registerRole === "helper" && (
            <>
              {/* Description */}
              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label>
                  <FileText size={16} className="me-2" />
                  Description
                </Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Your words can win clients! Tell us your best pitch."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a description.
                </Form.Control.Feedback>
              </Form.Group>

              {/* Experience */}
              <Form.Group className="mb-3" controlId="formExperience">
                <Form.Label>
                  <Briefcase size={16} className="me-2" />
                  Experience (in months)
                </Form.Label>
                <Form.Control
                  required
                  type="number"
                  min="0"
                  placeholder="Enter your experience in months"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter your experience.
                </Form.Control.Feedback>
              </Form.Group>

              {/* Company */}
              <Form.Group className="mb-3" controlId="formCompany">
                <Form.Label>
                  <Building size={16} className="me-2" />
                  Company
                </Form.Label>
                <Form.Select
                  required
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                >
                  <option value="">Select your company</option>
                  <option value="Company1">#1</option>
                  <option value="Company2">#2</option>
                  <option value="Company3">#3</option>
                  <option value="other">My company is not listed</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select a company.
                </Form.Control.Feedback>

                {/* Custom Company Fields */}
                {selectedCompany === "other" && (
                  <div
                    className="mt-3 p-3 border rounded"
                    style={{
                      maxHeight: "250px",
                      overflowY: "auto",
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    {/* Company Name */}
                    <Form.Group
                      className="mb-3"
                      controlId="formCustomCompanyName"
                    >
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Enter your company name"
                        value={customCompanyName}
                        onChange={(e) => setCustomCompanyName(e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your company name.
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Company Description */}
                    <Form.Group
                      className="mb-3"
                      controlId="formCustomCompanyDescription"
                    >
                      <Form.Label>Company Description</Form.Label>
                      <Form.Control
                        required
                        as="textarea"
                        rows={3}
                        placeholder="Describe your company's services or mission"
                        value={customCompanyDescription}
                        onChange={(e) =>
                          setCustomCompanyDescription(e.target.value)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Please describe your company.
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Company Address */}
                    <Form.Group
                      className="mb-3"
                      controlId="formCustomCompanyAddress"
                    >
                      <Form.Label>Company Address</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Enter your company address"
                        value={customCompanyAddress}
                        onChange={(e) =>
                          setCustomCompanyAddress(e.target.value)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your company address.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                )}
              </Form.Group>
            </>
          )}

          {/* Buttons */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button
              variant="danger"
              type="button"
              className="w-50"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              className="w-50 custom-button"
            >
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AccountSetupModal;
