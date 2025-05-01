import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./MissionSection.css";

const MissionSection = () => {
  return (
    <div className="mission-section px-md-5 px-2">
      <Container>
        <Row className="align-items-center">
          {/* Left: Image */}
          <Col md={6} className="text-center mb-4 mb-md-0">
            <img
              src="/images/lightbulb.jpg"
              alt="Hand holding lightbulb"
              className="mission-image shadow rounded"
            />
          </Col>

          {/* Right: Text */}
          <Col md={6}>
            <h2 className="fw-bold mb-3">Our Mission</h2>
            <p className="text-muted">
              At HelpBridge, we believe that finding the right expert should be simple and stress-free. <br /><br/>
              Our platform bridges the gap between individuals and specialists, offering guidance when it matters most.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MissionSection;
