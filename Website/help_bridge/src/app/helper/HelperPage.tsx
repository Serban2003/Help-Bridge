"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import StarRating from "../components/StarRating";
import { Briefcase } from "lucide-react";
import ReviewCard from "../components/ReviewCard";
import Calendar from "../components/Calendar";
import "./page.css";
import "./../globals.css";

export default function HelperPage() {
  const searchParams = useSearchParams();
  const helperID = searchParams.get("helperId");

  const [showCalendar, setShowCalendar] = useState(false);

  const helper = {
    id: 1,
    name: "Iustinian Serban",
    category: "IT Support",
    rating: 3.6,
    imageUrl: "/images/default-avatar.jpg",
    description: "Vai ce frumos sunt ala ala",
    experience: "5+ years experience in technical support and infrastructure",
    company: {
      name: "TechBridge Solutions",
      description:
        "Reliable IT services and infrastructure for small businesses.",
      logo: "/images/consulting_banner.jpeg",
    },
  };

  // Dummy reviews
  const reviews = [
    {
      id: 1,
      name: "Maria Popescu",
      rating: 5,
      comment: "Very helpful and quick to respond. Highly recommend!",
      date: "April 30, 2025",
    },
    {
      id: 2,
      name: "Andrei Ionescu",
      rating: 4,
      comment: "Great support, just had minor delays.",
      date: "May 2, 2025",
    },
  ];

  const availableSlots = {
    "2025-05-06": ["09:00", "10:00", "14:00"],
    "2025-05-07": ["11:00", "13:00"],
    "2025-05-10": ["10:30", "12:00"],
  };

  if (!helper) {
    return <div className="text-center py-5">Helper not found</div>;
  }

  return (
    <>
      <section className="bg-secondary">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-4 text-center d-flex justify-content-center">
              <div className="shadow image-container">
                <img
                  src={helper.imageUrl}
                  alt={helper.name}
                  className="img-fluid"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            </div>

            <div className="col-lg-8">
              <h1 className="fw-bold">{helper.name}</h1>
              <p className="text-muted mb-1">{helper.category}</p>

              <p className="mb-2 text-secondary d-flex align-items-center">
                <Briefcase size={18} className="me-2 text-muted" />
                <strong>Experience:</strong>&nbsp;{helper.experience}
              </p>

              <div className="d-flex align-items-center mb-3">
                <img
                  src={helper.company.logo}
                  alt={`${helper.company.name} logo`}
                  className="rounded me-3"
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <div>
                  <p className="mb-0 fw-semibold">{helper.company.name}</p>
                  <p className="mb-0 text-muted small">
                    {helper.company.description}
                  </p>
                </div>
              </div>

              <StarRating rating={helper.rating} editable={false} />
              <p className="mt-3">{helper.description}</p>

              <div className="mt-4 d-flex gap-3 flex-wrap">
                <button
                  className="btn outline-button-custom px-4"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  {showCalendar ? "Hide Calendar" : "Book Consultation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mb-5">
        <hr className="my-5" />
        <div
          className={`reviews-calendar-grid ${
            showCalendar ? "two-cols" : "one-col"
          }`}
        >
          {/* Reviews */}
          <div
            className={`review-block ${
              showCalendar ? "with-calendar" : "full"
            }`}
          >
            <h3 className="fw-bold mb-4">User Reviews</h3>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.name}
                rating={review.rating}
                comment={review.comment}
                date={review.date}
              />
            ))}
          </div>

          {/* Calendar (always rendered for smooth layout) */}
          <div className={`calendar-block ${showCalendar ? "show" : ""}`}>
            <Calendar
              availableSlots={availableSlots}
              onBook={(date, time, title, message) =>
                alert(
                  `📅 Booked on ${date} at ${time}\n📝 Title: ${title}\n💬 Message: ${message}`
                )
              }
            />
          </div>
        </div>
      </section>
    </>
  );
}
