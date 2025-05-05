import React from "react";
import StarRating from "./StarRating";
import "./ReviewCard.css"; // Import your CSS file for styling

interface ReviewCardProps {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const ReviewCard = ({ name, rating, comment, date }: ReviewCardProps) => {
  return (
    <div className="review-card mb-4 p-3 rounded shadow-sm border bg-white">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="mb-0 fw-semibold">{name}</h6>
        <small className="text-muted">{date}</small>
      </div>
      <StarRating rating={rating} editable={false} />
      <p className="mt-2 mb-0">{comment}</p>
    </div>
  );
};

export default ReviewCard;
