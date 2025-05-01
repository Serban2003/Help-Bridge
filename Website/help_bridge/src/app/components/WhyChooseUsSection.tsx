import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { CheckCircle } from "lucide-react";
import "./WhyChooseUsSection.css";

const features = [
  "Easy and fast booking",
  "Certified consultants",
  "Confidential services",
  "Personalized support",
];

const WhyChooseUsSection = () => {
    return (
        <section className="why-choose-section w-100 px-md-5 px-2 text-center">
          <Container>
            <h2 className="fw-bold mb-5">
              Why Choose <span className="accent-color">HelpBridge</span>?
            </h2>
            <Row className="justify-content-center">
              {features.map((text, index) => (
                <Col key={index} md={6} lg={5} xl={4} className="mb-4">
                  <Card className="feature-card h-100 shadow-sm">
                    <Card.Body className="d-flex align-items-center">
                      <CheckCircle className="text-success me-3 flex-shrink-0" size={28} />
                      <span className="text-start">{text}</span>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      );
};

export default WhyChooseUsSection;
