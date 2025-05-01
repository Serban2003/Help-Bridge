"use client";

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import {
  User,
  HelpingHand,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import AccountSetupModal from "./AccountSetupModal";
import RegisterStatusModal from "./RegisterStatusModal";
import InputGroup from "react-bootstrap/InputGroup";

import "./LoginRegisterModal.css";
import "./../globals.css";

interface LoginRegisterModalProps {
  show: boolean;
  handleClose: () => void;
}

const LoginRegisterModal = ({ show, handleClose }: LoginRegisterModalProps) => {
  const [key, setKey] = useState("login");
  const [registerRole, setRegisterRole] = useState("user");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [loginEmailError, setLoginEmailError] = useState("");
  const [loginPasswordError, setLoginPasswordError] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerConfirmPasswordVisible, setRegisterConfirmPasswordVisible] =
    useState(false);

  const [registerEmailError, setRegisterEmailError] = useState("");
  const [registerPasswordError, setRegisterPasswordError] = useState("");
  const [registerConfirmPasswordError, setRegisterConfirmPasswordError] =
    useState("");

  const [showAccountSetupModal, setShowAccountSetupModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const handleFinishSetup = () => {
    setShowAccountSetupModal(false);
    setShowSuccessModal(true);
  };

  const handleLoginClick = () => {
    let hasError = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!loginEmail) {
      setLoginEmailError("Email is required!");
      hasError = true;
    } else if (!emailRegex.test(loginEmail)) {
      setLoginEmailError("Please enter a valid email address!");
      hasError = true;
    } else {
      setLoginEmailError("");
    }

    if (!loginPassword) {
      setLoginPasswordError("Password is required!");
      hasError = true;
    } else {
      setLoginPasswordError("");
    }

    if (hasError) return;

    // All good
    handleClose();
  };

  const handleRegisterClick = () => {
    let hasError = false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!registerEmail) {
      setRegisterEmailError("Email is required!");
      hasError = true;
    } else if (!emailRegex.test(registerEmail)) {
      setRegisterEmailError("Please enter a valid email address!");
      hasError = true;
    } else {
      setRegisterEmailError("");
    }

    if (!registerPassword) {
      setRegisterPasswordError("Password is required!");
      hasError = true;
    } else {
      setRegisterPasswordError("");
    }

    if (!registerConfirmPassword) {
      setRegisterConfirmPasswordError("Please confirm your password!");
      hasError = true;
    } else if (registerPassword !== registerConfirmPassword) {
      setRegisterConfirmPasswordError("Passwords do not match!");
      hasError = true;
    } else {
      setRegisterConfirmPasswordError("");
    }

    if (hasError) return;

    // All good
    handleClose();
    resetForm();
    setShowAccountSetupModal(true);
  };

  const resetForm = () => {
    setLoginEmail("");
    setLoginPassword("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <Tabs
            id="login-register-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k || "login")}
            className="mb-3 custom-tabs"
            justify
          >
            {/* Login Tab */}
            <Tab eventKey="login" title="Login">
              <Form>
                {/* Email and Password */}
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label>
                    {" "}
                    <Mail size={16} className="me-2" />
                    Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    isInvalid={!!loginEmailError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {loginEmailError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label>
                    <Lock size={16} className="me-2" />
                    Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      required
                      type={loginPasswordVisible ? "text" : "password"}
                      placeholder="Enter password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      isInvalid={!!loginPasswordError}
                    />
                    <Button
                      variant="primary"
                      className="rounded-end custom-button"
                      onClick={() =>
                        setLoginPasswordVisible(!loginPasswordVisible)
                      }
                      tabIndex={-1}
                    >
                      {loginPasswordVisible ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {loginPasswordError}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="primary"
                  type="button"
                  className="w-100 custom-button"
                  onClick={handleLoginClick}
                >
                  Login
                </Button>
              </Form>
            </Tab>

            {/* Register Tab */}
            <Tab eventKey="register" title="Register">
              <Form>
                {/* Role Selection */}
                <Form.Group className="mb-3 text-center">
                  <div className="d-flex align-items-center justify-content-between gap-3">
                    <Form.Label className="mb-0">Select Role</Form.Label>
                    <ButtonGroup>
                      <ToggleButton
                        id="register-user"
                        type="radio"
                        variant="outline-success"
                        name="registerRole"
                        value="user"
                        checked={registerRole === "user"}
                        onChange={(e) => setRegisterRole(e.currentTarget.value)}
                        className={`${
                          registerRole === "user"
                            ? "toggle-button-custom-active"
                            : "toggle-button-custom"
                        }`}
                      >
                        <User size={18} />
                        User
                      </ToggleButton>
                      <ToggleButton
                        id="register-helper"
                        type="radio"
                        variant="outline-success"
                        name="registerRole"
                        value="helper"
                        checked={registerRole === "helper"}
                        onChange={(e) => setRegisterRole(e.currentTarget.value)}
                        className={`${
                          registerRole === "helper"
                            ? "toggle-button-custom-active"
                            : "toggle-button-custom"
                        }`}
                      >
                        <HelpingHand size={18} />
                        Helper
                      </ToggleButton>
                    </ButtonGroup>
                  </div>
                </Form.Group>

                {/* Email, Password, Confirm Password */}
                <Form.Group className="mb-3" controlId="registerEmail">
                  <Form.Label>
                    {" "}
                    <Mail size={16} className="me-2" />
                    Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    isInvalid={!!registerEmailError}
                  />
                  <Form.Control.Feedback type="invalid">
                    {registerEmailError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerPassword">
                  <Form.Label>
                    <Lock size={16} className="me-2" />
                    Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      required
                      type={registerPasswordVisible ? "text" : "password"}
                      placeholder="Enter password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      isInvalid={!!registerPasswordError}
                    />
                    <Button
                      variant="primary"
                      className="rounded-end custom-button"
                      onClick={() =>
                        setRegisterPasswordVisible(!registerPasswordVisible)
                      }
                      tabIndex={-1}
                    >
                      {registerPasswordVisible ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {registerPasswordError}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="registerConfirmPassword"
                >
                  <Form.Label>
                    <ShieldCheck size={16} className="me-2" />
                    Confirm Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      required
                      type={
                        registerConfirmPasswordVisible ? "text" : "password"
                      }
                      placeholder="Confirm password"
                      value={registerConfirmPassword}
                      onChange={(e) =>
                        setRegisterConfirmPassword(e.target.value)
                      }
                      isInvalid={!!registerConfirmPasswordError}
                    />
                    <Button
                      variant="primary"
                      className="rounded-end custom-button"
                      onClick={() =>
                        setRegisterConfirmPasswordVisible(
                          !registerConfirmPasswordVisible
                        )
                      }
                      tabIndex={-1}
                    >
                      {registerConfirmPasswordVisible ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {registerConfirmPasswordError}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Button
                  variant="success"
                  type="button"
                  className="w-100 custom-button"
                  onClick={handleRegisterClick}
                >
                  Register
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>

      <AccountSetupModal
        show={showAccountSetupModal}
        handleClose={() => setShowAccountSetupModal(false)}
        onSetupComplete={handleFinishSetup}
        registerRole={registerRole}
      />

      <RegisterStatusModal
        show={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
      />
    </>
  );
};

export default LoginRegisterModal;
