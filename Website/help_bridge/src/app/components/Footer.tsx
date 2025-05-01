import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white pt-5 pb-3">
      <Container>
        <Row>
          {/* Logo or Brand */}
          <Col md={4} className="mb-4">
            <h4 className="fw-bold">HelpBridge</h4>
            <p className="text-muted small">
              Empowering connections between individuals and trusted experts.
            </p>
          </Col>

          {/* Navigation */}
          <Col md={4} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Home</a></li>
              <li><a href="#" className="footer-link">About</a></li>
              <li><a href="#" className="footer-link">Services</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
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
              +123 456 7890
            </p>
            <div className="d-flex gap-3 mt-2">
              <a href="#" className="text-white"><Facebook size={20} /></a>
              <a href="#" className="text-white"><Instagram size={20} /></a>
              <a href="#" className="text-white"><Twitter size={20} /></a>
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
