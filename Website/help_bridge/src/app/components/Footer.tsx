import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import { useAuth } from "@/app/models/AuthContext";
import "./Footer.css";

const Footer = () => {
  const {auth} = useAuth();
  useEffect(() => {}, [auth]);

  return (
    <footer className="footer bg-dark text-white pt-5 pb-3">
      <Container>
        <Row>
          {/* Logo or Brand */}
          <Col md={4} className="mb-4 d-flex align-items-start">
            <div>
              <h4 className="fw-bold mb-1">HelpBridge</h4>
              <p className="text-muted small mb-0">
                Empowering connections between individuals and trusted experts.
              </p>
            </div>
          </Col>

          {/* Navigation */}
          <Col md={4} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="link-text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/search" className="link-text-white">
                  Find help
                </a>
              </li>
              {auth &&  (
                <>
                  <li>
                    <a href="/appointments" className="link-text-white">
                      Appointments
                    </a>
                  </li>
                  <li>
                    <a href="/settings" className="link-text-white">
                      Settings
                    </a>
                  </li>
                </>
              )}
            </ul>
          </Col>

          {/* Contact / Social */}
          <Col md={4} className="mb-4">
            <h5>Contact</h5>
            <p className="mb-1">
              <Mail size={16} className="me-2" />
              contact@helpbridge.com
            </p>
            <p>
              <Phone size={16} className="me-2" />
              +40-264-595699
            </p>
            <div className="d-flex gap-3 mt-2">
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="link-text-white">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="link-text-white">
                <Instagram size={20} />
              </a>
              <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="link-text-white">
                <Twitter size={20} />
              </a>
            </div>
          </Col>
        </Row>

        {/* Bottom bar */}
        <hr className="border-secondary" />
        <p className="text-center text-white small mb-0">
          &copy; {new Date().getFullYear()} HelpBridge. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
