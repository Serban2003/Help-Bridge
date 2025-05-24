"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import StarRating from "../components/StarRating";
import { Briefcase, Layers } from "lucide-react";
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
  fetchAvailabilityByHelperId,
  createAppointment,
  updateAvailability,
} from "../utils";
import { useAuth } from "../models/AuthContext";
import { Availability } from "../models/Availability";
import { Appointment } from "../models/Appointment";
import { Modal, Button } from "react-bootstrap";

export default function HelperPage() {
  const searchParams = useSearchParams();
  const { auth } = useAuth();
  const helperID = searchParams.get("helperId");

  const [helper, setHelper] = useState<HelperModel | null>(null);
  const [category, setCategory] = useState<HelperCategory | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [availability, setAvailability] = useState<Availability[] | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(
    "/images/default-avatar.jpg"
  );
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [companyImageUrl, setCompanyImageUrl] = useState<string>(
    "/images/default-company.png"
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState<string>("");
  const [averageRating, setAverageRating] = useState<number>(0);

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

          const availabilityData = await fetchAvailabilityByHelperId(
            helperData.H_id
          );
          setAvailability(availabilityData);

          // Calculate average rating after setting reviews
          if (reviewsData != null && reviewsData.length > 0) {
            setAverageRating(getAverageRating(reviewsData));
          } else {
            setAverageRating(0);
          }

          if (helperData.I_id) {
            // Fetch profile image
            const imageData = await fetchProfileImageById(helperData.I_id);
            if (imageData)
              setImageUrl(
                ProfileImage.fromByteArrayToImageUrl(imageData.Data.data)
              );
          }
          const companyRes = await fetch(
            `http://localhost:5000/api/companies?id=${helperData.C_id}`
          );
          const companyData = await companyRes.json();
          if (!companyData) {
            console.error("Failed to fetch company data");
            return;
          }
          setCompany(companyData);

          if (companyData.I_id) {
            const imageData = await fetchProfileImageById(companyData.I_id);
            if (imageData) {
              setCompanyImageUrl(
                ProfileImage.fromByteArrayToImageUrl(imageData.Data.data)
              );
            } else {
              setCompanyImageUrl("/images/default-company.png"); // fallback if image not found
            }
          } else {
            setCompanyImageUrl("/images/default-company.png"); // fallback if no I_id
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load helper details.");
      }
    };

    fetchAll();
  }, [helperID]);

  const handleBooking = async (
    date: string,
    time: string,
    title: string,
    message: string,
    AV_id: string
  ) => {
    if (!auth) {
      return {
        success: false,
        error: "You must be logged in to book a consultation.",
      };
    }
    try {
      if (helper == null) {
        return {
          success: false,
          error: "Helper data is not available.",
        };
      }
      const A_id = await createAppointment(
        new Appointment(
          0,
          helper.H_id || 0,
          auth.id,
          0,
          title,
          message,
          new Date(date + " " + time),
          new Date()
        )
      );

      if (!A_id) {
        return {
          success: false,
          error: "Failed to create appointment.",
        };
      }
      const response = await updateAvailability(AV_id, A_id, true);

      if (!response) {
        return { success: false, error: "Failed to update availability." };
      }
      if (helper == null) {
        return { success: false, error: "Helper data is not available." };
      }
      const availabilityData = await fetchAvailabilityByHelperId(helper.H_id);
      setAvailability(availabilityData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: "An unexpected error occurred during booking.",
      };
    }
  };

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

            <div className="col-lg-8 d-flex flex-column gap-2">
              <h1 className="fw-bold">{helper.getFullName()}</h1>
              <p className="text-muted mb-0 d-flex align-items-center">
                <Layers size={18} className="me-2 text-muted" />
                {category?.Name || "General"}
              </p>

              <p className="text-secondary d-flex align-items-center mb-0">
                <Briefcase size={18} className="me-2 text-muted" />
                <strong>Experience:</strong>&nbsp;
                {helper.getFormatedExperience()}
              </p>

              <StarRating rating={averageRating} editable={false} />
              <p className="mb-0">{helper.Description}</p>

              {/* Company block */}
              {company && (
                <div className="mt-2">
                  <div
                    className="d-inline-flex align-items-center gap-3 cursor-pointer"
                    onClick={() => setShowCompanyModal(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={companyImageUrl || "/images/default-company.png"}
                      alt="Company Logo"
                      className="rounded"
                      style={{ width: 40, height: 40, objectFit: "cover" }}
                    />
                    <h5 className="mb-0">{company.Name}</h5>
                  </div>
                </div>
              )}

              <div className="mt-2 d-flex gap-3 flex-wrap">
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
              availableSlots={availability}
              onBook={(date, time, title, message, AV_id) =>
                handleBooking(date, time, title, message, AV_id)
              }
            />
          </div>
        </div>
      </section>
      {/* Company Details Modal */}
      {company && (
        <Modal
          show={showCompanyModal}
          onHide={() => setShowCompanyModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Company Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                <img
                  src={companyImageUrl || "/images/default-company.png"}
                  alt="Company Logo"
                  className="rounded"
                  style={{ width: 120, height: 120, objectFit: "cover" }}
                />
                <div className="text-center text-md-start">
                  <p className="mb-1">
                    <strong>Name:</strong> {company.Name}
                  </p>
                  <p className="mb-1">
                    <strong>Description:</strong> {company.Description}
                  </p>
                  <p className="mb-0">
                    <strong>Address:</strong> {company.Address}
                  </p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCompanyModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
