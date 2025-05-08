"use client";

import { useAuth } from "@/app/models/AuthContext";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import LoginRegisterModal from "./LoginRegisterModal";
import { useRouter } from "next/navigation";
import "./MainNavbar.css";

export const MainNavbar = () => {
  const { auth, logout } = useAuth();
  const [showLoginRegisterModal, setShowLoginRegisterModal] = useState(false);
  const [categories, setCategories] = useState<{ HC_id: number, Name: string }[]>([]);
  const handleShow = () => setShowLoginRegisterModal(true);
  const handleClose = () => setShowLoginRegisterModal(false);

  const router = useRouter();
  const goToSettings = () => {
    router.push("/settings");
  };

  // Fetch help categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/helper_categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
              <Nav.Link href="/" className="link-text-white">
                Home
              </Nav.Link>
              <NavDropdown title="Find help" id="help-nav-dropdown" className="link-text-white">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <NavDropdown.Item 
                      key={category.HC_id} 
                      href={`/search?helperCategoryId=${category.HC_id}`}>
                      {category.Name}
                    </NavDropdown.Item>
                  ))
                ) : (
                  <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                )}
              </NavDropdown>
            </Nav>
            {/* Conditional button based on login */}
            {auth ? (
              <>
                <span className="text-white me-3">
                  Welcome, {auth.data.Firstname}!
                </span>
                <Button variant="light me-3" onClick={goToSettings}>
                  Settings
                </Button>
                <Button variant="outline-light" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button className="btn-light" onClick={handleShow}>
                Login
              </Button>
            )}
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
