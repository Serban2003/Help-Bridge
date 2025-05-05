import React, { useState } from "react";
import { Star, StarHalf, Star as StarFilled } from "lucide-react";
import "./StarRating.css"; // Import your CSS file for styling

interface StarRatingProps {
  rating: number; // e.g. 4.5
  onRate?: (value: number) => void;
  max?: number;
  editable?: boolean;
}

const StarRating = ({ rating, onRate, max = 5, editable = false }: StarRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleClick = (value: number) => {
    if (editable && onRate) onRate(value);
  };

  const renderStars = () => {
    const stars = [];
    const activeRating = hovered ?? rating;

    for (let i = 1; i <= max; i++) {
      const isFilled = i <= Math.floor(activeRating);
      const isHalf = i - activeRating > -1 && i - activeRating < 1;

      stars.push(
        <span
          key={i}
          className={`star-wrapper ${editable ? "cursor-pointer" : ""}`}
          onMouseEnter={() => editable && setHovered(i)}
          onMouseLeave={() => editable && setHovered(null)}
          onClick={() => handleClick(i)}
        >
          {isFilled ? (
            <StarFilled fill="#FFD700" stroke="#FFD700" size={28} />
          ) : isHalf ? (
            <StarHalf fill="#FFD700" stroke="#FFD700" size={28} />
          ) : (
            <Star stroke="#FFD700" size={28} />
          )}
        </span>
      );
    }

    return stars;
  };

  return <div className="d-flex justify-content-start">{renderStars()}</div>;
};

export default StarRating;
