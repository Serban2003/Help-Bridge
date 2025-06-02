import React, { useEffect, useState, JSX } from "react";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import {
  Gavel,
  Wallet,
  BarChart2,
  Briefcase,
  HeartPulse,
  Home,
  Hammer,
  MonitorSmartphone,
  Server,
  BookOpen,
  PenTool,
  Camera,
} from "lucide-react";
import {fetchAllHelperCategories} from "../utils";
import "./OfferSection.css";

const iconMap: { [key: string]: JSX.Element } = {
  "Legal Advice": <Gavel size={48} className="accent-color mb-3" />,
  "Financial Planning": <Wallet size={48} className="accent-color mb-3" />,
  "Career Coaching": <Briefcase size={48} className="accent-color mb-3" />,
  "Health & Wellness": <HeartPulse size={48} className="accent-color mb-3" />,
  "Home Services": <Home size={48} className="accent-color mb-3" />,
  "Tech Support": <MonitorSmartphone size={48} className="accent-color mb-3" />,
  "Education & Tutoring": <BookOpen size={48} className="accent-color mb-3" />,
  "Creative Services": <PenTool size={48} className="accent-color mb-3" />,
};

const OfferSection = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/helper_categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setOffers(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="offer-section py-5 px-md-5 px-2 text-center text-white w-100">
      <Container>
        <h2 className="mb-5 fw-bold">What We Offer</h2>

        {loading && <Spinner animation="border" variant="light" />}

        {error && <Alert variant="danger">{error}</Alert>}

        <Row>
          {offers.map((offer, index) => (
            <Col md={4} className="mb-4" key={index}>
              <div className="offer-box p-3 bg-white">
                {iconMap[offer.Name] || (
                  <MonitorSmartphone size={48} className="accent-color mb-3" />
                )}
                <h5 className="fw-semibold text-black">{offer.Name}</h5>
                <p className="text-muted small">{offer.Description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default OfferSection;
