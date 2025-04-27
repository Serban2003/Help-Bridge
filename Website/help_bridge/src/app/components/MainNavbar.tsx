"use client";

import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import "./MainNavbar.css";

export const MainNavbar = () => {
  return (
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
            <Nav.Link href="">Home</Nav.Link>
            <Nav.Link href="/link">About</Nav.Link>
            <NavDropdown title="Find help" id="help-nav-dropdown">
              <NavDropdown.Item href="#action1">Item #1</NavDropdown.Item>
              <NavDropdown.Item href="#action2">Item #2</NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Button className="btn-light">Login</Button>
        </Navbar.Collapse>
        
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
