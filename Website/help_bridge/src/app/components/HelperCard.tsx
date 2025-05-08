"use client";
import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { Review } from "@/app/models/Review";
import StarRating from "./StarRating";
import "./HelperCard.css";

interface HelperCardProps {
  H_id: number;
  name: string;
  category: string | undefined;
  experience: string;
  imageId?: number | null;
}

const HelperCard = ({
  H_id,
  name,
  category,
  experience,
  imageId,
}: HelperCardProps) => {
  const [imageUrl, setImageUrl] = useState<string>("/images/default-avatar.jpg");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      if (!imageId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/images?id=${imageId}`);
        if (!response.ok) throw new Error("Failed to fetch profile image");

        const data = await response.json();
        if (data && data.url) {
          setImageUrl(data.url);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

    // Fetch reviews
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/reviews?helperId=${H_id}`);
          if (!response.ok) throw new Error("Failed to fetch reviews");
  
          const data = await response.json();
          setReviews(data);
  
          // Calculate average rating
          if (data.length > 0) {
            const avg = data.reduce((sum: number, review: Review) => sum + review.Rating, 0) / data.length;
            setAverageRating(Math.round(avg * 10) / 10); // Round to 1 decimal
          } else {
            setAverageRating(0);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
  
      fetchReviews();
    }, [H_id]);


  return (
    <div className="helper-card rounded shadow flex-fill">
      <div className="helper-avatar">
        {loading ? (
          <div className="spinner-container">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${name}'s profile`}
            onError={() => setImageUrl("/images/default_avatar.svg")}
            className="profile-img"
          />
        )}
      </div>
      <div className="helper-info">
        <h4 className="helper-name">{name}</h4>
        <p className="helper-category">{category ? category : "No category"}</p>
        <p className="helper-experience">Experience: {experience}</p>
        <StarRating rating={averageRating} />
      </div>
    </div>
  );
};

export default HelperCard;
