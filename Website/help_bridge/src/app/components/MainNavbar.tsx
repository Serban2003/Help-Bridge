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
import { ProfileImage } from "../models/ProfileImage";
import "./MainNavbar.css";
import {
  fetchProfileImageById,
  fetchHelperById,
  fetchUserById,
} from "../utils";

export const MainNavbar = () => {
  const { auth, logout, profileImageUrl, setProfileImageUrl } = useAuth();
  const [showLoginRegisterModal, setShowLoginRegisterModal] = useState(false);
  const [categories, setCategories] = useState<
    { HC_id: number; Name: string }[]
  >([]);
  const router = useRouter();

  const handleShow = () => setShowLoginRegisterModal(true);
  const handleClose = () => setShowLoginRegisterModal(false);
  const goToDashboard = () => router.push("/Dashboard");
  const goToAppointments = () => router.push("/appointments");

  // Fetch help categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/helper_categories"
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchImage = async () => {
      if (!auth) return;

      try {
        let imageId: number | null | undefined;

        if (auth.role === "user") {
          const dbUser = await fetchUserById(auth.id);
          if (!dbUser) return;
          imageId = dbUser.I_id;
        } else {
          const dbHelper = await fetchHelperById(auth.id);
          if (!dbHelper) return;
          imageId = dbHelper.I_id;
        }

        if (!imageId) return;

        const imageData = await fetchProfileImageById(imageId);
        if (imageData) {
          setProfileImageUrl(
            ProfileImage.fromByteArrayToImageUrl(imageData.Data.data)
          );
        }
      } catch (err) {
        console.error("Failed to load profile image:", err);
      }
    };
    fetchCategories();
    fetchImage();
  }, [profileImageUrl, auth]);

  return (
    <>
      <Navbar expand="lg" className="main-navbar sticky-top">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt="HelpBridge logo"
              src="/images/HelpBridge_logo.png"
              width="62"
              height="52"
              className="d-inline-block align-top"
              style={{objectFit: "contain"}}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="link-text-white">
                Home
              </Nav.Link>

              <NavDropdown
                title="Find help"
                id="help-nav-dropdown"
                className="link-text-white"
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <NavDropdown.Item
                      key={category.HC_id}
                      href={`/search?helperCategoryId=${category.HC_id}`}
                    >
                      {category.Name}
                    </NavDropdown.Item>
                  ))
                ) : (
                  <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                )}
                <NavDropdown.Item href="/search">All Helpers</NavDropdown.Item>
              </NavDropdown>

              {/* Buton Appointments */}
              {auth && (
                <Nav.Link
                  onClick={goToAppointments}
                  className="link-text-white"
                >
                  Appointments
                </Nav.Link>
              )}
            </Nav>

            {/* Conditional button based on login */}
            {auth ? (
              <Nav className="ms-auto">
                <NavDropdown
                  title={
                    <img
                      src={profileImageUrl}
                      alt="Profile"
                      className="rounded-circle"
                      width="35"
                      height="35"
                    />
                  }
                  id="profile-dropdown"
                  align="end"
                  className="link-text-white"
                >
                  <NavDropdown.Item onClick={goToDashboard}>
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            ) : (
              <Button className="btn-light ms-auto" onClick={handleShow}>
                Login/SignUp
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
