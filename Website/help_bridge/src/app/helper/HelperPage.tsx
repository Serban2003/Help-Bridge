"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StarRating from "../components/StarRating";
import { Briefcase } from "lucide-react";
import ReviewCard from "../components/ReviewCard";
import Calendar from "../components/Calendar";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import "./page.css";
import "./../globals.css";
import { Helper as HelperModel } from "@/app/models/Helper";
import { HelperCategory } from "@/app/models/HelperCategory";
import { Review } from "@/app/models/Review";
import { ProfileImage } from "@/app/models/ProfileImage";
import {
  fetchHelperById,
  fetchHelperCategoryById,
  fetchReviewsByHelperId,
  getAverageRating,
  fetchProfileImageById,
} from "../utils";

export default function HelperPage() {
  const searchParams = useSearchParams();
  const helperID = searchParams.get("helperId");

  const [helper, setHelper] = useState<HelperModel | null>(null);
  const [category, setCategory] = useState<HelperCategory | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(
    "/images/default-avatar.jpg"
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState<string>("");
  const [averageRating, setAverageRating] = useState<number>(0);

  const availableSlots = {
    "2025-05-06": ["09:00", "10:00", "14:00"],
    "2025-05-07": ["11:00", "13:00"],
    "2025-05-10": ["10:30", "12:00"],
  };

  useEffect(() => {
    if (!helperID) return;
    const fetchAll = async () => {
      try {
        // Fetch helper and set it
        const helperData = await fetchHelperById(helperID);
        setHelper(helperData);
        console.log(helperData);
        // Use the fetched data directly, not the state
        if (helperData) {
          const categoryData = await fetchHelperCategoryById(helperData.HC_id);
          setCategory(categoryData);

          const reviewsData = await fetchReviewsByHelperId(helperData.H_id);
          setReviews(reviewsData);

          // Calculate average rating after setting reviews
          if (reviewsData != null && reviewsData.length > 0) {
            setAverageRating(getAverageRating(reviewsData));
          } else {
            setAverageRating(0);
          }

          if (helperData.I_id) {
            // Fetch profile image
            const imageData = await fetchProfileImageById(helperData.I_id);
            if(imageData)
              setImageUrl(ProfileImage.fromByteArrayToImageUrl(imageData.Data.data));
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load helper details.");
      }
    };

    fetchAll();
  }, [helperID]);

  if (error) {
    return (
      <Alert variant="danger" className="text-center my-5">
        {error}
      </Alert>
    );
  }

  if (!helper) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <section className="bg-secondary">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-lg-4 text-center d-flex justify-content-center">
              <div className="shadow image-container">
                <img
                  src={imageUrl}
                  alt={helper.Firstname}
                  className="img-fluid"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
            </div>

            <div className="col-lg-8">
              <h1 className="fw-bold">{`${helper.getFullName()}`}</h1>
              <p className="text-muted mb-1">{category?.Name || "General"}</p>

              <p className="mb-2 text-secondary d-flex align-items-center">
                <Briefcase size={18} className="me-2 text-muted" />
                <strong>Experience:</strong>&nbsp;
                {`${helper.getFormatedExperience()}`}
              </p>

              <StarRating rating={averageRating} editable={false} />
              <p className="mt-3">{helper.Description}</p>

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
            {reviews ? (
              reviews.map((review) => (
                <ReviewCard
                  key={review.R_id}
                  U_id={review.U_id}
                  rating={review.Rating}
                  description={review.Description}
                  date={new Date(review.Ts_created)}
                />
              ))
            ) : (
              <p className="text-muted">No reviews available.</p>
            )}
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
