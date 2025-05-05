"use client";

import "./HelperCard.css";

interface HelperCardProps {
  name: string;
  category: string;
  rating: number;
  imageUrl?: string;
}

const HelperCard = ({
  name,
  category,
  rating,
  imageUrl,
}: HelperCardProps) => {
  return (
    <div className="helper-card">
      <div className="helper-avatar">
        <img
          src={imageUrl || "/images/default_avatar.svg"}
          alt={`${name}'s profile`}
        />
      </div>
      <div className="helper-info">
        <h4 className="helper-name">{name}</h4>
        <p className="helper-category">{category}</p>
        <div className="helper-stars">
          {Array.from({ length: rating }, (_, i) => (
            <span key={i} className="star">★</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelperCard;
