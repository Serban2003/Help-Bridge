"use client";

import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import LoginRegisterModal from "./LoginRegisterModal";

import "./MainNavbar.css";

export const MainNavbar = () => {
  const [showLoginRegisterModal, setShowLoginRegisterModal] = useState(false);

  const handleShow = () => setShowLoginRegisterModal(true);
  const handleClose = () => setShowLoginRegisterModal(false);

  return (
    <>
      <Navbar expand="lg" className="main-navbar sticky-top">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/images/HelpBridge_logo.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="link-text-white">Home</Nav.Link>
              <Nav.Link href="/about" className="link-text-white">About</Nav.Link>
              <NavDropdown title="Find help" id="help-nav-dropdown" className="link-text-white">
                <NavDropdown.Item href="/search?category=Financial">Financial</NavDropdown.Item>
                <NavDropdown.Item href="/search?category=Psychological">Psychological</NavDropdown.Item>
                <NavDropdown.Item href="/search?category=IT">IT</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Button className="btn-light" onClick={handleShow}>
              Login
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal for Login/Register */}
      <LoginRegisterModal
        show={showLoginRegisterModal}
        handleClose={handleClose}
      />
    </>
  );
};

export default MainNavbar;
