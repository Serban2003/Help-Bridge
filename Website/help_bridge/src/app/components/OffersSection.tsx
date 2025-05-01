import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { BarChart2, Brain, MonitorSmartphone } from "lucide-react";
import "./OfferSection.css";

const OfferSection = () => {
  const offers = [
    {
      title: "Financial Consulting",
      description: "Professional advice for financial growth.",
      icon: <BarChart2 size={48} className="accent-color mb-3" />,
    },
    {
      title: "Psychological Support",
      description: "Compassionate mental health professionals.",
      icon: <Brain size={48} className="accent-color mb-3" />,
    },
    {
      title: "IT Solutions",
      description: "Expertise in technology and IT issues.",
      icon: <MonitorSmartphone size={48} className="accent-color mb-3" />,
    },
  ];

  return (
    <section className="offer-section py-5 px-md-5 px-2 text-center text-white w-100">
      <Container>
        <h2 className="mb-5 fw-bold">What We Offer</h2>
        <Row>
          {offers.map((offer, index) => (
            <Col md={4} className="mb-4" key={index}>
              <div className="offer-box p-3 bg-white">
                {offer.icon}
                <h5 className="fw-semibold text-black">{offer.title}</h5>
                <p className="text-muted small">{offer.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default OfferSection;
